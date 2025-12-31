import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function getDestinationId(destination: string): string {
  const destinationMap: { [key: string]: string } = {
    barbados: "1_2345",
    "st. lucia": "1_2346",
    "st lucia": "1_2346",
    jamaica: "1_2347",
    "turks and caicos": "1_2348",
    "antigua and barbuda": "1_2349",
    "cayman islands": "1_2350",
  }

  const normalizedDestination = destination.toLowerCase().trim()
  return destinationMap[normalizedDestination] || "1_2345" // Default to Barbados
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const destination = searchParams.get("destination") || "barbados"
  const limit = searchParams.get("limit") || "10"

  try {
    // Fetch real properties from database
    const supabase = await createClient()
    const { data: properties, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .ilike("location", `%${destination}%`)
      .limit(Number.parseInt(limit))

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({
        status: "success",
        success: true,
        hotels: [],
        properties: [],
        message: "No properties found. Add properties via the admin panel.",
      })
    }

    // Transform database properties to hotel format
    const hotels = (properties || []).map((prop) => ({
      id: prop.id,
      name: prop.name,
      rating: prop.rating || 4.5,
      reviewCount: 0,
      price: prop.price_per_night || 0,
      currency: prop.currency || "USD",
      image: prop.images?.[0] || "",
      location: prop.location || destination,
      amenities: prop.amenities || [],
      description: prop.description || "",
    }))

    return NextResponse.json({
      status: "success",
      success: true,
      hotels,
      properties: hotels,
    })
  } catch (error) {
    console.error("[v0] Hotels API error:", error)
    return NextResponse.json({
      status: "error",
      success: false,
      hotels: [],
      properties: [],
      error: "Failed to fetch properties",
    })
  }
}
