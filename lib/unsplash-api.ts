/**
 * Unsplash API Integration
 * Official Unsplash SDK wrapper with utility functions
 */

import { createApi } from "unsplash-js"

// Initialize Unsplash API client
// Note: This should only be used on the server side
export function createUnsplashClient() {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn("UNSPLASH_ACCESS_KEY is not set. Unsplash API features will be disabled.")
    return null
  }

  return createApi({
    accessKey,
  })
}

// Singleton instance for server-side use
let unsplashClient: ReturnType<typeof createApi> | null = null

export function getUnsplashClient() {
  if (!unsplashClient) {
    unsplashClient = createUnsplashClient()
  }
  return unsplashClient
}

/**
 * Search for photos on Unsplash
 */
export async function searchUnsplashPhotos(query: string, page = 1, perPage = 10) {
  const client = getUnsplashClient()

  if (!client) {
    throw new Error("Unsplash API client is not initialized")
  }

  try {
    const result = await client.search.getPhotos({
      query,
      page,
      perPage,
      orientation: "landscape",
    })

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors)
      throw new Error(result.errors[0])
    }

    return result.response
  } catch (error) {
    console.error("Error searching Unsplash photos:", error)
    throw error
  }
}

/**
 * Get a random photo from Unsplash
 */
export async function getRandomUnsplashPhoto(
  query?: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
) {
  const client = getUnsplashClient()

  if (!client) {
    throw new Error("Unsplash API client is not initialized")
  }

  try {
    const result = await client.photos.getRandom({
      query,
      orientation,
      count: 1,
    })

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors)
      throw new Error(result.errors[0])
    }

    return Array.isArray(result.response) ? result.response[0] : result.response
  } catch (error) {
    console.error("Error getting random Unsplash photo:", error)
    throw error
  }
}

/**
 * Get a specific photo by ID
 */
export async function getUnsplashPhotoById(id: string) {
  const client = getUnsplashClient()

  if (!client) {
    throw new Error("Unsplash API client is not initialized")
  }

  try {
    const result = await client.photos.get({ photoId: id })

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors)
      throw new Error(result.errors[0])
    }

    return result.response
  } catch (error) {
    console.error("Error getting Unsplash photo:", error)
    throw error
  }
}

/**
 * Track download for Unsplash photo (required by Unsplash API guidelines)
 */
export async function trackUnsplashDownload(downloadLocation: string) {
  const client = getUnsplashClient()

  if (!client) {
    return
  }

  try {
    await client.photos.trackDownload({ downloadLocation })
  } catch (error) {
    console.error("Error tracking Unsplash download:", error)
  }
}

/**
 * Format Unsplash photo URL with custom dimensions and quality
 */
export function formatUnsplashUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    fit?: "crop" | "max" | "fill"
  } = {},
) {
  const { width, height, quality = 80, fit = "crop" } = options

  const urlObj = new URL(url)

  if (width) urlObj.searchParams.set("w", width.toString())
  if (height) urlObj.searchParams.set("h", height.toString())
  urlObj.searchParams.set("q", quality.toString())
  urlObj.searchParams.set("fit", fit)
  urlObj.searchParams.set("auto", "format")

  return urlObj.toString()
}

/**
 * Extract photo ID from Unsplash URL
 */
export function extractUnsplashPhotoId(url: string): string | null {
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}
