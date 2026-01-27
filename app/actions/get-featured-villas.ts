"use server"

import { createClient } from "@/lib/supabase/server"

export interface FeaturedVilla {
  id: string
  name: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  guests: number
  image: string
  rating: number
}

async function fetchWithRetry<T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000,
): Promise<{ data: T | null; error: any }> {
  for (let i = 0; i < retries; i++) {
    const result = await fn()
    if (!result.error) return result
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }
  return await fn()
}

export async function getFeaturedVillas(): Promise<FeaturedVilla[]> {
  try {
    const supabase = await createClient()

    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

    const { data: properties, error } = await fetchWithRetry(() =>
      supabase
        .from("scraped_luxury_properties")
        .select("*")
        .not("images", "is", null)
        .order("rating", { ascending: false })
        .limit(100),
    )

    if (error || !properties || properties.length === 0) {
      return []
    }

    const validProperties = properties.filter(
      (p) => p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0],
    )

    if (validProperties.length === 0) {
      return []
    }

    const offset = (dayOfYear * 3) % validProperties.length
    const selectedVillas: FeaturedVilla[] = []

    for (let i = 0; i < 3; i++) {
      const index = (offset + i) % validProperties.length
      const property = validProperties[index]

      selectedVillas.push({
        id: property.id,
        name: property.name || "Luxury Villa",
        location: property.location || "Barbados",
        price: property.price_per_night || 500,
        bedrooms: property.bedrooms || 3,
        bathrooms: property.bathrooms || 2,
        guests: property.max_guests || property.guests || (property.bedrooms || 3) * 2,
        image: property.images[0],
        rating: property.rating || 4.8,
      })
    }

    return selectedVillas
  } catch {
    return []
  }
}
