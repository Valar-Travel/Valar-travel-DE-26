import { Redis } from "@upstash/redis"

// Initialize Redis client
let redis: Redis | null = null
let redisAvailable = false

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    redisAvailable = true
    console.log("[v0] Redis client initialized successfully")
  } else {
    console.warn("[v0] Redis environment variables not available, running without cache")
  }
} catch (error) {
  console.error("[v0] Failed to initialize Redis client:", error)
  redisAvailable = false
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds (default: 1 hour)
  prefix?: string // Cache key prefix
}

export class RedisCache {
  private defaultTTL = 3600 // 1 hour in seconds
  private keyPrefix = "valar_travel:"

  /**
   * Check if Redis is available
   */
  private isRedisAvailable(): boolean {
    return redisAvailable && redis !== null
  }

  /**
   * Get cached data by key
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.isRedisAvailable()) {
      console.log("[v0] Redis not available, skipping cache get")
      return null
    }

    try {
      const fullKey = `${options.prefix || this.keyPrefix}${key}`
      const data = await redis!.get(fullKey)

      if (data === null || data === undefined) {
        console.log(`[v0] Cache miss for key: ${fullKey}`)
        return null
      }

      if (typeof data === "string") {
        const trimmedData = data.trim()
        if (trimmedData.startsWith("<!DOCTYPE") || trimmedData.startsWith("<html")) {
          console.error(`[v0] Redis returned HTML error page for key: ${fullKey}`, {
            preview: trimmedData.substring(0, 100),
            url: process.env.KV_REST_API_URL?.substring(0, 50) + "...",
            tokenLength: process.env.KV_REST_API_TOKEN?.length || 0,
          })
          return null
        }

        if (trimmedData.startsWith("{") || trimmedData.startsWith("[")) {
          try {
            return JSON.parse(trimmedData) as T
          } catch (parseError) {
            console.error(`[v0] Failed to parse JSON from Redis for key: ${fullKey}`, parseError)
            return null
          }
        }
      }

      console.log(`[v0] Cache hit for key: ${fullKey}`)
      return data as T
    } catch (error: any) {
      console.error("[v0] Redis get error:", {
        message: error.message,
        stack: error.stack?.split("\n")[0], // First line of stack trace
        key: `${options.prefix || this.keyPrefix}${key}`,
        url: process.env.KV_REST_API_URL ? `${process.env.KV_REST_API_URL.substring(0, 30)}...` : "missing",
        token: process.env.KV_REST_API_TOKEN ? `${process.env.KV_REST_API_TOKEN.length} chars` : "missing",
        errorType: error.constructor.name,
        redisClientStatus: "unknown",
      })
      return null
    }
  }

  /**
   * Set cached data with TTL
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    if (!this.isRedisAvailable()) {
      console.log("[v0] Redis not available, skipping cache set")
      return false
    }

    try {
      const fullKey = `${options.prefix || this.keyPrefix}${key}`
      const ttl = options.ttl || this.defaultTTL

      if (value === null || value === undefined) {
        console.warn(`[v0] Attempted to cache null/undefined value for key: ${fullKey}`)
        return false
      }

      await redis!.setex(fullKey, ttl, value)
      console.log(`[v0] Cached data for key: ${fullKey} (TTL: ${ttl}s)`)
      return true
    } catch (error: any) {
      console.error("[v0] Redis set error:", {
        message: error.message,
        key: `${options.prefix || this.keyPrefix}${key}`,
      })
      return false
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.isRedisAvailable()) {
      return false
    }

    try {
      const fullKey = `${options.prefix || this.keyPrefix}${key}`
      await redis!.del(fullKey)
      console.log(`[v0] Deleted cache for key: ${fullKey}`)
      return true
    } catch (error) {
      console.error("[v0] Redis delete error:", error)
      return false
    }
  }

  /**
   * Cache CSV property data
   */
  async cacheCSVProperties(city: string, properties: any[]): Promise<boolean> {
    const key = `csv_properties:${city.toLowerCase()}`
    return await this.set(key, properties, { ttl: 7200 }) // 2 hours
  }

  /**
   * Get cached CSV properties
   */
  async getCachedCSVProperties(city: string): Promise<any[] | null> {
    try {
      if (!this.isRedisAvailable()) {
        console.log(`[v0] Redis not available, skipping cache check for ${city} properties`)
        return null
      }

      const key = `csv_properties:${city.toLowerCase()}`
      console.log(`[v0] Attempting to get cached CSV properties for ${city}`)

      const result = await this.get<any[]>(key)

      if (result && Array.isArray(result)) {
        console.log(`[v0] Found ${result.length} cached properties for ${city}`)
        return result
      }

      console.log(`[v0] No valid cached properties found for ${city}`)
      return null
    } catch (error: any) {
      console.error(`[v0] Error getting cached CSV properties for ${city}:`, {
        message: error.message,
        city: city,
        redisAvailable: this.isRedisAvailable(),
      })
      return null
    }
  }

  /**
   * Cache API responses
   */
  async cacheAPIResponse(endpoint: string, params: Record<string, any>, data: any): Promise<boolean> {
    const key = `api:${endpoint}:${this.hashParams(params)}`
    return await this.set(key, data, { ttl: 1800 }) // 30 minutes
  }

  /**
   * Get cached API response
   */
  async getCachedAPIResponse(endpoint: string, params: Record<string, any>): Promise<any | null> {
    const key = `api:${endpoint}:${this.hashParams(params)}`
    return await this.get(key)
  }

  /**
   * Cache image optimization results
   */
  async cacheImageOptimization(originalUrl: string, optimizedUrl: string): Promise<boolean> {
    const key = `image:${this.hashString(originalUrl)}`
    return await this.set(key, { originalUrl, optimizedUrl }, { ttl: 86400 }) // 24 hours
  }

  /**
   * Get cached image optimization
   */
  async getCachedImageOptimization(originalUrl: string): Promise<{ originalUrl: string; optimizedUrl: string } | null> {
    const key = `image:${this.hashString(originalUrl)}`
    return await this.get(key)
  }

  /**
   * Clear all cache with prefix
   */
  async clearCache(pattern = "*"): Promise<number> {
    try {
      const keys = await redis!.keys(`${this.keyPrefix}${pattern}`)
      if (keys.length === 0) return 0

      await redis!.del(...keys)
      console.log(`[v0] Cleared ${keys.length} cache entries`)
      return keys.length
    } catch (error) {
      console.error("[v0] Redis clear cache error:", error)
      return 0
    }
  }

  /**
   * Test Redis connection health
   */
  async testConnection(): Promise<boolean> {
    if (!this.isRedisAvailable()) {
      console.log("[v0] Redis not available for health check")
      return false
    }

    try {
      const testKey = `${this.keyPrefix}health_check`
      const testValue = { timestamp: Date.now(), test: true }

      // Test write
      await redis!.setex(testKey, 60, testValue)

      // Test read
      const result = await redis!.get(testKey)

      // Clean up
      await redis!.del(testKey)

      const isHealthy = result && typeof result === "object" && result.test === true
      console.log(`[v0] Redis health check: ${isHealthy ? "PASSED" : "FAILED"}`)

      return isHealthy
    } catch (error: any) {
      console.error("[v0] Redis health check failed:", {
        message: error.message,
        redisAvailable: this.isRedisAvailable(),
      })
      return false
    }
  }

  /**
   * Hash parameters for consistent cache keys
   */
  private hashParams(params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&")
    return this.hashString(sortedParams)
  }

  /**
   * Simple hash function for cache keys
   */
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }
}

// Export singleton instance
export const redisCache = new RedisCache()
