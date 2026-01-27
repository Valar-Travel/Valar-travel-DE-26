import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard | Valar Travel Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getAdminUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("valar_admin_session")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const supabase = createAdminClient()

    const { data: session } = await supabase
      .from("admin_sessions")
      .select(`
        admin_users (
          id,
          email,
          name,
          role
        )
      `)
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (!session?.admin_users) {
      return null
    }

    return session.admin_users as { id: string; email: string; name: string; role: string }
  } catch {
    return null
  }
}

export default async function AdminDashboardPage() {
  const user = await getAdminUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminDashboardClient userName={user.name} />
}
