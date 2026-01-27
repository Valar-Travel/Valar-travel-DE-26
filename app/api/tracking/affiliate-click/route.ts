import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateLink, propertyName, propertyId, source, userId, sessionId, utmSource, utmMedium, utmCampaign } =
      body

    // Validate required fields
    if (!affiliateLink || !propertyName) {
      return NextResponse.json({ error: "Missing required fields: affiliateLink and propertyName" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("affiliate_clicks").insert({
      affiliate_link: affiliateLink,
      property_name: propertyName,
      property_id: propertyId,
      source: source || "unknown",
      user_id: userId,
      session_id: sessionId,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      clicked_at: new Date().toISOString(),
      ip_address: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    })

    if (error) {
      console.error("Error logging affiliate click:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Affiliate click tracked successfully",
      clickId: data?.[0]?.id,
    })
  } catch (error) {
    console.error("Error in affiliate click tracking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
