import { enhancedRateLimiter } from "@/lib/enhanced-rate-limiter"

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryableStatuses: number[]
}

export class APIRetryHandler {
  private defaultConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
    retryableStatuses: [429, 500, 502, 503, 504],
  }

  async executeWithRetry<T>(
    operation: () => Promise<Response>,
    endpoint: string,
    config: Partial<RetryConfig> = {},
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config }
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        // Check API health before attempt
        const health = await enhancedRateLimiter.getAPIHealth(endpoint)
        if (!health.healthy && health.recommendedDelay > 0) {
          console.log(`[v0] API ${endpoint} unhealthy, waiting ${health.recommendedDelay}ms`)
          await this.delay(health.recommendedDelay)
        }

        const response = await operation()

        // Success case
        if (response.ok) {
          const data = await response.json()
          console.log(`[v0] API call succeeded for ${endpoint} on attempt ${attempt + 1}`)
          return data
        }

        // Record failure for health tracking
        await enhancedRateLimiter.recordAPIFailure(endpoint, response.status)

        // Check if status is retryable
        if (!finalConfig.retryableStatuses.includes(response.status)) {
          throw new Error(`Non-retryable error: ${response.status} ${response.statusText}`)
        }

        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = this.parseRetryAfter(response.headers.get("retry-after"))
          const delay = retryAfter || this.calculateBackoffDelay(attempt, finalConfig)

          console.log(`[v0] Rate limited on ${endpoint}, waiting ${delay}ms before retry ${attempt + 1}`)
          await this.delay(delay)
          continue
        }

        // Other retryable errors
        if (attempt < finalConfig.maxRetries) {
          const delay = this.calculateBackoffDelay(attempt, finalConfig)
          console.log(
            `[v0] API error ${response.status} on ${endpoint}, retrying in ${delay}ms (attempt ${attempt + 1})`,
          )
          await this.delay(delay)
          continue
        }

        throw new Error(`API error after ${finalConfig.maxRetries} retries: ${response.status} ${response.statusText}`)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (attempt < finalConfig.maxRetries) {
          const delay = this.calculateBackoffDelay(attempt, finalConfig)
          console.log(
            `[v0] Network error on ${endpoint}, retrying in ${delay}ms (attempt ${attempt + 1}):`,
            lastError.message,
          )
          await this.delay(delay)
          continue
        }
      }
    }

    throw lastError || new Error(`Failed after ${finalConfig.maxRetries} retries`)
  }

  private calculateBackoffDelay(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt)
    return Math.min(delay, config.maxDelay)
  }

  private parseRetryAfter(retryAfterHeader: string | null): number | null {
    if (!retryAfterHeader) return null

    const seconds = Number.parseInt(retryAfterHeader, 10)
    return isNaN(seconds) ? null : seconds * 1000
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    endpoint: string,
  ): Promise<{ data: T; source: "primary" | "fallback" }> {
    try {
      const data = await this.executeWithRetry<T>(primaryOperation as () => Promise<Response>, endpoint)
      return { data, source: "primary" }
    } catch (error) {
      console.log(`[v0] Primary API failed for ${endpoint}, using fallback:`, error)
      const data = await fallbackOperation()
      return { data, source: "fallback" }
    }
  }
}

export const apiRetryHandler = new APIRetryHandler()
