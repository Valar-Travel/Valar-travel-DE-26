"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    const valarAdminAuth = localStorage.getItem("valar_admin_auth")

    if (adminLoggedIn === "true" || valarAdminAuth === "valar-admin-logged-in") {
      setIsAuthenticated(true)
      setIsChecking(false)
    } else {
      // Redirect to login page
      router.push("/admin/login")
    }
  }, [router])

  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
