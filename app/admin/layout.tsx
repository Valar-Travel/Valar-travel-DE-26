import React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = {
  title: "Admin Dashboard | Valar Travel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "editor"
}

async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("valar_admin_session")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const supabase = createAdminClient()

    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select(`
        *,
        admin_users (
          id,
          email,
          name,
          role,
          is_active
        )
      `)
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session || !session.admin_users) {
      return null
    }

    const user = session.admin_users as AdminUser & { is_active: boolean }

    if (!user.is_active) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()

  // Allow login page without auth
  const cookieStore = await cookies()
  const isLoginPage = cookieStore.get("valar_admin_session") === undefined

  // If not authenticated and not on login page, the individual pages will handle redirect
  // Login page handles its own layout

  return (
    <div className="min-h-screen bg-neutral-50">
      {user ? (
        <>
          <AdminSidebar user={user} />
          <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
