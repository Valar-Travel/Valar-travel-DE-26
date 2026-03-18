import { createClient } from "@/lib/supabase/server"

// Types
export interface UserPreferences {
  preferred_destinations: string[]
  preferred_property_types: string[]
  preferred_amenities: string[]
  price_range: { min: number; max: number; currency: string }
  travel_style: {
    family: number
    romantic: number
    adventure: number
    luxury: number
    wellness: number
  }
}

export interface PropertyMatch {
  property_id: string
  match_score: number
  match_reasons: string[]
  recommendation_type: string
}

export interface SignalData {
  signal_type: "property_view" | "search" | "favorite" | "booking" | "filter_used"
  property_id?: string
  metadata?: Record<string, unknown>
  session_id?: string
  page_url?: string
}

// ============================================================================
// Signal Tracking (Records user behavior for AI analysis)
// ============================================================================
export async function trackUserSignal(userId: string, signal: SignalData) {
  const supabase = await createClient()
  
  // Check if user has consent for basic personalization
  const { data: consent } = await supabase
    .from("user_privacy_consent")
    .select("basic_personalization")
    .eq("user_id", userId)
    .single()
  
  if (!consent?.basic_personalization) {
    return { success: false, reason: "no_consent" }
  }

  const { error } = await supabase
    .from("user_preference_signals")
    .insert({
      user_id: userId,
      signal_type: signal.signal_type,
      signal_data: signal.metadata || {},
      property_id: signal.property_id,
      session_id: signal.session_id,
      page_url: signal.page_url,
    })

  return { success: !error, error }
}

// ============================================================================
// AI Profile Analysis (Computes user preferences from signals)
// ============================================================================
export async function analyzeUserPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = await createClient()
  
  // Check AI consent
  const { data: consent } = await supabase
    .from("user_privacy_consent")
    .select("ai_recommendations")
    .eq("user_id", userId)
    .single()
  
  if (!consent?.ai_recommendations) {
    return null
  }

  // Fetch all user signals
  const { data: signals } = await supabase
    .from("user_preference_signals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(500)

  if (!signals || signals.length === 0) {
    return getDefaultPreferences()
  }

  // Analyze signals to compute preferences
  const preferences = computePreferencesFromSignals(signals)
  
  // Update AI profile
  await supabase
    .from("ai_user_profiles")
    .upsert({
      user_id: userId,
      preferred_destinations: preferences.preferred_destinations,
      preferred_property_types: preferences.preferred_property_types,
      preferred_amenities: preferences.preferred_amenities,
      price_range: preferences.price_range,
      travel_style: preferences.travel_style,
      profile_confidence: Math.min(signals.length / 50, 1), // Confidence grows with more signals
      signal_count: signals.length,
      last_analyzed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id"
    })

  return preferences
}

function getDefaultPreferences(): UserPreferences {
  return {
    preferred_destinations: [],
    preferred_property_types: [],
    preferred_amenities: [],
    price_range: { min: 500, max: 3000, currency: "EUR" },
    travel_style: {
      family: 0.5,
      romantic: 0.5,
      adventure: 0.5,
      luxury: 0.5,
      wellness: 0.5,
    },
  }
}

function computePreferencesFromSignals(signals: any[]): UserPreferences {
  const destinationCounts: Record<string, number> = {}
  const amenityCounts: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}
  const prices: number[] = []
  
  // Analyze each signal
  for (const signal of signals) {
    const data = signal.signal_data || {}
    
    // Count destinations
    if (data.destination) {
      destinationCounts[data.destination] = (destinationCounts[data.destination] || 0) + 1
    }
    
    // Count amenities
    if (data.amenities && Array.isArray(data.amenities)) {
      for (const amenity of data.amenities) {
        amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1
      }
    }
    
    // Count property types
    if (data.property_type) {
      typeCounts[data.property_type] = (typeCounts[data.property_type] || 0) + 1
    }
    
    // Collect prices for range calculation
    if (data.price) {
      prices.push(data.price)
    }
  }

  // Sort and get top preferences
  const sortedDestinations = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([dest]) => dest)
  
  const sortedAmenities = Object.entries(amenityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([amenity]) => amenity)
  
  const sortedTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type)

  // Calculate price range from viewed properties
  const priceRange = prices.length > 0
    ? {
        min: Math.floor(Math.min(...prices) * 0.8),
        max: Math.ceil(Math.max(...prices) * 1.2),
        currency: "EUR",
      }
    : { min: 500, max: 3000, currency: "EUR" }

  // Infer travel style from signals
  const travelStyle = inferTravelStyle(signals)

  return {
    preferred_destinations: sortedDestinations,
    preferred_property_types: sortedTypes,
    preferred_amenities: sortedAmenities,
    price_range: priceRange,
    travel_style: travelStyle,
  }
}

function inferTravelStyle(signals: any[]): UserPreferences["travel_style"] {
  let family = 0, romantic = 0, adventure = 0, luxury = 0, wellness = 0
  let total = 0

  for (const signal of signals) {
    const data = signal.signal_data || {}
    total++
    
    // Infer from bedrooms (family indicator)
    if (data.bedrooms && data.bedrooms >= 4) {
      family += 1
    }
    
    // Infer from amenities
    const amenities = data.amenities || []
    if (amenities.includes("spa") || amenities.includes("gym") || amenities.includes("yoga")) {
      wellness += 1
    }
    if (amenities.includes("private_pool") || amenities.includes("chef") || amenities.includes("butler")) {
      luxury += 1
    }
    if (amenities.includes("romantic") || data.bedrooms === 1) {
      romantic += 1
    }
    if (amenities.includes("boat") || amenities.includes("diving") || amenities.includes("hiking")) {
      adventure += 1
    }
    
    // Infer from price (luxury indicator)
    if (data.price && data.price > 2000) {
      luxury += 1
    }
  }

  // Normalize scores to 0-1 range
  const normalize = (val: number) => total > 0 ? Math.min(val / total, 1) : 0.5

  return {
    family: normalize(family),
    romantic: normalize(romantic),
    adventure: normalize(adventure),
    luxury: normalize(luxury),
    wellness: normalize(wellness),
  }
}

// ============================================================================
// Recommendation Generation
// ============================================================================
export async function generateRecommendations(
  userId: string, 
  limit: number = 10
): Promise<PropertyMatch[]> {
  const supabase = await createClient()
  
  // Check AI consent
  const { data: consent } = await supabase
    .from("user_privacy_consent")
    .select("ai_recommendations")
    .eq("user_id", userId)
    .single()
  
  if (!consent?.ai_recommendations) {
    return []
  }

  // Get user's AI profile
  const { data: profile } = await supabase
    .from("ai_user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!profile) {
    // Analyze preferences first if no profile exists
    await analyzeUserPreferences(userId)
  }

  // Fetch available properties
  const { data: properties } = await supabase
    .from("scraped_properties")
    .select("id, name, location, price_per_night, bedrooms, amenities, property_type, images")
    .eq("is_published", true)
    .limit(100)

  if (!properties || properties.length === 0) {
    return []
  }

  // Score each property
  const scoredProperties = properties.map(property => 
    scoreProperty(property, profile)
  )

  // Sort by score and take top matches
  const topMatches = scoredProperties
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit)

  // Store recommendations in database
  for (const match of topMatches) {
    await supabase
      .from("ai_recommendations")
      .upsert({
        user_id: userId,
        property_id: match.property_id,
        match_score: match.match_score,
        match_reasons: match.match_reasons,
        recommendation_type: match.recommendation_type,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }, {
        onConflict: "user_id,property_id"
      })
  }

  return topMatches
}

function scoreProperty(property: any, profile: any): PropertyMatch {
  let score = 50 // Base score
  const reasons: string[] = []
  
  const prefs = profile || {}
  const preferredDestinations = prefs.preferred_destinations || []
  const preferredAmenities = prefs.preferred_amenities || []
  const priceRange = prefs.price_range || { min: 0, max: 10000 }
  const travelStyle = prefs.travel_style || {}

  // Location match (up to +20)
  if (preferredDestinations.length > 0) {
    const location = property.location?.toLowerCase() || ""
    for (const dest of preferredDestinations) {
      if (location.includes(dest.toLowerCase())) {
        score += 20
        reasons.push(`Matches your interest in ${dest}`)
        break
      }
    }
  }

  // Price range match (up to +15)
  const price = property.price_per_night || 0
  if (price >= priceRange.min && price <= priceRange.max) {
    score += 15
    reasons.push("Within your budget range")
  } else if (price < priceRange.min * 0.8) {
    score -= 5 // Slightly below budget preference
  } else if (price > priceRange.max * 1.2) {
    score -= 10 // Above budget
  }

  // Amenity matches (up to +15)
  const propertyAmenities = property.amenities || []
  const amenityMatches = preferredAmenities.filter((a: string) => 
    propertyAmenities.some((pa: string) => pa.toLowerCase().includes(a.toLowerCase()))
  )
  if (amenityMatches.length > 0) {
    score += Math.min(amenityMatches.length * 5, 15)
    reasons.push(`Has ${amenityMatches.slice(0, 2).join(" & ")}`)
  }

  // Travel style matches (up to +10)
  const bedrooms = property.bedrooms || 2
  if (travelStyle.family > 0.6 && bedrooms >= 4) {
    score += 10
    reasons.push("Great for families")
  }
  if (travelStyle.romantic > 0.6 && bedrooms <= 2) {
    score += 8
    reasons.push("Perfect for couples")
  }
  if (travelStyle.luxury > 0.6 && price > 1500) {
    score += 10
    reasons.push("Luxury experience")
  }

  // Cap score at 100
  score = Math.min(Math.max(score, 0), 100)

  return {
    property_id: property.id,
    match_score: score,
    match_reasons: reasons.length > 0 ? reasons : ["Popular choice"],
    recommendation_type: "ai_curated",
  }
}

// ============================================================================
// Fetch User Recommendations
// ============================================================================
export async function getUserRecommendations(userId: string, limit: number = 6) {
  const supabase = await createClient()
  
  const { data: recommendations } = await supabase
    .from("ai_recommendations")
    .select(`
      id,
      property_id,
      match_score,
      match_reasons,
      recommendation_type,
      was_shown,
      was_clicked,
      scraped_properties (
        id,
        name,
        location,
        price_per_night,
        currency,
        bedrooms,
        bathrooms,
        images,
        property_type
      )
    `)
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("match_score", { ascending: false })
    .limit(limit)

  return recommendations || []
}

// ============================================================================
// Track Recommendation Interaction
// ============================================================================
export async function trackRecommendationInteraction(
  userId: string,
  propertyId: string,
  interactionType: "shown" | "clicked" | "booked"
) {
  const supabase = await createClient()
  
  const updateData: Record<string, any> = {}
  
  if (interactionType === "shown") {
    updateData.was_shown = true
    updateData.shown_at = new Date().toISOString()
  } else if (interactionType === "clicked") {
    updateData.was_clicked = true
    updateData.clicked_at = new Date().toISOString()
  } else if (interactionType === "booked") {
    updateData.was_booked = true
    updateData.booked_at = new Date().toISOString()
  }

  await supabase
    .from("ai_recommendations")
    .update(updateData)
    .eq("user_id", userId)
    .eq("property_id", propertyId)
}
