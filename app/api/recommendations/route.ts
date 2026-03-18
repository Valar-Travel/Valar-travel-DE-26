import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateRecommendations, markRecommendationShown } from "@/lib/ai-recommendation-engine"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "6")

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ recommendations: [], requiresAuth: true })
    }

    // Check if user has consented to AI recommendations
    const { data: consent } = await supabase
      .from("user_privacy_consent")
      .select("ai_recommendations")
      .eq("user_id", user.id)
      .single()

    if (!consent?.ai_recommendations) {
      return NextResponse.json({ recommendations: [], requiresConsent: true })
    }

    // Generate recommendations
    const recommendations = await generateRecommendations(user.id, limit)

    // Get full property details for recommendations
    if (recommendations.length > 0) {
      const propertyIds = recommendations.map(r => r.property_id)
      const { data: properties } = await supabase
        .from("scraped_properties")
        .select("id, name, location, price_per_night, currency, bedrooms, bathrooms, images, amenities")
        .in("id", propertyIds)

      const propertyMap = new Map(properties?.map(p => [p.id, p]) || [])
      
      const enrichedRecommendations = recommendations.map(rec => ({
        ...rec,
        property: propertyMap.get(rec.property_id) || null,
      })).filter(r => r.property !== null)

      return NextResponse.json({ recommendations: enrichedRecommendations })
    }

    return NextResponse.json({ recommendations: [] })
  } catch {
    return NextResponse.json({ recommendations: [], error: "Failed to get recommendations" }, { status: 500 })
  }
}

// Track when a recommendation is shown
export async function POST(request: Request) {
  try {
    const { propertyId, action } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !propertyId) {
      return NextResponse.json({ success: false })
    }

    if (action === "shown") {
      await markRecommendationShown(user.id, propertyId)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
