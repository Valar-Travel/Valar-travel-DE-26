import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { eventName, properties, sessionId, userId, timestamp } = await req.json()

    const analyticsData = {
      user_id: user?.id || userId,
      event_name: eventName,
      properties: {
        ...properties,
        timestamp,
        user_agent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
      },
      session_id: sessionId,
      created_at: timestamp,
    }

    const { error: analyticsError } = await supabase.from("luxury_analytics_events").insert(analyticsData)

    if (analyticsError) {
      console.error("Error storing luxury analytics:", analyticsError)
    }

    if (eventName === "luxury_affiliate_click") {
      const affiliateData = {
        property_id: properties.property_id,
        partner_name: properties.partner_name,
        click_value: properties.price,
        potential_commission: properties.potential_commission,
        session_id: sessionId,
        user_id: user?.id || userId,
        clicked_at: timestamp,
      }

      const { error: affiliateError } = await supabase.from("affiliate_clicks").insert(affiliateData)

      if (affiliateError) {
        console.error("Error storing affiliate click:", affiliateError)
      }
    }

    if (eventName === "luxury_conversion") {
      const conversionData = {
        transaction_id: properties.transaction_id,
        property_id: properties.property_id,
        partner_name: properties.partner_name,
        booking_value: properties.booking_value,
        commission_earned: properties.commission_earned,
        commission_rate: properties.commission_rate,
        session_id: sessionId,
        user_id: user?.id || userId,
        converted_at: timestamp,
      }

      const { error: conversionError } = await supabase.from("luxury_conversions").insert(conversionData)

      if (conversionError) {
        console.error("Error storing conversion:", conversionError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in luxury analytics API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
