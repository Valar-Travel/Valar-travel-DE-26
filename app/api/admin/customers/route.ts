import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateAdminSessionFromRequest } from "@/lib/admin-auth"

export async function GET(request: Request) {
  try {
    const user = await validateAdminSessionFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const segment = searchParams.get("segment")

    const supabase = createAdminClient()

    let query = supabase
      .from("customer_profiles")
      .select(`
        id,
        email,
        full_name,
        phone,
        country,
        customer_segment,
        total_bookings,
        total_booking_value,
        engagement_score,
        last_seen_at,
        created_at,
        preferred_destinations
      `)
      .order("last_seen_at", { ascending: false })
      .limit(100)

    if (segment && segment !== "all") {
      query = query.eq("customer_segment", segment)
    }

    const { data, error } = await query

    if (error) {
      console.error("Customers fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Customers API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
