// IP-based rate limiter for public endpoints (no authentication required)
// Uses Upstash Redis for distributed rate limiting

import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env["UPSTASH-KV_KV_REST_API_URL"]!,
  token: process.env["UPSTASH-KV_KV_REST_API_TOKEN"]!,
})

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  newsletter: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  contact: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  owners: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  default: { maxRequests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
}

export async function rateLimitByIP(ip: string, endpoint: string): Promise<RateLimitResult> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default
  const key = `ratelimit:${endpoint}:${ip}`
  const now = Date.now()
  const windowStart = now - config.windowMs

  try {
    // Get current request count in the time window
    const requests = await redis.zcount(key, windowStart, now)
    const remaining = Math.max(0, config.maxRequests - requests)
    const resetTime = now + config.windowMs

    if (requests >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime,
      }
    }

    // Add current request to the sorted set
    await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` })

    // Set expiry on the key
    await redis.expire(key, Math.ceil(config.windowMs / 1000))

    // Clean up old entries
    await redis.zremrangebyscore(key, 0, windowStart)

    return {
      success: true,
      limit: config.maxRequests,
      remaining: remaining - 1,
      resetTime,
    }
  } catch (error) {
    console.error("[v0] Rate limiter error:", error)
    // Fail open - allow request if rate limiter fails
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
    }
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}
