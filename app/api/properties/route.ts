import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destination = searchParams.get("destination") || "barbados"
    const checkin = searchParams.get("checkin")
    const checkout = searchParams.get("checkout")
    const adults = searchParams.get("adults") || "2"
    const rooms = searchParams.get("rooms") || "1"

    const include = searchParams.get("include")?.split(",") || []
    const includeImages = include.includes("images")
    const includeAmenities = include.includes("amenities")
    const includeRates = include.includes("rates")

    console.log("[v0] Properties API called with include parameters:", include)
    console.log("[v0] Include flags - Images:", includeImages, "Amenities:", includeAmenities, "Rates:", includeRates)

    const supabase = await createClient()
    const { data: properties, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .ilike("location", `%${destination}%`)
      .order("rating", { ascending: false })
      .limit(20)

    if (error) {
      console.error("[v0] Properties API error:", error)
      return NextResponse.json({
        success: true,
        destination,
        properties: [],
        total: 0,
        message: "No properties found. Add properties via the admin panel at /admin/properties",
      })
    }

    // Transform to expected format
    const formattedProperties = (properties || []).map((prop) => ({
      id: prop.id,
      name: prop.name,
      location: prop.location,
      rating: prop.rating || 4.5,
      reviewScore: prop.rating || 4.5,
      reviewCount: 0,
      price: prop.price_per_night || 0,
      currency: prop.currency || "USD",
      image: includeImages ? prop.images?.[0] || "" : "/placeholder.svg",
      images: includeImages ? (prop.images || []).map((url: string) => ({ url, caption: "" })) : [],
      amenities: includeAmenities ? prop.amenities || [] : ["Free WiFi"],
      rates: includeRates
        ? {
            baseRate: prop.price_per_night || 0,
            taxesAndFees: 0,
            totalRate: prop.price_per_night || 0,
            currency: prop.currency || "USD",
            perNight: prop.price_per_night || 0,
            cancellationPolicy: "Free cancellation until 24 hours before check-in",
          }
        : undefined,
      description: prop.description || "",
      affiliateUrl: prop.source_url || "",
    }))

    const response = {
      success: true,
      destination,
      properties: formattedProperties,
      total: formattedProperties.length,
      searchParams: {
        checkin,
        checkout,
        adults,
        rooms,
        include: include,
      },
      debug: {
        includeParameters: include,
        imagesIncluded: includeImages,
        amenitiesIncluded: includeAmenities,
        ratesIncluded: includeRates,
        apiSource: "properties-mock",
        timestamp: new Date().toISOString(),
      },
    }

    console.log("[v0] Properties API JSON Response Structure:")
    console.log("[v0] Response keys:", Object.keys(response))
    console.log(
      "[v0] Properties sample:",
      response.properties[0] ? JSON.stringify(response.properties[0], null, 2) : "No properties found",
    )
    console.log(
      "[v0] Image URLs present:",
      response.properties.map((p) => ({ id: p.id, image: p.image, imageCount: p.images?.length || 0 })),
    )

    console.log("[v0] Detailed image URL debugging:")
    response.properties.forEach((property, index) => {
      console.log(`[v0] Property ${index + 1} (${property.id}):`)
      console.log(`[v0]   - Name: ${property.name}`)
      console.log(`[v0]   - Main image: ${property.image}`)
      console.log(`[v0]   - Images array length: ${property.images?.length || 0}`)
      if (property.images && property.images.length > 0) {
        property.images.forEach((img, imgIndex) => {
          console.log(`[v0]   - Image ${imgIndex + 1}: ${img.url}`)
        })
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Properties API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination, filters } = body

    const supabase = await createClient()
    let query = supabase.from("scraped_luxury_properties").select("*").order("rating", { ascending: false })

    if (destination && destination !== "all") {
      query = query.ilike("location", `%${destination}%`)
    }

    if (filters?.minPrice) {
      query = query.gte("price_per_night", filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte("price_per_night", filters.maxPrice)
    }

    const { data: properties, error } = await query.limit(50)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      destination,
      properties: properties || [],
      total: properties?.length || 0,
      appliedFilters: filters,
    })
  } catch (error) {
    console.error("Properties search API error:", error)
    return NextResponse.json({ success: false, error: "Failed to search properties" }, { status: 500 })
  }
}
