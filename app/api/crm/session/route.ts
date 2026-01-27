import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

export async function POST(req: NextRequest) {
  try {
    const crmEnabled = await checkCRMTablesExist()

    if (!crmEnabled) {
      return NextResponse.json({ success: true, crm_enabled: false })
    }

    const supabase = await createClient()
    const body = await req.json()
    const headersList = await headers()

    const {
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_page,
      device_type,
      browser,
      os,
    } = body

    // Get location from headers (if available via middleware or CDN)
    const country = headersList.get("x-vercel-ip-country") || undefined
    const region = headersList.get("x-vercel-ip-country-region") || undefined
    const city = headersList.get("x-vercel-ip-city") || undefined

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from("user_journey_sessions")
      .select("id")
      .eq("session_id", session_id)
      .single()

    if (existingSession) {
      return NextResponse.json({ success: true, session_id, crm_enabled: true })
    }

    // Get authenticated user if available
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Find customer profile if user is authenticated
    let customerId = null
    if (user?.email) {
      const { data: customer } = await supabase.from("customer_profiles").select("id").eq("email", user.email).single()
      customerId = customer?.id
    }

    // Create new session
    const { error } = await supabase.from("user_journey_sessions").insert({
      session_id,
      customer_id: customerId,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_page,
      device_type,
      browser,
      os,
      country,
      region,
      city,
    })

    if (error) {
      console.error("Error creating session:", error)
      return NextResponse.json({ success: true, session_id, crm_enabled: false })
    }

    return NextResponse.json({ success: true, session_id, crm_enabled: true })
  } catch (error: any) {
    console.warn("CRM session API error:", error?.message)
    return NextResponse.json({ success: true, crm_enabled: false })
  }
}
