import { createAdminClient } from "@/lib/supabase/admin"

// Types
interface UserPreferenceSignal {
  signal_type: string
  signal_data: Record<string, any>
  property_id?: string
  created_at: string
}

interface Property {
  id: string
  name: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  amenities: string[]
  property_type: string
  description: string
  images: string[]
}

interface UserProfile {
  preferred_destinations: string[]
  preferred_property_types: string[]
  preferred_amenities: string[]
  price_range: { min: number; max: number; currency: string }
  travel_style: Record<string, number>
  profile_confidence: number
  signal_count: number
}

interface Recommendation {
  property_id: string
  match_score: number
  match_reasons: string[]
  recommendation_type: string
}

// Signal weights for profile building
const SIGNAL_WEIGHTS = {
  booking: 10,      // Highest weight - actual conversion
  favorite: 5,      // Strong intent signal
  property_view: 2, // Interest signal
  search: 1,        // Weak intent
  filter_used: 1,   // Preference indicator
}

// Track a user preference signal
export async function trackUserSignal(
  userId: string,
  signalType: keyof typeof SIGNAL_WEIGHTS,
  signalData: Record<string, any>,
  propertyId?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = await createAdminClient()
    
    await supabase.from("user_preference_signals").insert({
      user_id: userId,
      signal_type: signalType,
      signal_data: signalData,
      property_id: propertyId || null,
      session_id: sessionId || null,
    })
  } catch {
    // Silent fail - tracking is best effort
  }
}

// Analyze user signals and build/update their AI profile
export async function analyzeUserPreferences(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createAdminClient()
    
    // Get user's recent signals (last 90 days)
    const { data: signals } = await supabase
      .from("user_preference_signals")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(500)

    if (!signals || signals.length === 0) {
      return null
    }

    // Get property details for viewed/favorited properties
    const propertyIds = [...new Set(signals.filter(s => s.property_id).map(s => s.property_id))]
    const { data: properties } = await supabase
      .from("scraped_properties")
      .select("*")
      .in("id", propertyIds)

    const propertyMap = new Map(properties?.map(p => [p.id, p]) || [])

    // Aggregate preferences with weights
    const destinationScores: Record<string, number> = {}
    const propertyTypeScores: Record<string, number> = {}
    const amenityScores: Record<string, number> = {}
    const pricePoints: number[] = []
    const travelStyleIndicators: Record<string, number> = {
      family: 0,
      romantic: 0,
      adventure: 0,
      luxury: 0,
      budget: 0,
    }

    for (const signal of signals) {
      const weight = SIGNAL_WEIGHTS[signal.signal_type as keyof typeof SIGNAL_WEIGHTS] || 1
      const property = signal.property_id ? propertyMap.get(signal.property_id) : null

      if (property) {
        // Destination preference
        const location = property.location?.split(",")[0]?.trim() || "Unknown"
        destinationScores[location] = (destinationScores[location] || 0) + weight

        // Property type preference
        const pType = property.property_type || "villa"
        propertyTypeScores[pType] = (propertyTypeScores[pType] || 0) + weight

        // Amenity preferences
        const amenities = property.amenities || []
        for (const amenity of amenities) {
          amenityScores[amenity] = (amenityScores[amenity] || 0) + weight
        }

        // Price preference
        if (property.price_per_night) {
          pricePoints.push(property.price_per_night)
        }

        // Travel style indicators
        const bedrooms = property.bedrooms || 1
        if (bedrooms >= 4) travelStyleIndicators.family += weight
        if (bedrooms <= 2) travelStyleIndicators.romantic += weight
        if (property.price_per_night > 1000) travelStyleIndicators.luxury += weight
        if (property.price_per_night < 300) travelStyleIndicators.budget += weight
      }

      // Search/filter signals
      if (signal.signal_type === "search" && signal.signal_data) {
        const data = signal.signal_data
        if (data.destination) {
          destinationScores[data.destination] = (destinationScores[data.destination] || 0) + weight
        }
        if (data.guests && data.guests >= 6) {
          travelStyleIndicators.family += weight
        }
      }

      if (signal.signal_type === "filter_used" && signal.signal_data) {
        const data = signal.signal_data
        if (data.amenity) {
          amenityScores[data.amenity] = (amenityScores[data.amenity] || 0) + weight
        }
      }
    }

    // Compute final preferences
    const sortByScore = (scores: Record<string, number>) =>
      Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key]) => key)

    // Normalize travel style scores
    const totalStyle = Object.values(travelStyleIndicators).reduce((a, b) => a + b, 0) || 1
    const normalizedStyle = Object.fromEntries(
      Object.entries(travelStyleIndicators).map(([k, v]) => [k, Math.round((v / totalStyle) * 100) / 100])
    )

    // Calculate price range (middle 80%)
    pricePoints.sort((a, b) => a - b)
    const minIdx = Math.floor(pricePoints.length * 0.1)
    const maxIdx = Math.floor(pricePoints.length * 0.9)

    const profile: UserProfile = {
      preferred_destinations: sortByScore(destinationScores),
      preferred_property_types: sortByScore(propertyTypeScores),
      preferred_amenities: sortByScore(amenityScores),
      price_range: {
        min: pricePoints[minIdx] || 200,
        max: pricePoints[maxIdx] || 2000,
        currency: "EUR",
      },
      travel_style: normalizedStyle,
      profile_confidence: Math.min(signals.length / 50, 1), // Max confidence at 50 signals
      signal_count: signals.length,
    }

    // Save profile to database
    await supabase.from("ai_user_profiles").upsert({
      user_id: userId,
      ...profile,
      last_analyzed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    })

    return profile
  } catch {
    return null
  }
}

// Generate personalized recommendations for a user
export async function generateRecommendations(
  userId: string,
  limit: number = 10
): Promise<Recommendation[]> {
  try {
    const supabase = await createAdminClient()

    // Get or create user profile
    let profile = await analyzeUserPreferences(userId)
    
    if (!profile) {
      // Return trending/popular for new users
      return generateTrendingRecommendations(limit)
    }

    // Get all published properties
    const { data: properties } = await supabase
      .from("scraped_properties")
      .select("*")
      .eq("is_published", true)
      .limit(200)

    if (!properties || properties.length === 0) {
      return []
    }

    // Score each property
    const scoredProperties = properties.map(property => {
      const { score, reasons } = calculateMatchScore(property, profile!)
      return {
        property_id: property.id,
        match_score: score,
        match_reasons: reasons,
        recommendation_type: "ai",
      }
    })

    // Sort by score and take top N
    const recommendations = scoredProperties
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit)

    // Save recommendations to database
    for (const rec of recommendations) {
      await supabase.from("ai_recommendations").upsert({
        user_id: userId,
        ...rec,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: "user_id,property_id",
      })
    }

    return recommendations
  } catch {
    return []
  }
}

// Calculate match score between a property and user profile
function calculateMatchScore(
  property: any,
  profile: UserProfile
): { score: number; reasons: string[] } {
  let score = 50 // Base score
  const reasons: string[] = []

  // Destination match (up to +20)
  const location = property.location?.split(",")[0]?.trim() || ""
  const destIdx = profile.preferred_destinations.indexOf(location)
  if (destIdx !== -1) {
    const bonus = 20 - destIdx * 4 // 20, 16, 12, 8, 4 for positions 0-4
    score += bonus
    reasons.push("destination_match")
  }

  // Price match (up to +15)
  const price = property.price_per_night || 0
  if (price >= profile.price_range.min && price <= profile.price_range.max) {
    score += 15
    reasons.push("price_match")
  } else if (price < profile.price_range.min * 0.8 || price > profile.price_range.max * 1.2) {
    score -= 10 // Penalty for far outside range
  }

  // Amenity matches (up to +15)
  const propertyAmenities = property.amenities || []
  const matchedAmenities = profile.preferred_amenities.filter(a => 
    propertyAmenities.some((pa: string) => pa.toLowerCase().includes(a.toLowerCase()))
  )
  if (matchedAmenities.length > 0) {
    score += Math.min(matchedAmenities.length * 5, 15)
    reasons.push("amenities_match")
  }

  // Property type match (+10)
  if (profile.preferred_property_types.includes(property.property_type || "villa")) {
    score += 10
    reasons.push("type_match")
  }

  // Travel style bonuses
  const bedrooms = property.bedrooms || 2
  if (profile.travel_style.family > 0.4 && bedrooms >= 4) {
    score += 10
    reasons.push("family_friendly")
  }
  if (profile.travel_style.romantic > 0.4 && bedrooms <= 2) {
    score += 10
    reasons.push("romantic_getaway")
  }
  if (profile.travel_style.luxury > 0.4 && price > 800) {
    score += 5
    reasons.push("luxury_experience")
  }

  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score))

  return { score, reasons }
}

// Generate trending recommendations for users without profile
async function generateTrendingRecommendations(limit: number): Promise<Recommendation[]> {
  try {
    const supabase = await createAdminClient()

    // Get most viewed/favorited properties in last 30 days
    const { data: trendingSignals } = await supabase
      .from("user_preference_signals")
      .select("property_id")
      .in("signal_type", ["property_view", "favorite", "booking"])
      .not("property_id", "is", null)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (!trendingSignals || trendingSignals.length === 0) {
      // Fallback to newest properties
      const { data: newProperties } = await supabase
        .from("scraped_properties")
        .select("id")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      return (newProperties || []).map(p => ({
        property_id: p.id,
        match_score: 70,
        match_reasons: ["new_listing"],
        recommendation_type: "new",
      }))
    }

    // Count property occurrences
    const counts: Record<string, number> = {}
    for (const s of trendingSignals) {
      if (s.property_id) {
        counts[s.property_id] = (counts[s.property_id] || 0) + 1
      }
    }

    // Get top trending
    const trending = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([propertyId, count]) => ({
        property_id: propertyId,
        match_score: Math.min(50 + count * 5, 95),
        match_reasons: ["trending"],
        recommendation_type: "trending",
      }))

    return trending
  } catch {
    return []
  }
}

// Mark a recommendation as shown
export async function markRecommendationShown(
  userId: string,
  propertyId: string
): Promise<void> {
  try {
    const supabase = await createAdminClient()
    await supabase
      .from("ai_recommendations")
      .update({ was_shown: true, shown_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("property_id", propertyId)
  } catch {
    // Silent fail
  }
}

// Mark a recommendation as clicked
export async function markRecommendationClicked(
  userId: string,
  propertyId: string
): Promise<void> {
  try {
    const supabase = await createAdminClient()
    await supabase
      .from("ai_recommendations")
      .update({ was_clicked: true, clicked_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("property_id", propertyId)
  } catch {
    // Silent fail
  }
}

// Get analytics on recommendation performance
export async function getRecommendationAnalytics(days: number = 30) {
  try {
    const supabase = await createAdminClient()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const { data: recs } = await supabase
      .from("ai_recommendations")
      .select("*")
      .gte("created_at", since)

    if (!recs || recs.length === 0) {
      return { total: 0, shown: 0, clicked: 0, booked: 0, ctr: 0, conversionRate: 0 }
    }

    const total = recs.length
    const shown = recs.filter(r => r.was_shown).length
    const clicked = recs.filter(r => r.was_clicked).length
    const booked = recs.filter(r => r.was_booked).length

    return {
      total,
      shown,
      clicked,
      booked,
      ctr: shown > 0 ? Math.round((clicked / shown) * 100) : 0,
      conversionRate: clicked > 0 ? Math.round((booked / clicked) * 100) : 0,
    }
  } catch {
    return { total: 0, shown: 0, clicked: 0, booked: 0, ctr: 0, conversionRate: 0 }
  }
}
