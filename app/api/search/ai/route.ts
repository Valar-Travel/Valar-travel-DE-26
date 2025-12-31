import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

// AI-powered natural language search using OpenAI to understand intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    console.log("[v0] AI Search query:", query)

    // Use OpenAI to extract search intent and parameters
    const { default: OpenAI } = await import("openai")
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a search intent analyzer for a luxury Caribbean villa rental website. 
Extract search parameters from natural language queries. Return JSON with:
{
  "searchTerms": ["keyword1", "keyword2"],
  "destination": "city or country name or null",
  "minBedrooms": number or null,
  "amenities": ["amenity1", "amenity2"],
  "priceRange": "budget|moderate|luxury|ultra-luxury or null",
  "features": ["beachfront", "pool", etc]
}

Common amenities: WiFi, Pool, Beach Access, Chef, Spa, Gym, Tennis, Water Sports, Air Conditioning
Common destinations: Barbados, St. Lucia, Jamaica, St. Barthélemy, Turks and Caicos, Antigua, Cayman Islands, Grenada`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    })

    const intent = JSON.parse(completion.choices[0]?.message?.content || "{}")
    console.log("[v0] Extracted search intent:", intent)

    // Build SQL query based on AI-extracted parameters
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
        short_description
      FROM scraped_properties
      WHERE is_published = true
        AND is_active = true
    `

    const params: any[] = []
    let paramIndex = 1

    // Add search terms if present
    if (intent.searchTerms && intent.searchTerms.length > 0) {
      const searchText = intent.searchTerms.join(" ")
      sqlQuery += `
        AND (
          to_tsvector('english', property_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(city, ''))
          @@ plainto_tsquery('english', $${paramIndex})
        )
      `
      params.push(searchText)
      paramIndex++
    }

    // Add destination filter
    if (intent.destination) {
      sqlQuery += ` AND (city ILIKE $${paramIndex} OR country ILIKE $${paramIndex})`
      params.push(`%${intent.destination}%`)
      paramIndex++
    }

    // Add bedroom filter
    if (intent.minBedrooms) {
      sqlQuery += ` AND bedrooms >= $${paramIndex}`
      params.push(intent.minBedrooms)
      paramIndex++
    }

    // Add amenities filter
    if (intent.amenities && intent.amenities.length > 0) {
      const amenityConditions = intent.amenities.map(() => {
        const condition = `amenities::text ILIKE $${paramIndex}`
        paramIndex++
        return condition
      })
      sqlQuery += ` AND (${amenityConditions.join(" OR ")})`
      params.push(...intent.amenities.map((a: string) => `%${a}%`))
    }

    // Add price range filter
    if (intent.priceRange) {
      const priceRanges: Record<string, [number, number]> = {
        budget: [0, 500],
        moderate: [500, 1500],
        luxury: [1500, 5000],
        "ultra-luxury": [5000, 100000],
      }
      const range = priceRanges[intent.priceRange.toLowerCase()]
      if (range) {
        sqlQuery += ` AND price_per_night BETWEEN $${paramIndex} AND $${paramIndex + 1}`
        params.push(range[0], range[1])
        paramIndex += 2
      }
    }

    sqlQuery += ` ORDER BY price_per_night ASC LIMIT 50`

    console.log("[v0] Executing AI search with params:", params)

    const results = await sql(sqlQuery, params)

    console.log("[v0] AI search results count:", results.length)

    return NextResponse.json({
      success: true,
      query,
      intent,
      results,
      total: results.length,
    })
  } catch (error) {
    console.error("[v0] AI Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process AI search",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
