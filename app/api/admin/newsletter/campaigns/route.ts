import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("email_campaigns")
      .select(`
        id,
        subject,
        preview_text,
        content,
        status,
        sent_at,
        scheduled_for,
        recipients_count,
        opens_count,
        clicks_count,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      // Table might not exist yet
      if (error.code === "42P01") {
        return NextResponse.json([])
      }
      console.error("Campaigns fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Campaigns API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}
