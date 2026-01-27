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

    // Fetch all stats in parallel
    const [
      propertiesResult,
      bookingsResult,
      customersResult,
      subscribersResult,
    ] = await Promise.all([
      // Properties
      supabase.from("scraped_luxury_properties").select("id, is_published", { count: "exact" }),
      // Bookings
      supabase.from("booking_inquiries").select("id, status, total_price, created_at", { count: "exact" }),
      // Customers
      supabase.from("customer_profiles").select("id, created_at", { count: "exact" }),
      // Newsletter subscribers
      supabase.from("newsletter_subscriptions").select("id", { count: "exact" }).eq("status", "active"),
    ])

    const properties = propertiesResult.data || []
    const bookings = bookingsResult.data || []
    const customers = customersResult.data || []

    // Calculate stats
    const totalProperties = properties.length
    const publishedProperties = properties.filter((p: any) => p.is_published).length

    const totalBookings = bookings.length
    const pendingBookings = bookings.filter((b: any) => b.status === "pending" || b.status === "new").length

    // Calculate this month's customers
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newCustomersThisMonth = customers.filter(
      (c: any) => new Date(c.created_at) >= startOfMonth
    ).length

    // Calculate recent revenue (this month)
    const recentRevenue = bookings
      .filter((b: any) => new Date(b.created_at) >= startOfMonth && b.status !== "cancelled")
      .reduce((sum: number, b: any) => sum + (parseFloat(b.total_price) || 0), 0)

    return NextResponse.json({
      totalProperties,
      publishedProperties,
      totalBookings,
      pendingBookings,
      totalCustomers: customers.length,
      newCustomersThisMonth,
      totalSubscribers: subscribersResult.count || 0,
      recentRevenue,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
