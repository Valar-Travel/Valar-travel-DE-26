import { redisCache } from "@/lib/redis-cache"

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  burstAllowance?: number // Extra requests allowed in burst
  backoffMultiplier?: number // Exponential backoff multiplier
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
  backoffDelay?: number
}

export class EnhancedRateLimiter {
  private configs: Map<string, RateLimitConfig> = new Map()

  constructor() {
    // Configure rate limits per API endpoint
    this.configs.set("default", {
      windowMs: 60 * 1000,
      maxRequests: 30,
      burstAllowance: 10,
      backoffMultiplier: 1.2,
    })
  }

  async checkRateLimit(endpoint: string, identifier = "global"): Promise<RateLimitResult> {
    const config = this.configs.get(endpoint) || this.configs.get("default")!
    const key = `rate_limit:${endpoint}:${identifier}`

    try {
      // Get current window data from Redis
      const windowData = await redisCache.get<{
        count: number
        resetTime: number
        backoffUntil?: number
      }>(key)

      const now = Date.now()
      const windowStart = Math.floor(now / config.windowMs) * config.windowMs
      const resetTime = windowStart + config.windowMs

      // Check if we're in backoff period
      if (windowData?.backoffUntil && now < windowData.backoffUntil) {
        return {
          success: false,
          limit: config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter: Math.ceil((windowData.backoffUntil - now) / 1000),
          backoffDelay: windowData.backoffUntil - now,
        }
      }

      // Initialize or reset window if needed
      let currentCount = 0
      if (windowData && windowData.resetTime === resetTime) {
        currentCount = windowData.count
      }

      const totalAllowed = config.maxRequests + (config.burstAllowance || 0)
      const remaining = Math.max(0, totalAllowed - currentCount)
      const success = currentCount < totalAllowed

      if (success) {
        // Increment counter
        await redisCache.set(
          key,
          {
            count: currentCount + 1,
            resetTime,
            backoffUntil: windowData?.backoffUntil,
          },
          { ttl: Math.ceil(config.windowMs / 1000) },
        )
      } else {
        // Apply exponential backoff
        const backoffDelay = this.calculateBackoff(currentCount - totalAllowed, config)
        await redisCache.set(
          key,
          {
            count: currentCount,
            resetTime,
            backoffUntil: now + backoffDelay,
          },
          { ttl: Math.ceil((config.windowMs + backoffDelay) / 1000) },
        )
      }

      return {
        success,
        limit: totalAllowed,
        remaining: success ? remaining - 1 : remaining,
        resetTime,
        retryAfter: success ? undefined : Math.ceil(config.windowMs / 1000),
      }
    } catch (error) {
      console.error("[v0] Rate limiter error:", error)
      // Fail open - allow request if rate limiter fails
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: Date.now() + config.windowMs,
      }
    }
  }

  private calculateBackoff(overageCount: number, config: RateLimitConfig): number {
    const baseDelay = config.windowMs
    const multiplier = config.backoffMultiplier || 1.5
    return Math.min(baseDelay * Math.pow(multiplier, overageCount), 5 * 60 * 1000) // Max 5 minutes
  }

  async recordAPIFailure(endpoint: string, statusCode: number): Promise<void> {
    if (statusCode === 429) {
      const key = `api_failures:${endpoint}`
      const failures = (await redisCache.get<number>(key)) || 0
      await redisCache.set(key, failures + 1, { ttl: 3600 }) // 1 hour
    }
  }

  async getAPIHealth(endpoint: string): Promise<{
    healthy: boolean
    failureCount: number
    recommendedDelay: number
  }> {
    const key = `api_failures:${endpoint}`
    const failures = (await redisCache.get<number>(key)) || 0

    return {
      healthy: failures < 10,
      failureCount: failures,
      recommendedDelay: failures > 5 ? failures * 1000 : 0,
    }
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter()
