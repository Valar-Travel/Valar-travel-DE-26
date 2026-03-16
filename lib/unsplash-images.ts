/**
 * Minimal Unsplash Image Fallbacks
 * Used only as fallback images when property images are unavailable
 */

export interface UnsplashImage {
  id: string
  photoId: string
  url: string
  alt: string
  usage: string
}

// Minimal fallback images only
export const UNSPLASH_IMAGES = {
  // Home Page Images (used by page.client.tsx)
  home: {
    hero: {
      id: "home-hero",
      photoId: "1506905925346-21bda4d32df4",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      alt: "Caribbean beach paradise",
      usage: "Home page hero",
    },
    barbadosCard: {
      id: "home-barbados-card",
      photoId: "1589394815804-964ed0be2eb5",
      url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5",
      alt: "Barbados beach",
      usage: "Home page Barbados card",
    },
    stLuciaCard: {
      id: "home-stlucia-card",
      photoId: "1606146485303-b5c4b7e4e1e8",
      url: "https://images.unsplash.com/photo-1606146485303-b5c4b7e4e1e8",
      alt: "St. Lucia Pitons",
      usage: "Home page St. Lucia card",
    },
    jamaicaCard: {
      id: "home-jamaica-card",
      photoId: "1580541631950-7282082b53ce",
      url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce",
      alt: "Jamaica beach",
      usage: "Home page Jamaica card",
    },
    stBarthsCard: {
      id: "home-stbarths-card",
      photoId: "1559827260-dc66d52bef19",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      alt: "St. Barthélemy harbor",
      usage: "Home page St. Barths card",
    },
    villa1: {
      id: "home-villa-1",
      photoId: "1613490493576-7fde63acd811",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      alt: "Luxury Caribbean villa",
      usage: "Home page villa 1",
    },
    villa2: {
      id: "home-villa-2",
      photoId: "1582268611958-ebfd161ef9cf",
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
      alt: "Tropical luxury villa",
      usage: "Home page villa 2",
    },
    villa3: {
      id: "home-villa-3",
      photoId: "1564013799919-ab600027ffc6",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      alt: "Modern luxury villa",
      usage: "Home page villa 3",
    },
  },
  // Destination fallback images
  barbados: {
    villa1: {
      id: "barbados-villa-1",
      photoId: "1602343168775-3d4c86d0a0b7",
      url: "https://images.unsplash.com/photo-1602343168775-3d4c86d0a0b7",
      alt: "Barbados luxury villa",
      usage: "Barbados fallback",
    },
  },
  stLucia: {
    villa1: {
      id: "stlucia-villa-1",
      photoId: "1600585154340-be6161a56a0c",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      alt: "St. Lucia villa",
      usage: "St. Lucia fallback",
    },
  },
  jamaica: {
    villa1: {
      id: "jamaica-villa-1",
      photoId: "1600607687920-4e2a09cf159d",
      url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      alt: "Jamaica villa",
      usage: "Jamaica fallback",
    },
  },
  stBarthelemy: {
    villa1: {
      id: "stbarths-villa-1",
      photoId: "1600607688969-a5bfcd646154",
      url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
      alt: "St. Barths villa",
      usage: "St. Barths fallback",
    },
  },
} as const

/**
 * Get image URL with size parameters
 */
export function getImageUrl(image: UnsplashImage, width = 800, quality = 80): string {
  const url = new URL(image.url)
  url.searchParams.set("w", width.toString())
  url.searchParams.set("q", quality.toString())
  url.searchParams.set("auto", "format")
  url.searchParams.set("fit", "crop")
  return url.toString()
}
