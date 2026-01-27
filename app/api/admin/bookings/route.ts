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
    const source = searchParams.get("source") // 'checkout', 'inquiry', or 'all'

    const supabase = createAdminClient()

    const allBookings: any[] = []

    // Fetch from bookings table (checkout/payment bookings)
    if (source !== "inquiry") {
      let bookingsQuery = supabase
        .from("bookings")
        .select(`
          id,
          villa_id,
          villa_name,
          user_id,
          guest_name,
          guest_email,
          check_in,
          check_out,
          nights,
          guests,
          price_per_night,
          subtotal,
          total_amount,
          deposit_amount,
          deposit_percentage,
          remaining_amount,
          currency,
          booking_status,
          payment_status,
          stripe_session_id,
          stripe_payment_intent_id,
          deposit_paid_at,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false })

      if (status && status !== "all") {
        // Map common status to booking_status values
        const statusMap: Record<string, string[]> = {
          pending: ["pending"],
          confirmed: ["confirmed", "deposit_received"],
          completed: ["completed"],
          cancelled: ["cancelled"],
        }
        const mappedStatuses = statusMap[status] || [status]
        bookingsQuery = bookingsQuery.in("booking_status", mappedStatuses)
      }

      const { data: bookingsData, error: bookingsError } = await bookingsQuery

      if (!bookingsError && bookingsData) {
        bookingsData.forEach((b: any) => {
          allBookings.push({
            id: b.id,
            property_id: b.villa_id,
            property_name: b.villa_name || "Unknown Property",
            guest_name: b.guest_name || "Unknown Guest",
            guest_email: b.guest_email,
            guest_phone: null,
            check_in: b.check_in,
            check_out: b.check_out,
            nights: b.nights,
            guests: b.guests || 1,
            total_price: (b.total_amount || 0) / 100, // Convert from cents
            deposit_amount: (b.deposit_amount || 0) / 100,
            deposit_percentage: b.deposit_percentage,
            remaining_amount: (b.remaining_amount || 0) / 100,
            currency: b.currency || "USD",
            status: b.booking_status || "pending",
            payment_status: b.payment_status,
            notes: null,
            created_at: b.created_at,
            source: "checkout",
            stripe_session_id: b.stripe_session_id,
            deposit_paid_at: b.deposit_paid_at,
          })
        })
      }
    }

    // Fetch from booking_inquiries table (form submissions)
    if (source !== "checkout") {
      let inquiriesQuery = supabase
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
        inquiriesQuery = inquiriesQuery.eq("status", status)
      }

      const { data: inquiriesData, error: inquiriesError } = await inquiriesQuery

      if (!inquiriesError && inquiriesData) {
        inquiriesData.forEach((b: any) => {
          allBookings.push({
            id: b.id,
            property_id: b.property_id,
            property_name: b.property_name || "Unknown Property",
            guest_name: b.guest_name || "Unknown Guest",
            guest_email: b.guest_email,
            guest_phone: b.guest_phone,
            check_in: b.check_in_date,
            check_out: b.check_out_date,
            nights: null,
            guests: b.guests || 1,
            total_price: parseFloat(b.total_price) || 0,
            deposit_amount: null,
            deposit_percentage: null,
            remaining_amount: null,
            currency: "USD",
            status: b.status || "pending",
            payment_status: null,
            notes: b.message,
            created_at: b.created_at,
            source: "inquiry",
            stripe_session_id: null,
            deposit_paid_at: null,
          })
        })
      }
    }

    // Sort all bookings by created_at descending
    allBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(allBookings)
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
