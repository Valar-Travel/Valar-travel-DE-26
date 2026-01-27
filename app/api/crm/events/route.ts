import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

export async function POST(req: NextRequest) {
  try {
    const crmEnabled = await checkCRMTablesExist()

    if (!crmEnabled) {
      return NextResponse.json({ success: true, count: 0, crm_enabled: false })
    }

    const supabase = await createClient()
    const body = await req.json()

    const { session_id, customer_id, events } = body

    if (!session_id || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Batch insert events
    const eventRecords = events.map((event: any) => ({
      session_id,
      customer_id,
      event_name: event.event_name,
      event_category: event.event_category,
      event_action: event.event_action,
      event_label: event.event_label,
      event_value: event.event_value,
      page_url: event.page_url,
      page_title: event.page_title,
      page_type: event.page_type,
      property_id: event.property_id,
      property_name: event.property_name,
      property_destination: event.property_destination,
      property_price: event.property_price,
      search_query: event.search_query,
      search_filters: event.search_filters,
      search_results_count: event.search_results_count,
      metadata: event.metadata || {},
    }))

    const { error } = await supabase.from("user_journey_events").insert(eventRecords)

    if (error) {
      console.error("Error inserting events:", error)
      return NextResponse.json({ success: true, count: 0, crm_enabled: false })
    }

    // Update session metrics (only if RPC function exists)
    const pageViews = events.filter((e: any) => e.event_name === "page_view").length
    const searches = events.filter((e: any) => e.event_name === "search").length
    const propertyViews = events.filter((e: any) => e.event_name === "property_view").length

    if (pageViews > 0 || searches > 0 || propertyViews > 0) {
      try {
        await supabase.rpc("increment_session_metrics", {
          p_session_id: session_id,
          p_page_views: pageViews,
          p_searches: searches,
          p_property_views: propertyViews,
        })
      } catch {
        // RPC not available - that's ok
      }
    }

    return NextResponse.json({ success: true, count: events.length, crm_enabled: true })
  } catch (error: any) {
    console.warn("CRM events API error:", error?.message)
    return NextResponse.json({ success: true, count: 0, crm_enabled: false })
  }
}
