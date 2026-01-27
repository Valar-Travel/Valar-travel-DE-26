import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

export async function GET(req: NextRequest) {
  try {
    const crmEnabled = await checkCRMTablesExist()

    if (!crmEnabled) {
      return NextResponse.json({ isReturningUser: false, crm_enabled: false })
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ isReturningUser: false, crm_enabled: true })
    }

    const { data: customer } = await supabase.from("customer_profiles").select("*").eq("email", user.email).single()

    if (!customer) {
      return NextResponse.json({ isReturningUser: false, crm_enabled: true })
    }

    // Calculate days away
    const lastSeen = customer.last_seen_at ? new Date(customer.last_seen_at) : null
    const daysAway = lastSeen ? Math.floor((Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24)) : 0

    // Get last viewed destination from events
    let lastDestination = customer.preferred_destinations?.[0] || null
    const { data: lastEvent } = await supabase
      .from("user_journey_events")
      .select("property_destination")
      .eq("customer_id", customer.id)
      .eq("event_name", "property_view")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (lastEvent?.property_destination) {
      lastDestination = lastEvent.property_destination
    }

    // Get saved properties count
    let savedCount = 0
    const { count } = await supabase
      .from("saved_properties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
    savedCount = count || 0

    return NextResponse.json({
      isReturningUser: true,
      firstName: customer.first_name,
      lastName: customer.last_name,
      segment: customer.customer_segment,
      engagementScore: customer.engagement_score,
      lastDestination,
      savedProperties: savedCount,
      daysAway,
      preferences: {
        destinations: customer.preferred_destinations,
        propertyTypes: customer.preferred_property_types,
        budgetRange: customer.budget_range,
      },
      crm_enabled: true,
    })
  } catch (error: any) {
    console.warn("User-context API error:", error?.message)
    return NextResponse.json({ isReturningUser: false, crm_enabled: false })
  }
}
