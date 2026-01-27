import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

export async function POST(req: NextRequest) {
  try {
    const crmEnabled = await checkCRMTablesExist()

    if (!crmEnabled) {
      return NextResponse.json({ success: true, customer_id: null, crm_enabled: false })
    }

    const supabase = await createClient()
    const body = await req.json()

    const { session_id, email, first_name, last_name, phone, ...attributes } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Get authenticated user if available
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if customer profile exists
    const { data: existingCustomer } = await supabase
      .from("customer_profiles")
      .select("id, total_sessions")
      .eq("email", email.toLowerCase())
      .single()

    let customerId: string

    if (existingCustomer) {
      customerId = existingCustomer.id

      await supabase
        .from("customer_profiles")
        .update({
          first_name: first_name || undefined,
          last_name: last_name || undefined,
          phone: phone || undefined,
          user_id: user?.id || undefined,
          last_seen_at: new Date().toISOString(),
          total_sessions: (existingCustomer.total_sessions || 0) + 1,
          ...attributes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId)
    } else {
      // Create new customer profile
      const { data: newCustomer, error } = await supabase
        .from("customer_profiles")
        .insert({
          email: email.toLowerCase(),
          first_name,
          last_name,
          phone,
          user_id: user?.id,
          acquisition_source: attributes.acquisition_source || "organic",
          total_sessions: 1,
        })
        .select("id")
        .single()

      if (error) {
        console.error("Error creating customer:", error)
        return NextResponse.json({ success: true, customer_id: null, crm_enabled: false })
      }

      customerId = newCustomer.id
    }

    // Link session to customer
    if (session_id) {
      await supabase.from("user_journey_sessions").update({ customer_id: customerId }).eq("session_id", session_id)
      await supabase
        .from("user_journey_events")
        .update({ customer_id: customerId })
        .eq("session_id", session_id)
        .is("customer_id", null)
    }

    return NextResponse.json({ success: true, customer_id: customerId, crm_enabled: true })
  } catch (error: any) {
    console.warn("CRM identify API error:", error?.message)
    return NextResponse.json({ success: true, customer_id: null, crm_enabled: false })
  }
}
