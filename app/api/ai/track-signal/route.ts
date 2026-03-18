import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, reason: "not_authenticated" })
    }

    const body = await request.json()
    const { signal_type, property_id, metadata, session_id, page_url } = body

    // Validate signal type
    const validTypes = ["property_view", "search", "favorite", "booking", "filter_used"]
    if (!validTypes.includes(signal_type)) {
      return NextResponse.json({ success: false, reason: "invalid_signal_type" })
    }

    // Check if user has consent for basic personalization
    const { data: consent } = await supabase
      .from("user_privacy_consent")
      .select("basic_personalization")
      .eq("user_id", user.id)
      .single()

    if (!consent?.basic_personalization) {
      return NextResponse.json({ success: false, reason: "no_consent" })
    }

    // Insert the signal
    const { error } = await supabase
      .from("user_preference_signals")
      .insert({
        user_id: user.id,
        signal_type,
        signal_data: metadata || {},
        property_id: property_id || null,
        session_id: session_id || null,
        page_url: page_url || null,
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 })
  }
}
