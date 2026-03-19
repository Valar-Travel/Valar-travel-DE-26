import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured")
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: Request) {
  try {
    const { userId, preferences } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Update or insert user preferences
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: userId,
        preferences: preferences,
        onboarded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      })

    if (error) {
      console.error("[Preferences API] Error saving preferences:", error)
      return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
    }

    // Log analytics event
    await supabase.from("analytics_events").insert({
      event_type: "onboarding_completed",
      user_id: userId,
      metadata: {
        preferences,
        completed_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Preferences API] Exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("user_profiles")
      .select("preferences")
      .eq("user_id", userId)
      .single()

    if (error) {
      return NextResponse.json({ preferences: {} })
    }

    return NextResponse.json({ preferences: data?.preferences || {} })
  } catch (error) {
    console.error("[Preferences API] Exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
