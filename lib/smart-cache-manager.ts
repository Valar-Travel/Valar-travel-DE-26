import { redisCache } from "@/lib/redis-cache"
import { enhancedRateLimiter } from "@/lib/enhanced-rate-limiter"

export interface CacheStrategy {
  ttl: number
  staleWhileRevalidate?: number
  maxAge?: number
  tags?: string[]
}

export interface APIResponse<T = any> {
  data: T
  cached: boolean
  stale: boolean
  timestamp: number
  source: "cache" | "api" | "fallback"
}

export class SmartCacheManager {
  private strategies: Map<string, CacheStrategy> = new Map()

  constructor() {
    // Configure caching strategies per endpoint type
    this.strategies.set("hotels", {
      ttl: 1800, // 30 minutes
      staleWhileRevalidate: 3600, // 1 hour stale acceptable
      maxAge: 7200, // 2 hours absolute max
      tags: ["hotels", "properties"],
    })

    this.strategies.set("flights", {
      ttl: 300, // 5 minutes (prices change frequently)
      staleWhileRevalidate: 900, // 15 minutes stale
      maxAge: 1800, // 30 minutes max
      tags: ["flights", "prices"],
    })

    this.strategies.set("static", {
      ttl: 86400, // 24 hours
      staleWhileRevalidate: 172800, // 48 hours stale
      maxAge: 604800, // 1 week max
      tags: ["static", "destinations"],
    })
  }

  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, strategyType = "hotels"): Promise<APIResponse<T>> {
    const strategy = this.strategies.get(strategyType) || this.strategies.get("hotels")!
    const cacheKey = `smart_cache:${key}`

    try {
      // Try to get from cache first
      const cached = await redisCache.get<{
        data: T
        timestamp: number
        ttl: number
      }>(cacheKey)

      const now = Date.now()

      if (cached) {
        const age = now - cached.timestamp
        const isStale = age > cached.ttl * 1000
        const isExpired = age > strategy.maxAge! * 1000

        // Return cached data if not expired
        if (!isExpired) {
          // Background refresh if stale
          if (isStale && strategy.staleWhileRevalidate) {
            this.backgroundRefresh(key, fetcher, strategyType).catch(console.error)
          }

          return {
            data: cached.data,
            cached: true,
            stale: isStale,
            timestamp: cached.timestamp,
            source: "cache",
          }
        }
      }

      // Check rate limits before making API call
      const rateLimitResult = await enhancedRateLimiter.checkRateLimit(this.extractEndpointFromKey(key))

      if (!rateLimitResult.success) {
        // Return stale data if available during rate limiting
        if (cached) {
          console.log(`[v0] Rate limited, returning stale data for ${key}`)
          return {
            data: cached.data,
            cached: true,
            stale: true,
            timestamp: cached.timestamp,
            source: "cache",
          }
        }

        throw new Error(`Rate limited: retry after ${rateLimitResult.retryAfter}s`)
      }

      // Fetch fresh data
      console.log(`[v0] Fetching fresh data for ${key}`)
      const freshData = await fetcher()

      // Cache the fresh data
      await redisCache.set(
        cacheKey,
        {
          data: freshData,
          timestamp: now,
          ttl: strategy.ttl,
        },
        { ttl: strategy.maxAge },
      )

      return {
        data: freshData,
        cached: false,
        stale: false,
        timestamp: now,
        source: "api",
      }
    } catch (error) {
      console.error(`[v0] Error in getOrFetch for ${key}:`, error)

      // Return stale data as fallback
      const cached = await redisCache.get<{
        data: T
        timestamp: number
        ttl: number
      }>(cacheKey)

      if (cached) {
        console.log(`[v0] Returning stale fallback data for ${key}`)
        return {
          data: cached.data,
          cached: true,
          stale: true,
          timestamp: cached.timestamp,
          source: "fallback",
        }
      }

      throw error
    }
  }

  private async backgroundRefresh<T>(key: string, fetcher: () => Promise<T>, strategyType: string): Promise<void> {
    try {
      console.log(`[v0] Background refreshing ${key}`)
      const strategy = this.strategies.get(strategyType) || this.strategies.get("hotels")!
      const cacheKey = `smart_cache:${key}`

      const freshData = await fetcher()
      await redisCache.set(
        cacheKey,
        {
          data: freshData,
          timestamp: Date.now(),
          ttl: strategy.ttl,
        },
        { ttl: strategy.maxAge },
      )

      console.log(`[v0] Background refresh completed for ${key}`)
    } catch (error) {
      console.error(`[v0] Background refresh failed for ${key}:`, error)
    }
  }

  private extractEndpointFromKey(key: string): string {
    return "default"
  }

  async invalidateByTags(tags: string[]): Promise<number> {
    let invalidated = 0
    for (const tag of tags) {
      const pattern = `smart_cache:*${tag}*`
      invalidated += await redisCache.clearCache(pattern)
    }
    return invalidated
  }

  async warmCache(keys: string[], fetchers: (() => Promise<any>)[]): Promise<void> {
    const promises = keys.map(async (key, index) => {
      try {
        await this.getOrFetch(key, fetchers[index])
      } catch (error) {
        console.error(`[v0] Cache warming failed for ${key}:`, error)
      }
    })

    await Promise.allSettled(promises)
    console.log(`[v0] Cache warming completed for ${keys.length} keys`)
  }
}

export const smartCacheManager = new SmartCacheManager()
