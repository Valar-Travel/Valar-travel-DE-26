interface StandardImageData {
  primaryImage: string
  images: string[]
  thumbnails: {
    small: string
    medium: string
    large: string
  }
  fallbackImage: string
}

interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: "webp" | "jpg" | "png"
  crop?: "fill" | "fit" | "crop"
}

export class ImageStandardizer {
  private static readonly FALLBACK_IMAGES = {
    hotel: "/images/fallback-luxury-hotel.jpg",
    resort: "/images/fallback-luxury-resort.jpg",
    villa: "/images/fallback-luxury-villa.jpg",
    apartment: "/images/fallback-luxury-apartment.jpg",
    car: "/images/fallback-car-rental.jpg",
    flight: "/images/fallback-flight.jpg",
    activity: "/images/fallback-activity.jpg",
    default: "/images/fallback-luxury-property.jpg",
  }

  /**
   * Standardizes image data from any travel service API
   */
  static standardizeImages(
    rawImageData: any,
    serviceType: "hotel" | "car" | "flight" | "activity",
    propertyName?: string,
  ): StandardImageData {
    const images = this.extractImages(rawImageData, serviceType)
    const primaryImage = images[0] || this.getFallbackImage(serviceType, propertyName)

    return {
      primaryImage: this.optimizeImage(primaryImage, { width: 400, height: 300, quality: 85 }),
      images: images.map((img) => this.optimizeImage(img, { width: 800, height: 600, quality: 90 })),
      thumbnails: {
        small: this.optimizeImage(primaryImage, { width: 150, height: 150, crop: "fill" }),
        medium: this.optimizeImage(primaryImage, { width: 300, height: 300, crop: "fill" }),
        large: this.optimizeImage(primaryImage, { width: 600, height: 600, crop: "fill" }),
      },
      fallbackImage: this.getFallbackImage(serviceType, propertyName),
    }
  }

  /**
   * Extracts images from various API response formats
   */
  private static extractImages(rawData: any, serviceType: string): string[] {
    const images: string[] = []

    // Handle different API response formats
    if (rawData.optimizedThumbUrls?.srpDesktop) {
      images.push(rawData.optimizedThumbUrls.srpDesktop)
    }

    if (rawData.images && Array.isArray(rawData.images)) {
      rawData.images.forEach((img: any) => {
        if (typeof img === "string") {
          images.push(img)
        } else if (img.sizes) {
          const largeSize = img.sizes.find((size: any) => size.suffix === "_y" || size.suffix === "_z")
          if (largeSize?.url) images.push(largeSize.url)
        } else if (img.links) {
          const largeLink = img.links["350px"] || img.links["200px"] || img.links["70px"]
          if (largeLink?.href) images.push(largeLink.href)
        }
      })
    }

    // Handle single image fields
    const singleImageFields = [
      "image",
      "imageUrl",
      "image_url",
      "photoUrl",
      "photo_url",
      "primaryImage",
      "mainImage",
      "heroImage",
    ]

    singleImageFields.forEach((field) => {
      if (rawData[field] && typeof rawData[field] === "string") {
        images.push(rawData[field])
      }
    })

    // Remove duplicates and invalid URLs
    return [...new Set(images)].filter(
      (img) => img && typeof img === "string" && (img.startsWith("http") || img.startsWith("/")),
    )
  }

  /**
   * Optimizes image through CDN with specified transformations
   */
  private static optimizeImage(imageUrl: string, options: ImageTransformOptions = {}): string {
    if (!imageUrl || imageUrl.startsWith("/placeholder.svg")) {
      return imageUrl
    }

    // If it's already a local image, return as-is
    if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) {
      return imageUrl
    }

    // Use image proxy for external images
    const proxyUrl = new URL(
      "/api/image-proxy",
      typeof window !== "undefined" ? window.location.origin : "https://localhost:3000",
    )

    proxyUrl.searchParams.set("url", encodeURIComponent(imageUrl))

    if (options.width) proxyUrl.searchParams.set("w", options.width.toString())
    if (options.height) proxyUrl.searchParams.set("h", options.height.toString())
    if (options.quality) proxyUrl.searchParams.set("q", options.quality.toString())
    if (options.format) proxyUrl.searchParams.set("f", options.format)
    if (options.crop) proxyUrl.searchParams.set("c", options.crop)

    return proxyUrl.toString()
  }

  /**
   * Gets appropriate fallback image based on service type and property name
   */
  private static getFallbackImage(serviceType: string, propertyName?: string): string {
    if (serviceType === "hotel" && propertyName) {
      const name = propertyName.toLowerCase()
      if (name.includes("resort")) return this.FALLBACK_IMAGES.resort
      if (name.includes("villa")) return this.FALLBACK_IMAGES.villa
      if (name.includes("apartment")) return this.FALLBACK_IMAGES.apartment
    }

    return this.FALLBACK_IMAGES[serviceType as keyof typeof this.FALLBACK_IMAGES] || this.FALLBACK_IMAGES.default
  }

  /**
   * Generates placeholder image with specific query
   */
  static generatePlaceholder(query: string, width = 400, height = 300): string {
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
  }

  /**
   * Validates if an image URL is accessible
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    } catch {
      return false
    }
  }
}

// Utility functions for backward compatibility
export function standardizeHotelImages(hotelData: any): StandardImageData {
  return ImageStandardizer.standardizeImages(hotelData, "hotel", hotelData.name)
}

export function standardizeCarImages(carData: any): StandardImageData {
  return ImageStandardizer.standardizeImages(carData, "car", carData.name)
}

export function standardizeFlightImages(flightData: any): StandardImageData {
  return ImageStandardizer.standardizeImages(flightData, "flight", flightData.destination)
}

export function standardizeActivityImages(activityData: any): StandardImageData {
  return ImageStandardizer.standardizeImages(activityData, "activity", activityData.name)
}
