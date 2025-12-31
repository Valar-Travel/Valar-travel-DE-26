import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { AccountSettings } from "@/components/dashboard/account-settings"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  try {
    const supabase = createClient()

    if (!supabase || !supabase.auth || typeof supabase.auth.getUser !== "function") {
      console.warn("Supabase auth not available, using fallback")
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get user profile only if user is authenticated and from method exists
    const { data: profile } =
      user && supabase.from && typeof supabase.from === "function"
        ? await supabase.from("profiles").select("*").eq("id", user.id).single()
        : { data: null }

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              </div>
            </header>
          }
        >
          <DashboardHeader user={user || null} profile={profile || null} />
        </Suspense>

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-600">Manage your account preferences and profile information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfileSettings user={user || null} profile={profile || null} />
              <AccountSettings user={user || null} />
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Settings page error:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
}
