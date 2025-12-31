/**
 * Centralized Unsplash Image Management System
 * Ensures no duplicate images across the site
 * Each image is cataloged with its usage location
 */

export interface UnsplashImage {
  id: string
  photoId: string
  url: string
  alt: string
  usage: string
}

/**
 * All Unsplash images used across the site
 * Each photo ID is unique and used only once
 */
export const UNSPLASH_IMAGES = {
  // Home Page Images
  home: {
    hero: {
      id: "home-hero",
      photoId: "1506905925346-21bda4d32df4",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      alt: "Caribbean beach paradise",
      usage: "Home page hero background",
    },
    barbadosCard: {
      id: "home-barbados-card",
      photoId: "1589394815804-964ed0be2eb5",
      url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5",
      alt: "Barbados beach",
      usage: "Home page Barbados destination card",
    },
    stLuciaCard: {
      id: "home-stlucia-card",
      photoId: "1606146485303-b5c4b7e4e1e8",
      url: "https://images.unsplash.com/photo-1606146485303-b5c4b7e4e1e8",
      alt: "St. Lucia Pitons",
      usage: "Home page St. Lucia destination card",
    },
    jamaicaCard: {
      id: "home-jamaica-card",
      photoId: "1580541631950-7282082b53ce",
      url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce",
      alt: "Jamaica beach",
      usage: "Home page Jamaica destination card",
    },
    stBarthsCard: {
      id: "home-stbarths-card",
      photoId: "1559827260-dc66d52bef19",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      alt: "St. Barthélemy harbor",
      usage: "Home page St. Barths destination card",
    },
    villa1: {
      id: "home-villa-1",
      photoId: "1613490493576-7fde63acd811",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      alt: "Luxury Caribbean villa",
      usage: "Home page featured villa 1",
    },
    villa2: {
      id: "home-villa-2",
      photoId: "1582268611958-ebfd161ef9cf",
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
      alt: "Tropical luxury villa",
      usage: "Home page featured villa 2",
    },
    villa3: {
      id: "home-villa-3",
      photoId: "1564013799919-ab600027ffc6",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      alt: "Modern luxury villa",
      usage: "Home page featured villa 3",
    },
  },

  // Barbados Destination Page
  barbados: {
    hero: {
      id: "barbados-hero",
      photoId: "1544551763-46a013bb70d5",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      alt: "Barbados pristine beach",
      usage: "Barbados page hero",
    },
    villa1: {
      id: "barbados-villa-1",
      photoId: "1602343168775-3d4c86d0a0b7",
      url: "https://images.unsplash.com/photo-1602343168775-3d4c86d0a0b7",
      alt: "Barbados luxury beachfront villa",
      usage: "Barbados villa 1",
    },
    villa2: {
      id: "barbados-villa-2",
      photoId: "1600596542815-ffad4c1539a9",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      alt: "Barbados coral reef estate",
      usage: "Barbados villa 2",
    },
    villa3: {
      id: "barbados-villa-3",
      photoId: "1600607687939-ce8a6c25118c",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      alt: "Barbados Sandy Lane villa",
      usage: "Barbados villa 3",
    },
  },

  // St. Lucia Destination Page
  stLucia: {
    hero: {
      id: "stlucia-hero",
      photoId: "1590523277543-a94d2e4eb00b",
      url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b",
      alt: "St. Lucia Pitons view",
      usage: "St. Lucia page hero",
    },
    villa1: {
      id: "stlucia-villa-1",
      photoId: "1600585154340-be6161a56a0c",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      alt: "St. Lucia ocean breeze estate",
      usage: "St. Lucia villa 1",
    },
    villa2: {
      id: "stlucia-villa-2",
      photoId: "1600607687644-c7171b42498b",
      url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
      alt: "St. Lucia rainforest retreat",
      usage: "St. Lucia villa 2",
    },
    villa3: {
      id: "stlucia-villa-3",
      photoId: "1600566753190-17f0baa2a6c3",
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      alt: "St. Lucia sunset paradise villa",
      usage: "St. Lucia villa 3",
    },
  },

  // Jamaica Destination Page
  jamaica: {
    hero: {
      id: "jamaica-hero",
      photoId: "1544551763-77ef2d0cfc6c",
      url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c",
      alt: "Jamaica tropical beach",
      usage: "Jamaica page hero",
    },
    villa1: {
      id: "jamaica-villa-1",
      photoId: "1600607687920-4e2a09cf159d",
      url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      alt: "Jamaica paradise cove villa",
      usage: "Jamaica villa 1",
    },
    villa2: {
      id: "jamaica-villa-2",
      photoId: "1600585154526-990dced4db0d",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      alt: "Jamaica Negril sunset estate",
      usage: "Jamaica villa 2",
    },
    villa3: {
      id: "jamaica-villa-3",
      photoId: "1600566752355-35792bedcfea",
      url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      alt: "Jamaica Montego Bay retreat",
      usage: "Jamaica villa 3",
    },
  },

  // St. Barthélemy Destination Page
  stBarthelemy: {
    hero: {
      id: "stbarths-hero",
      photoId: "1571896349842-33c89424058d",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424058d",
      alt: "St. Barthélemy luxury harbor",
      usage: "St. Barths page hero",
    },
    villa1: {
      id: "stbarths-villa-1",
      photoId: "1600607688969-a5bfcd646154",
      url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
      alt: "St. Barths Villa Élégance",
      usage: "St. Barths villa 1",
    },
    villa2: {
      id: "stbarths-villa-2",
      photoId: "1600585154363-67eb9e2e2099",
      url: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099",
      alt: "St. Barths Côte d'Azur estate",
      usage: "St. Barths villa 2",
    },
    villa3: {
      id: "stbarths-villa-3",
      photoId: "1600566752734-e8b29f93b4d6",
      url: "https://images.unsplash.com/photo-1600566752734-e8b29f93b4d6",
      alt: "St. Barths Gustavia harbor villa",
      usage: "St. Barths villa 3",
    },
  },
} as const

/**
 * Get image URL with optional size parameters
 */
export function getImageUrl(image: UnsplashImage, width?: number, quality = 80): string {
  const url = new URL(image.url)
  if (width) url.searchParams.set("w", width.toString())
  url.searchParams.set("q", quality.toString())
  url.searchParams.set("auto", "format")
  url.searchParams.set("fit", "crop")
  return url.toString()
}

/**
 * Validate that no duplicate photo IDs exist
 */
export function validateUniqueImages(): { isValid: boolean; duplicates: string[] } {
  const photoIds = new Set<string>()
  const duplicates: string[] = []

  const checkImages = (obj: any) => {
    for (const key in obj) {
      if (obj[key].photoId) {
        if (photoIds.has(obj[key].photoId)) {
          duplicates.push(obj[key].photoId)
        }
        photoIds.add(obj[key].photoId)
      } else if (typeof obj[key] === "object") {
        checkImages(obj[key])
      }
    }
  }

  checkImages(UNSPLASH_IMAGES)

  return {
    isValid: duplicates.length === 0,
    duplicates,
  }
}

// The validation can still be called manually during development if needed
