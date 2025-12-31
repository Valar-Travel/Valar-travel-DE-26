import { createClient } from "@/lib/supabase/server"
import { ImageStandardizer } from "./image-standardization"

export interface CachedImageData {
  primaryImage: string
  images: string[]
  thumbnails: string[]
  fallbackImage: string
  metadata?: Record<string, any>
}

export class ImageCacheManager {
  private supabase: any
  private imageStandardizer: ImageStandardizer

  constructor() {
    this.imageStandardizer = new ImageStandardizer()
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Get cached images for a property from a specific API source
   */
  async getCachedImages(propertyId: string, apiSource: string): Promise<CachedImageData | null> {
    try {
      const supabase = await this.getSupabaseClient()

      const { data, error } = await supabase
        .from("property_image_cache")
        .select("*")
        .eq("property_id", propertyId)
        .eq("api_source", apiSource)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error || !data) {
        return null
      }

      return {
        primaryImage: data.primary_image_url,
        images: data.secondary_images || [],
        thumbnails: this.generateThumbnailUrls(data.primary_image_url),
        fallbackImage: this.imageStandardizer.getFallbackImage(apiSource),
        metadata: data.image_metadata || {},
      }
    } catch (error) {
      console.error("[v0] Error getting cached images:", error)
      return null
    }
  }

  /**
   * Cache images for a property from API response
   */
  async cacheImages(
    propertyId: string,
    apiSource: string,
    rawImageData: any,
    expirationHours = 24,
  ): Promise<CachedImageData> {
    try {
      const supabase = await this.getSupabaseClient()

      // Standardize images from raw API data
      const standardizedImages = this.imageStandardizer.standardizeImages(rawImageData, apiSource)

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + expirationHours)

      const { data, error } = await supabase
        .from("property_image_cache")
        .upsert(
          {
            property_id: propertyId,
            api_source: apiSource,
            primary_image_url: standardizedImages.primaryImage,
            secondary_images: standardizedImages.images,
            image_metadata: {
              originalCount: standardizedImages.images.length,
              processedAt: new Date().toISOString(),
              cdnProvider: "direct",
            },
            expires_at: expiresAt.toISOString(),
          },
          {
            onConflict: "property_id,api_source",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("[v0] Error caching images:", error)
        // Return standardized images without caching
        return {
          primaryImage: standardizedImages.primaryImage,
          images: standardizedImages.images,
          thumbnails: this.generateThumbnailUrls(standardizedImages.primaryImage),
          fallbackImage: standardizedImages.fallbackImage,
        }
      }

      return {
        primaryImage: standardizedImages.primaryImage,
        images: standardizedImages.images,
        thumbnails: this.generateThumbnailUrls(standardizedImages.primaryImage),
        fallbackImage: standardizedImages.fallbackImage,
        metadata: data.image_metadata,
      }
    } catch (error) {
      console.error("[v0] Error in cacheImages:", error)
      // Fallback to standardized images without caching
      const standardizedImages = this.imageStandardizer.standardizeImages(rawImageData, apiSource)
      return {
        primaryImage: standardizedImages.primaryImage,
        images: standardizedImages.images,
        thumbnails: this.generateThumbnailUrls(standardizedImages.primaryImage),
        fallbackImage: standardizedImages.fallbackImage,
      }
    }
  }

  /**
   * Get or cache images - tries cache first, then API
   */
  async getOrCacheImages(
    propertyId: string,
    apiSource: string,
    rawImageData?: any,
    expirationHours = 24,
  ): Promise<CachedImageData> {
    // Try to get from cache first
    const cachedImages = await this.getCachedImages(propertyId, apiSource)
    if (cachedImages) {
      return cachedImages
    }

    // If no cache and we have raw data, cache it
    if (rawImageData) {
      return await this.cacheImages(propertyId, apiSource, rawImageData, expirationHours)
    }

    // Fallback to default images
    return {
      primaryImage: this.imageStandardizer.getFallbackImage(apiSource),
      images: [],
      thumbnails: [],
      fallbackImage: this.imageStandardizer.getFallbackImage(apiSource),
    }
  }

  /**
   * Generate thumbnail URLs for different sizes
   */
  private generateThumbnailUrls(primaryUrl: string): string[] {
    if (!primaryUrl) return []

    if (primaryUrl.includes("images.unsplash.com")) {
      return [
        `${primaryUrl}?w=150&h=100&fit=crop`,
        `${primaryUrl}?w=300&h=200&fit=crop`,
        `${primaryUrl}?w=400&h=300&fit=crop`,
      ]
    }

    return [primaryUrl, primaryUrl, primaryUrl]
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache(): Promise<number> {
    try {
      const supabase = await this.getSupabaseClient()

      const { data, error } = await supabase.rpc("cleanup_expired_image_cache")

      if (error) {
        console.error("[v0] Error cleaning up expired cache:", error)
        return 0
      }

      return data || 0
    } catch (error) {
      console.error("[v0] Error in cleanupExpiredCache:", error)
      return 0
    }
  }

  /**
   * Invalidate cache for a specific property
   */
  async invalidateCache(propertyId: string, apiSource?: string): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient()

      let query = supabase.from("property_image_cache").delete().eq("property_id", propertyId)

      if (apiSource) {
        query = query.eq("api_source", apiSource)
      }

      const { error } = await query

      if (error) {
        console.error("[v0] Error invalidating cache:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("[v0] Error in invalidateCache:", error)
      return false
    }
  }
}

// Export singleton instance
export const imageCacheManager = new ImageCacheManager()
