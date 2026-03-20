import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

// Map onboarding choices to property filters
function mapPreferencesToFilters(preferences: any) {
  const filters: any = {
    destinations: [],
    minBedrooms: 1,
    maxBedrooms: 10,
    tags: [],
    priceRange: { min: 0, max: 50000 },
  }

  // Map travel style to tags and property characteristics
  const travelStyle = preferences["travel-style"]
  if (travelStyle === "romantic") {
    filters.tags.push("romantic", "couples", "honeymoon", "private", "intimate")
    filters.minBedrooms = 1
    filters.maxBedrooms = 2
  } else if (travelStyle === "family") {
    filters.tags.push("family", "kid-friendly", "spacious", "games", "pool")
    filters.minBedrooms = 3
  } else if (travelStyle === "celebration") {
    filters.tags.push("party", "celebration", "event", "luxury", "staff")
    filters.minBedrooms = 4
  } else if (travelStyle === "wellness") {
    filters.tags.push("spa", "wellness", "yoga", "meditation", "peaceful", "gym")
  }

  // Map group size to bedrooms
  const groupSize = preferences["group-size"]
  if (groupSize === "couple") {
    filters.minBedrooms = 1
    filters.maxBedrooms = 2
  } else if (groupSize === "small") {
    filters.minBedrooms = 2
    filters.maxBedrooms = 3
  } else if (groupSize === "medium") {
    filters.minBedrooms = 4
    filters.maxBedrooms = 6
  } else if (groupSize === "large") {
    filters.minBedrooms = 6
  }

  // Map destinations
  const destinations = preferences["destinations"]
  if (Array.isArray(destinations)) {
    const destinationMap: Record<string, string[]> = {
      "barbados": ["Barbados"],
      "st-lucia": ["St. Lucia", "Saint Lucia"],
      "jamaica": ["Jamaica"],
      "antigua": ["Antigua"],
      "turks": ["Turks", "Caicos", "Turks and Caicos", "Turks & Caicos"],
      "all": [] // All destinations
    }
    
    for (const dest of destinations) {
      if (dest !== "all" && destinationMap[dest]) {
        filters.destinations.push(...destinationMap[dest])
      }
    }
  }

  return filters
}

// Score a property based on user preferences
function scoreProperty(property: any, filters: any, preferences: any) {
  let score = 50 // Base score
  const reasons: string[] = []

  // Location match (+25 points)
  if (filters.destinations.length > 0) {
    const location = (property.location || "").toLowerCase()
    const locationMatch = filters.destinations.some((dest: string) => 
      location.includes(dest.toLowerCase())
    )
    if (locationMatch) {
      score += 25
      reasons.push("Matches your preferred destination")
    }
  } else {
    // User selected "Surprise Me" - give bonus to diverse locations
    score += 10
    reasons.push("Discover something new")
  }

  // Bedroom count match (+20 points)
  const bedrooms = property.bedrooms || 2
  if (bedrooms >= filters.minBedrooms && bedrooms <= filters.maxBedrooms) {
    score += 20
    reasons.push(`Perfect for your group (${bedrooms} bedrooms)`)
  } else if (bedrooms >= filters.minBedrooms - 1) {
    score += 10
  }

  // Amenity/tag matches (+15 points)
  const amenities = (property.amenities || []).map((a: string) => a.toLowerCase())
  const description = (property.description || "").toLowerCase()
  const name = (property.name || "").toLowerCase()
  const allText = [...amenities, description, name].join(" ")
  
  let tagMatches = 0
  for (const tag of filters.tags) {
    if (allText.includes(tag.toLowerCase())) {
      tagMatches++
    }
  }
  if (tagMatches > 0) {
    score += Math.min(tagMatches * 5, 15)
    if (preferences["travel-style"] === "romantic" && tagMatches > 0) {
      reasons.push("Romantic ambiance")
    } else if (preferences["travel-style"] === "family" && tagMatches > 0) {
      reasons.push("Family-friendly features")
    } else if (preferences["travel-style"] === "wellness" && tagMatches > 0) {
      reasons.push("Wellness amenities")
    } else if (preferences["travel-style"] === "celebration" && tagMatches > 0) {
      reasons.push("Perfect for celebrations")
    }
  }

  // Luxury indicators (+10 points)
  const luxuryIndicators = ["pool", "chef", "butler", "concierge", "ocean view", "beachfront"]
  const hasLuxury = luxuryIndicators.some(indicator => allText.includes(indicator))
  if (hasLuxury) {
    score += 10
    reasons.push("Luxury amenities included")
  }

  // Quality images boost (+5 points)
  if (property.images && property.images.length > 3) {
    score += 5
  }

  return {
    property,
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["Highly rated property"],
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "6")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ recommendations: [], error: "Database not configured" })
    }

    // Get user preferences from user_profiles
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("preferences")
      .eq("user_id", userId)
      .single()

    if (profileError || !profile?.preferences) {
      // Return empty recommendations if no preferences
      return NextResponse.json({ 
        recommendations: [],
        message: "Complete onboarding to get personalized recommendations"
      })
    }

    const preferences = profile.preferences
    const filters = mapPreferencesToFilters(preferences)

    // Fetch properties from database
    const { data: properties, error: propError } = await supabase
      .from("scraped_properties")
      .select("id, name, location, price_per_night, currency, bedrooms, bathrooms, amenities, description, images, property_type")
      .eq("is_published", true)
      .limit(50)

    if (propError || !properties || properties.length === 0) {
      return NextResponse.json({ 
        recommendations: [],
        message: "No properties available"
      })
    }

    // Score and rank properties
    const scoredProperties = properties
      .map(prop => scoreProperty(prop, filters, preferences))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    // Format response
    const recommendations = scoredProperties.map(item => ({
      id: item.property.id,
      name: item.property.name,
      location: item.property.location,
      price: item.property.price_per_night,
      currency: item.property.currency || "EUR",
      bedrooms: item.property.bedrooms,
      bathrooms: item.property.bathrooms,
      image: item.property.images?.[0] || "/images/placeholder-villa.jpg",
      matchScore: item.score,
      matchReasons: item.reasons,
    }))

    return NextResponse.json({ 
      recommendations,
      preferences: {
        travelStyle: preferences["travel-style"],
        groupSize: preferences["group-size"],
        timing: preferences["timing"],
        destinations: preferences["destinations"],
      }
    })
  } catch (error) {
    console.error("[Recommendations API] Error:", error)
    return NextResponse.json({ 
      recommendations: [],
      error: "Failed to generate recommendations"
    })
  }
}
