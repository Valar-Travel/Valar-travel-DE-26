/**
 * Unsplash Image Mapper
 * Maps page sections to Unsplash API queries and manages image selection
 */

import { UNSPLASH_QUERIES, getQueryConfig, type UnsplashQueryConfig } from "./unsplash-query-config"

export interface ImageMapping {
  section: string
  query: string
  fallbackQueries: string[]
  imageUrl?: string
  photoId?: string
  alt: string
}

/**
 * Generate image mappings for a specific page
 */
export function generatePageImageMappings(page: string, destination?: string): ImageMapping[] {
  const mappings: ImageMapping[] = []

  switch (page) {
    case "home":
      // Hero image
      mappings.push({
        section: "hero",
        query: UNSPLASH_QUERIES.home.hero.primary,
        fallbackQueries: UNSPLASH_QUERIES.home.hero.fallback || [],
        alt: "Luxury Caribbean villa with ocean view",
      })

      // Destination cards
      Object.entries(UNSPLASH_QUERIES.home.destinationCards).forEach(([dest, config]) => {
        mappings.push({
          section: `destination-card-${dest}`,
          query: config.primary,
          fallbackQueries: config.fallback || [],
          alt: `${dest.charAt(0).toUpperCase() + dest.slice(1)} destination`,
        })
      })

      // Featured villas
      mappings.push({
        section: "featured-villas",
        query: UNSPLASH_QUERIES.home.featuredVillas.primary,
        fallbackQueries: UNSPLASH_QUERIES.home.featuredVillas.fallback || [],
        alt: "Featured luxury Caribbean villas",
      })
      break

    case "destination":
      if (destination && destination in UNSPLASH_QUERIES.destinations) {
        const destConfig = UNSPLASH_QUERIES.destinations[destination as keyof typeof UNSPLASH_QUERIES.destinations]

        // Hero
        mappings.push({
          section: "hero",
          query: destConfig.hero.primary,
          fallbackQueries: destConfig.hero.fallback || [],
          alt: `${destination} hero image`,
        })

        // Villas
        Object.entries(destConfig.villas).forEach(([villaType, config]) => {
          mappings.push({
            section: `villa-${villaType}`,
            query: config.primary,
            fallbackQueries: config.fallback || [],
            alt: `${destination} ${villaType} villa`,
          })
        })

        // Activities
        if (destConfig.activities) {
          Object.entries(destConfig.activities).forEach(([activity, config]) => {
            mappings.push({
              section: `activity-${activity}`,
              query: config.primary,
              fallbackQueries: config.fallback || [],
              alt: `${destination} ${activity} activity`,
            })
          })
        }
      }
      break

    case "villas":
      // Villa types
      Object.entries(UNSPLASH_QUERIES.villas.types).forEach(([type, config]) => {
        mappings.push({
          section: `villa-type-${type}`,
          query: config.primary,
          fallbackQueries: config.fallback || [],
          alt: `${type} villa`,
        })
      })

      // Villa features
      Object.entries(UNSPLASH_QUERIES.villas.features).forEach(([feature, config]) => {
        mappings.push({
          section: `villa-feature-${feature}`,
          query: config.primary,
          fallbackQueries: config.fallback || [],
          alt: `Villa ${feature}`,
        })
      })
      break
  }

  return mappings
}

/**
 * Get recommended search query for a specific context
 */
export function getRecommendedQuery(context: {
  page: string
  section?: string
  destination?: string
  villaType?: string
  feature?: string
}): UnsplashQueryConfig | null {
  const { page, section, destination, villaType, feature } = context

  // Build path to query config
  const path: string[] = []

  if (page === "home") {
    path.push("home")
    if (section) path.push(section)
  } else if (page === "destination" && destination) {
    path.push("destinations", destination)
    if (section) path.push(section)
  } else if (page === "villas") {
    path.push("villas")
    if (villaType) path.push("types", villaType)
    if (feature) path.push("features", feature)
  } else if (page === "experiences" && section) {
    path.push("experiences", section)
  } else if (page === "blog" && section) {
    path.push("blog", section)
  }

  return getQueryConfig(path)
}

/**
 * Generate alt text based on context
 */
export function generateAltText(context: {
  destination?: string
  villaName?: string
  feature?: string
  activity?: string
}): string {
  const { destination, villaName, feature, activity } = context

  if (villaName && destination) {
    return `${villaName} luxury villa in ${destination}`
  }
  if (feature && destination) {
    return `${feature} at luxury villa in ${destination}`
  }
  if (activity && destination) {
    return `${activity} in ${destination}`
  }
  if (destination) {
    return `Luxury villa destination in ${destination}`
  }

  return "Luxury Caribbean villa"
}
