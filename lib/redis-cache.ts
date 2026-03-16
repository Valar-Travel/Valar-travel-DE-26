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
  }
} catch {
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
      return null
    }

    try {
      const fullKey = `${options.prefix || this.keyPrefix}${key}`
      const data = await redis!.get(fullKey)

      if (data === null || data === undefined) {
        return null
      }

      if (typeof data === "string") {
        const trimmedData = data.trim()
        if (trimmedData.startsWith("<!DOCTYPE") || trimmedData.startsWith("<html")) {
          return null
        }

        if (trimmedData.startsWith("{") || trimmedData.startsWith("[")) {
          try {
            return JSON.parse(trimmedData) as T
          } catch {
            return null
          }
        }
      }

      return data as T
    } catch {
      return null
    }
  }

  /**
   * Set cached data with TTL
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    if (!this.isRedisAvailable()) {
      return false
    }

    try {
      const fullKey = `${options.prefix || this.keyPrefix}${key}`
      const ttl = options.ttl || this.defaultTTL

      if (value === null || value === undefined) {
        return false
      }

      await redis!.setex(fullKey, ttl, value)
      return true
    } catch {
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
      return true
    } catch {
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
        return null
      }

      const key = `csv_properties:${city.toLowerCase()}`
      const result = await this.get<any[]>(key)

      if (result && Array.isArray(result)) {
        return result
      }

      return null
    } catch {
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
      return keys.length
    } catch {
      return 0
    }
  }

  /**
   * Test Redis connection health
   */
  async testConnection(): Promise<boolean> {
    if (!this.isRedisAvailable()) {
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
      return isHealthy
    } catch {
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
