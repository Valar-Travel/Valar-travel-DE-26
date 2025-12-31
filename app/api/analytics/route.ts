import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { eventName, properties, sessionId } = await req.json()

    // Only insert to database if user is authenticated
    if (user) {
      const { error } = await supabase.from("analytics_events").insert({
        user_id: user.id,
        event_name: eventName,
        properties: properties || {},
        session_id: sessionId,
      })

      if (error) {
        console.error("Error tracking event:", error)
        return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
