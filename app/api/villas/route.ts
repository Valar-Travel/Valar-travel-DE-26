import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function getDestinationFromLocation(location: string): string {
  const loc = location?.toLowerCase() || ""
  if (loc.includes("barbados")) return "barbados"
  if (loc.includes("jamaica")) return "jamaica"
  if (loc.includes("st. lucia") || loc.includes("saint lucia")) return "st-lucia"
  if (loc.includes("st. barth") || loc.includes("saint barth")) return "st-barthelemy"
  return "caribbean"
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: properties, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching villas from database:", error)
      return NextResponse.json([])
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json([])
    }

    const villas = properties.map((prop) => ({
      id: prop.id,
      slug: prop.id,
      name: prop.name,
      location: prop.location,
      destination: getDestinationFromLocation(prop.location),
      description: prop.description || "Luxury villa in the Caribbean",
      bedrooms: prop.bedrooms || 4,
      bathrooms: prop.bathrooms || 4,
      guests: (prop.bedrooms || 4) * 2,
      price: prop.price_per_night || 1000,
      originalPrice: prop.original_price || null,
      currency: prop.currency || "USD",
      image_url: prop.images && prop.images.length > 0 ? prop.images[0] : "/luxury-caribbean-villa.jpg",
      images: prop.images || [],
      amenities: prop.amenities || ["wifi", "pool", "chef"],
      rating: prop.rating,
      // New fields for LuxuryPropertyCard features
      starRating: prop.star_rating || 5,
      reviewCount: prop.review_count || 0,
      reviewSnippet: prop.review_snippet || null,
      luxuryScore: prop.luxury_score || 85,
      isLuxury: prop.is_luxury !== false,
      badges: prop.badges || [],
      coordinates: prop.latitude && prop.longitude 
        ? { lat: Number(prop.latitude), lng: Number(prop.longitude) }
        : null,
      propertyType: prop.property_type || "Villa",
    }))

    return NextResponse.json(villas)
  } catch (error) {
    console.error("[v0] Error in villas API route:", error)
    return NextResponse.json([])
  }
}
