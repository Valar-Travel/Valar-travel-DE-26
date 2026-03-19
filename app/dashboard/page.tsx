import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { UsageStats } from "@/components/dashboard/usage-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { BookingHistory } from "@/components/dashboard/booking-history"
import { PersonalizedRecommendations } from "@/components/dashboard/personalized-recommendations"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    if (!supabase || !supabase.auth || typeof supabase.auth.getUser !== "function") {
      console.warn("[Dashboard] Supabase auth not available, using fallback")
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">Please sign in to continue</p>
            <a href="/auth/login" className="text-emerald-600 hover:underline mt-4 inline-block">
              Go to Login
            </a>
          </div>
        </div>
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("[Dashboard] Auth error:", authError.message)
    }

    if (!user) {
      redirect("/auth/login")
    }

    // Get user profile with enhanced null checks and error handling
    let profile = null
    let subscription = null
    
    try {
      if (supabase.from && typeof supabase.from === "function") {
        const profileResult = await supabase.from("profiles").select("*").eq("id", user.id).single()
        profile = profileResult.data
      }
    } catch (profileError) {
      console.log("[Dashboard] Profile fetch error (non-critical):", profileError)
    }

    try {
      if (supabase.from && typeof supabase.from === "function") {
        const subResult = await supabase.from("user_subscriptions").select("*, subscription_plans(*)").eq("user_id", user.id).single()
        subscription = subResult.data
      }
    } catch (subError) {
      console.log("[Dashboard] Subscription fetch error (non-critical):", subError)
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </header>
          }
        >
          <DashboardHeader user={user} profile={profile || null} />
        </Suspense>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Personalized Recommendations - Full Width */}
          <div className="mb-8">
            <Suspense fallback={
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 animate-pulse">
                <div className="h-6 bg-emerald-100 rounded w-48 mb-4" />
                <div className="h-4 bg-emerald-50 rounded w-64" />
              </div>
            }>
              <PersonalizedRecommendations 
                userId={user.id} 
                userName={user.user_metadata?.full_name || user.user_metadata?.display_name}
              />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BookingHistory userId={user.id} />
              <SubscriptionCard subscription={subscription || null} />
              <UsageStats userId={user.id} />
              <RecentActivity userId={user.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/deals"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Browse Deals
                  </a>
                  <a
                    href="/destinations"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Explore Destinations
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Account Settings
                  </a>
                  <a
                    href="/dashboard/billing"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Billing & Invoices
                  </a>
                  <a
                    href="/pricing"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Upgrade Plan
                  </a>
                </div>
              </div>

              {/* Travel Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Travel Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Bookings</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Destinations Visited</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Money Saved</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error: any) {
    // Check if this is a redirect "error" (Next.js throws for redirects)
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error // Let Next.js handle the redirect
    }
    
    console.error("[Dashboard] Page error:", error?.message || error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
          <a href="/auth/login" className="text-emerald-600 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    )
  }
}
