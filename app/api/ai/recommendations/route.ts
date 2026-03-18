import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateRecommendations, analyzeUserPreferences } from "@/lib/ai-recommendations"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ recommendations: [], reason: "not_authenticated" })
    }

    // Check AI consent
    const { data: consent } = await supabase
      .from("user_privacy_consent")
      .select("ai_recommendations")
      .eq("user_id", user.id)
      .single()

    if (!consent?.ai_recommendations) {
      return NextResponse.json({ recommendations: [], reason: "no_consent" })
    }

    // First analyze/update user preferences
    await analyzeUserPreferences(user.id)

    // Then generate fresh recommendations
    const recommendations = await generateRecommendations(user.id, 6)

    // Fetch full property details for recommendations
    const propertyIds = recommendations.map(r => r.property_id)
    
    if (propertyIds.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    const { data: properties } = await supabase
      .from("scraped_properties")
      .select("id, name, location, price_per_night, currency, bedrooms, bathrooms, images, property_type")
      .in("id", propertyIds)

    // Merge property details with recommendation scores
    const enrichedRecommendations = recommendations.map(rec => {
      const property = properties?.find(p => p.id === rec.property_id)
      return {
        ...rec,
        property,
      }
    }).filter(r => r.property)

    return NextResponse.json({ 
      recommendations: enrichedRecommendations,
      generated_at: new Date().toISOString()
    })
  } catch {
    return NextResponse.json({ recommendations: [], reason: "server_error" }, { status: 500 })
  }
}

export async function POST() {
  // Force regenerate recommendations
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, reason: "not_authenticated" })
    }

    // Delete old recommendations
    await supabase
      .from("ai_recommendations")
      .delete()
      .eq("user_id", user.id)

    // Analyze preferences
    await analyzeUserPreferences(user.id)

    // Generate new recommendations
    const recommendations = await generateRecommendations(user.id, 10)

    return NextResponse.json({ 
      success: true, 
      count: recommendations.length 
    })
  } catch {
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 })
  }
}
