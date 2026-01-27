import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateAdminSessionFromRequest } from "@/lib/admin-auth"

export async function GET(request: Request) {
  try {
    const user = await validateAdminSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .select(`
        id,
        email,
        status,
        subscribed_at,
        source
      `)
      .order("subscribed_at", { ascending: false })
      .limit(500)

    if (error) {
      console.error("Subscribers fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Subscribers API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}
