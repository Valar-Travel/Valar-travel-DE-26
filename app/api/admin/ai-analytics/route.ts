import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRecommendationAnalytics } from "@/lib/ai-recommendation-engine"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Verify admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get URL params
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")

    // Get recommendation performance
    const recommendationStats = await getRecommendationAnalytics(days)

    // Get consent statistics
    const { data: consentStats } = await supabase.rpc("get_consent_statistics")

    // Get user profile stats
    const { count: totalProfiles } = await supabase
      .from("ai_user_profiles")
      .select("*", { count: "exact", head: true })

    const { count: highConfidenceProfiles } = await supabase
      .from("ai_user_profiles")
      .select("*", { count: "exact", head: true })
      .gte("profile_confidence", 0.5)

    // Get signal counts by type
    const { data: signalCounts } = await supabase
      .from("user_preference_signals")
      .select("signal_type")
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    const signalsByType: Record<string, number> = {}
    for (const signal of signalCounts || []) {
      signalsByType[signal.signal_type] = (signalsByType[signal.signal_type] || 0) + 1
    }

    // Get follow-up stats
    const { data: followupStats } = await supabase
      .from("booking_followup_queue")
      .select("status")
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    const followupsByStatus: Record<string, number> = {}
    for (const f of followupStats || []) {
      followupsByStatus[f.status] = (followupsByStatus[f.status] || 0) + 1
    }

    // Get top performing recommendations
    const { data: topRecommendations } = await supabase
      .from("ai_recommendations")
      .select(`
        property_id,
        match_score,
        was_clicked,
        was_booked,
        scraped_properties(name, location)
      `)
      .eq("was_clicked", true)
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order("was_booked", { ascending: false })
      .limit(10)

    return NextResponse.json({
      period: { days, from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(), to: new Date().toISOString() },
      recommendations: recommendationStats,
      consent: consentStats || { basic: 0, ai: 0, marketing: 0, social: 0, total: 0 },
      profiles: {
        total: totalProfiles || 0,
        highConfidence: highConfidenceProfiles || 0,
        confidence_rate: totalProfiles ? Math.round(((highConfidenceProfiles || 0) / totalProfiles) * 100) : 0,
      },
      signals: {
        total: Object.values(signalsByType).reduce((a, b) => a + b, 0),
        byType: signalsByType,
      },
      followups: {
        total: Object.values(followupsByStatus).reduce((a, b) => a + b, 0),
        byStatus: followupsByStatus,
      },
      topPerformers: topRecommendations || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
