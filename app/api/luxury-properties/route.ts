import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DESTINATION_SOURCE_URLS: Record<string, string[]> = {
  barbados: ["sunnyvillaholidays.com", "villasbarbados.com", "barbadosdreamvillas.com", "barbadosluxuryvillas.com"],
  jamaica: ["jamaicavillas.com", "villasinjamaica.com"],
  "st-lucia": ["stluciavillas.com", "villasinstlucia.com"],
  "st-barthelemy": ["stbarthvillas.com", "wimco.com"],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || searchParams.get("destination")
    const minRating = Number.parseFloat(searchParams.get("minRating") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "100000")
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const limit = Number.parseInt(searchParams.get("limit") || searchParams.get("maxResults") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const sortBy = searchParams.get("sortBy") || "rating"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const search = searchParams.get("search") || ""

    console.log("[v0] Fetching luxury properties with filters:", {
      location,
      minRating,
      maxPrice,
      minPrice,
      limit,
      offset,
      sortBy,
      search,
    })

    try {
      const supabase = await createClient()
      let query = supabase
        .from("scraped_luxury_properties")
        .select("*", { count: "exact" }) // Include count for total properties
        .gte("rating", minRating)
        .gte("price_per_night", minPrice)
        .lte("price_per_night", maxPrice)

      if (location && location !== "all") {
        const normalizedLocation = location.toLowerCase().replace(/[^a-z]/g, "")
        const sourceUrls = DESTINATION_SOURCE_URLS[normalizedLocation] || []

        if (sourceUrls.length > 0) {
          // Build OR filter for location and source_url
          const locationFilters = [
            `location.ilike.%${location}%`,
            ...sourceUrls.map((url) => `source_url.ilike.%${url}%`),
          ]
          query = query.or(locationFilters.join(","))
        } else {
          query = query.ilike("location", `%${location}%`)
        }
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
      }

      const sortColumn = sortBy === "price" ? "price_per_night" : sortBy === "name" ? "name" : "rating"
      query = query.order(sortColumn, { ascending: sortOrder === "asc" })

      // Secondary sort by name for consistent ordering
      if (sortColumn !== "name") {
        query = query.order("name", { ascending: true })
      }

      query = query.range(offset, offset + limit - 1)

      const { data: dbProperties, error, count } = await query

      if (error) {
        console.error("[v0] Database query error:", error)
        return NextResponse.json([])
      }

      if (dbProperties && dbProperties.length > 0) {
        console.log("[v0] Found properties in database:", dbProperties.length)
        return NextResponse.json({
          data: dbProperties,
          count: dbProperties.length,
          total: count || dbProperties.length,
        })
      }
    } catch (dbError) {
      console.error("[v0] Database query failed:", dbError)
    }

    return NextResponse.json({ data: [], count: 0, total: 0 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("id")
    const olderThan = searchParams.get("olderThan")

    const supabase = await createClient()

    if (propertyId) {
      const { error } = await supabase.from("scraped_luxury_properties").delete().eq("id", propertyId)

      if (error) {
        return NextResponse.json({ success: false, error: "Failed to delete property" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Property deleted" })
    }

    if (olderThan) {
      const { error } = await supabase.from("scraped_luxury_properties").delete().lt("scraped_at", olderThan)

      if (error) {
        return NextResponse.json({ success: false, error: "Failed to delete old properties" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Old properties deleted" })
    }

    return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Delete API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
