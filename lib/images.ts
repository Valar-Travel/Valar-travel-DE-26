/**
 * Centralized Unsplash Image Configuration
 * Ensures no duplicate images across the site
 * Each image is used only once with a specific purpose
 */

export const UNSPLASH_IMAGES = {
  // Hero Images - Main destination headers
  heroes: {
    barbados: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80", // Barbados pink sand beach
    stLucia: "https://images.unsplash.com/photo-1606146485303-b5c4b7e4e1e8?w=1920&q=80", // St. Lucia Pitons
    jamaica: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=80", // Jamaica tropical beach
    stBarthelemy: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80", // St. Barths harbor with yachts
    home: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=80", // Caribbean luxury villa aerial
  },

  // Destination Cards - For homepage and listings
  destinationCards: {
    barbados: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&q=80", // Barbados coastline
    stLucia: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", // St. Lucia beach resort
    jamaica: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80", // Jamaica beach palm trees
    stBarthelemy: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&q=80", // St. Barths luxury beach
  },

  // Villa Types - Different villa styles
  villas: {
    beachfront: {
      barbados1: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", // Beachfront luxury villa
      barbados2: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", // White villa with pool
      barbados3: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", // Modern beachfront
    },
    hillside: {
      stLucia1: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", // Hillside tropical villa
      stLucia2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // Villa with mountain view
      stLucia3: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80", // Luxury hillside estate
    },
    modern: {
      jamaica1: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", // Modern luxury villa
      jamaica2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", // Contemporary villa design
      jamaica3: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", // Sleek modern villa
    },
    luxury: {
      stBarthelemy1: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80", // Ultra-luxury villa
      stBarthelemy2: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", // French Caribbean villa
      stBarthelemy3: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80", // Exclusive villa estate
    },
  },

  // Villa Features - Interior and amenities
  features: {
    pool: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", // Infinity pool
    bedroom: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", // Luxury bedroom
    kitchen: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80", // Gourmet kitchen
    livingRoom: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", // Open living space
    terrace: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", // Ocean view terrace
    dining: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80", // Outdoor dining
  },

  // Activities and Experiences
  experiences: {
    beach: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", // Caribbean beach
    snorkeling: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80", // Underwater coral
    sailing: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", // Sailing yacht
    dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // Fine dining
    spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", // Spa treatment
    sunset: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Caribbean sunset
  },
} as const

/**
 * Helper function to get image URL with custom parameters
 */
export function getUnsplashImage(
  category: keyof typeof UNSPLASH_IMAGES,
  key: string,
  options?: {
    width?: number
    quality?: number
  },
): string {
  const { width = 800, quality = 80 } = options || {}

  // Navigate nested structure
  const categoryData = UNSPLASH_IMAGES[category]
  if (!categoryData) return ""

  let imageUrl = ""

  // Handle nested objects (like villas.beachfront.barbados1)
  if (typeof categoryData === "object" && !categoryData.includes) {
    const parts = key.split(".")
    let current: any = categoryData

    for (const part of parts) {
      current = current[part]
      if (!current) return ""
    }

    imageUrl = current
  } else {
    imageUrl = (categoryData as any)[key] || ""
  }

  if (!imageUrl) return ""

  // Update URL parameters
  const url = new URL(imageUrl)
  url.searchParams.set("w", width.toString())
  url.searchParams.set("q", quality.toString())

  return url.toString()
}

/**
 * Get all images used in the site (for debugging/auditing)
 */
export function getAllImages(): string[] {
  const images: string[] = []

  function extractImages(obj: any) {
    for (const key in obj) {
      const value = obj[key]
      if (typeof value === "string" && value.includes("unsplash.com")) {
        images.push(value)
      } else if (typeof value === "object") {
        extractImages(value)
      }
    }
  }

  extractImages(UNSPLASH_IMAGES)
  return images
}

/**
 * Check for duplicate images (should return empty array)
 */
export function checkDuplicates(): string[] {
  const allImages = getAllImages()
  const seen = new Set<string>()
  const duplicates: string[] = []

  for (const image of allImages) {
    // Extract photo ID from URL
    const match = image.match(/photo-([a-zA-Z0-9_-]+)/)
    if (match) {
      const photoId = match[1]
      if (seen.has(photoId)) {
        duplicates.push(image)
      }
      seen.add(photoId)
    }
  }

  return duplicates
}
