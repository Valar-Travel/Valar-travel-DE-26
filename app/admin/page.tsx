import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  try {
    const supabase = createClient()

    if (!supabase?.auth?.getUser || typeof supabase.auth.getUser !== "function") {
      console.warn("Supabase auth not available, using fallback")
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user is admin only if user is authenticated and from method exists
    const { data: adminUser } =
      user && supabase.from && typeof supabase.from === "function"
        ? await supabase.from("admin_users").select("*").eq("user_id", user.id).single()
        : { data: null }

    // Get admin statistics only if user is authenticated and is admin
    const { data: userStats } =
      user && adminUser && supabase.from && typeof supabase.from === "function"
        ? await supabase.from("profiles").select("id, created_at, membership_tier")
        : { data: [] }

    const { data: subscriptionStats } =
      user && adminUser && supabase.from && typeof supabase.from === "function"
        ? await supabase.from("user_subscriptions").select("status, subscription_plans(name)")
        : { data: [] }

    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-gray-50">
          <AdminDashboard user={user || null} userStats={userStats || []} subscriptionStats={subscriptionStats || []} />
        </div>
      </AdminAuthGuard>
    )
  } catch (error) {
    console.error("Admin page error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
}
