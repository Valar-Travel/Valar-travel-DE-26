import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { trackUserSignal } from "@/lib/ai-recommendation-engine"

export async function POST(request: Request) {
  try {
    const { signalType, signalData, propertyId, sessionId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, reason: "not_authenticated" })
    }

    // Check if user has consented to basic personalization
    const { data: consent } = await supabase
      .from("user_privacy_consent")
      .select("basic_personalization")
      .eq("user_id", user.id)
      .single()

    if (!consent?.basic_personalization) {
      return NextResponse.json({ success: false, reason: "no_consent" })
    }

    // Track the signal
    await trackUserSignal(user.id, signalType, signalData || {}, propertyId, sessionId)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
