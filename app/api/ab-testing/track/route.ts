import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testId, variantId, userId, sessionId, event, timestamp, metadata } = body

    const supabase = createServerClient()

    // Store A/B test result in database
    const { error } = await supabase.from("ab_test_results").insert({
      test_id: testId,
      variant_id: variantId,
      user_id: userId,
      session_id: sessionId,
      event,
      timestamp,
      metadata,
    })

    if (error) {
      console.error("Failed to store A/B test result:", error)
      return NextResponse.json({ error: "Failed to store result" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("A/B testing track error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
