import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const supabase = createAdminClient()

    let query = supabase
      .from("booking_inquiries")
      .select(`
        id,
        property_id,
        property_name,
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        guests,
        total_price,
        status,
        message,
        created_at
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Bookings fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map to consistent format
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      property_id: b.property_id,
      property_name: b.property_name || "Unknown Property",
      guest_name: b.guest_name || "Unknown Guest",
      guest_email: b.guest_email,
      guest_phone: b.guest_phone,
      check_in: b.check_in_date,
      check_out: b.check_out_date,
      guests: b.guests || 1,
      total_price: parseFloat(b.total_price) || 0,
      status: b.status || "pending",
      notes: b.message,
      created_at: b.created_at,
    }))

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
