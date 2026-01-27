import { createClient } from "@/lib/supabase/server"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import { CRMDashboard } from "@/components/admin/crm-dashboard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "CRM Dashboard | Valar Travel Admin",
  description: "Customer relationship management and analytics dashboard",
}

export default async function CRMPage() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CRM Dashboard</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  try {
    const supabase = await createClient()

    // Fetch CRM statistics
    const [
      { data: customers, count: totalCustomers },
      { data: segments },
      { data: recentSessions },
      { data: topEvents },
    ] = await Promise.all([
      supabase
        .from("customer_profiles")
        .select("*", { count: "exact" })
        .order("last_seen_at", { ascending: false })
        .limit(50),
      supabase.from("audience_segments").select("*").eq("is_active", true),
      supabase.from("user_journey_sessions").select("*").order("started_at", { ascending: false }).limit(100),
      supabase.from("user_journey_events").select("event_name").order("created_at", { ascending: false }).limit(1000),
    ])

    // Calculate segment stats
    const segmentCounts: Record<string, number> = {}
    customers?.forEach((c) => {
      const seg = c.customer_segment || "prospect"
      segmentCounts[seg] = (segmentCounts[seg] || 0) + 1
    })

    // Calculate event frequency
    const eventCounts: Record<string, number> = {}
    topEvents?.forEach((e) => {
      eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1
    })

    // Calculate traffic sources
    const sourceCounts: Record<string, number> = {}
    recentSessions?.forEach((s) => {
      const source = s.utm_source || "direct"
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })

    // Calculate device breakdown
    const deviceCounts: Record<string, number> = {}
    recentSessions?.forEach((s) => {
      const device = s.device_type || "unknown"
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })

    const stats = {
      totalCustomers: totalCustomers || 0,
      segmentCounts,
      eventCounts,
      sourceCounts,
      deviceCounts,
      avgEngagement: customers?.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / (customers?.length || 1) || 0,
      totalPageViews: customers?.reduce((sum, c) => sum + (c.total_page_views || 0), 0) || 0,
      totalBookings: customers?.reduce((sum, c) => sum + (c.total_bookings || 0), 0) || 0,
      totalRevenue: customers?.reduce((sum, c) => sum + Number.parseFloat(c.total_booking_value || "0"), 0) || 0,
    }

    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-gray-50">
          <CRMDashboard customers={customers || []} segments={segments || []} stats={stats} />
        </div>
      </AdminAuthGuard>
    )
  } catch (error) {
    console.error("CRM page error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CRM Dashboard</h1>
          <p className="text-gray-600">Error loading data. Please try again.</p>
        </div>
      </div>
    )
  }
}
