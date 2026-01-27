import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export const metadata: Metadata = {
  title: "Admin Login | Valar Travel",
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

export default async function AdminLoginPage() {
  // Check if already logged in
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("valar_admin_session")?.value

  if (sessionToken) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">Valar Travel</h1>
          <p className="text-emerald-200 text-sm tracking-wider uppercase">Admin Portal</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-serif text-neutral-900 mb-2 text-center">Admin Login</h2>
          <p className="text-sm text-neutral-600 text-center mb-6">Sign in with your admin credentials</p>
          <AdminLoginForm />
        </div>

        <p className="text-center text-sm text-emerald-200/60 mt-6">
          Valar Travel Internal Management System
        </p>
      </div>
    </div>
  )
}
