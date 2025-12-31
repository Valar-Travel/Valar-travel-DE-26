import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const destination = searchParams.get("destination")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bedrooms = searchParams.get("bedrooms")
    const amenities = searchParams.get("amenities")?.split(",").filter(Boolean)

    console.log("[v0] Search API called with query:", query)

    // Build comprehensive search query using PostgreSQL full-text search
    let sqlQuery = `
      SELECT 
        id,
        property_name,
        slug,
        city,
        country,
        bedrooms,
        bathrooms,
        max_guests,
        price_per_night,
        main_image_url,
        images,
        amenities,
        description,
        short_description,
        ts_rank(
          to_tsvector('english', property_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(amenities::text, '')),
          plainto_tsquery('english', $1)
        ) as relevance
      FROM scraped_properties
      WHERE is_published = true
        AND is_active = true
    `

    const params: any[] = [query || ""]
    let paramIndex = 2

    // Add search filter if query provided
    if (query) {
      sqlQuery += `
        AND (
          to_tsvector('english', property_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(amenities::text, ''))
          @@ plainto_tsquery('english', $1)
          OR property_name ILIKE $${paramIndex}
          OR city ILIKE $${paramIndex}
          OR description ILIKE $${paramIndex}
        )
      `
      params.push(`%${query}%`)
      paramIndex++
    }

    // Add destination filter
    if (destination) {
      sqlQuery += ` AND (city ILIKE $${paramIndex} OR country ILIKE $${paramIndex})`
      params.push(`%${destination}%`)
      paramIndex++
    }

    // Add price filters
    if (minPrice) {
      sqlQuery += ` AND price_per_night >= $${paramIndex}`
      params.push(Number.parseFloat(minPrice))
      paramIndex++
    }

    if (maxPrice) {
      sqlQuery += ` AND price_per_night <= $${paramIndex}`
      params.push(Number.parseFloat(maxPrice))
      paramIndex++
    }

    // Add bedroom filter
    if (bedrooms) {
      sqlQuery += ` AND bedrooms >= $${paramIndex}`
      params.push(Number.parseInt(bedrooms))
      paramIndex++
    }

    // Add amenities filter
    if (amenities && amenities.length > 0) {
      const amenityConditions = amenities.map(() => {
        const condition = `amenities::text ILIKE $${paramIndex}`
        paramIndex++
        return condition
      })
      sqlQuery += ` AND (${amenityConditions.join(" OR ")})`
      params.push(...amenities.map((a) => `%${a}%`))
    }

    // Order by relevance if searching, otherwise by price
    sqlQuery += query
      ? ` ORDER BY relevance DESC, price_per_night ASC LIMIT 50`
      : ` ORDER BY price_per_night ASC LIMIT 50`

    console.log("[v0] Executing search query with params:", params)

    const results = await sql(sqlQuery, params)

    console.log("[v0] Search results count:", results.length)

    return NextResponse.json({
      success: true,
      query,
      results,
      total: results.length,
      filters: {
        destination,
        minPrice,
        maxPrice,
        bedrooms,
        amenities,
      },
    })
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search properties",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
