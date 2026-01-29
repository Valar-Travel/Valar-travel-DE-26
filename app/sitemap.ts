import { createClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

const SITE_URL = "https://valartravel.de"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/villas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Destination pages
  const destinations = [
    "barbados",
    "jamaica",
    "st-lucia",
    "st-barthelemy",
    "st-maarten",
    "antigua",
  ]

  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/destinations/${dest}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Fetch all properties from database with images for image sitemap
  let propertyPages: MetadataRoute.Sitemap = []

  try {
    const { data: properties, error } = await supabase
      .from("scraped_luxury_properties")
      .select("id, name, updated_at, created_at, location, images")
      .order("created_at", { ascending: false })

    if (!error && properties) {
      propertyPages = properties.map((property) => ({
        url: `${SITE_URL}/villas/${property.id}`,
        lastModified: new Date(property.updated_at || property.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        // Image sitemap for better image SEO
        images: property.images?.slice(0, 5).map((img: string) => img) || [],
      }))
    }
  } catch (e) {
    console.error("[Sitemap] Error fetching properties:", e)
  }

  return [...staticPages, ...destinationPages, ...propertyPages]
}
