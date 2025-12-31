interface ImageTransformation {
  width?: number
  height?: number
  quality?: number
  format?: "webp" | "jpg" | "png" | "auto"
  crop?: "fill" | "fit" | "scale" | "crop"
  gravity?: "center" | "face" | "auto"
}

interface ImageServiceConfig {
  fallbackImages: {
    hotel: string
    resort: string
    villa: string
    apartment: string
    default: string
  }
}

class ImageService {
  private config: ImageServiceConfig

  constructor(config: ImageServiceConfig) {
    this.config = config
  }

  optimizeImage(url: string, transformations: ImageTransformation = {}): string {
    if (!url || url.includes("placeholder.svg")) return url
    return url
  }

  getFallbackImage(propertyType = "hotel"): string {
    const type = propertyType.toLowerCase()
    if (type.includes("resort")) return this.config.fallbackImages.resort
    if (type.includes("villa")) return this.config.fallbackImages.villa
    if (type.includes("apartment")) return this.config.fallbackImages.apartment
    if (type.includes("hotel")) return this.config.fallbackImages.hotel
    return this.config.fallbackImages.default
  }

  async validateImage(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok && response.headers.get("content-type")?.startsWith("image/")
    } catch {
      return false
    }
  }

  processPropertyImages(images: string[], propertyType: string, transformations: ImageTransformation = {}): string[] {
    return images
      .map((url) => {
        if (!url) return this.getFallbackImage(propertyType)
        return this.optimizeImage(url, transformations)
      })
      .filter(Boolean)
  }
}

export const imageService = new ImageService({
  fallbackImages: {
    hotel: "/images/fallback-luxury-hotel.jpg",
    resort: "/images/fallback-luxury-resort.jpg",
    villa: "/images/fallback-luxury-villa.jpg",
    apartment: "/images/fallback-luxury-apartment.jpg",
    default: "/images/fallback-luxury-property.jpg",
  },
})

export type { ImageTransformation, ImageServiceConfig }
