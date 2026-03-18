"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on login page
      if (pathname === "/admin/login") {
        setIsChecking(false)
        setIsAuthenticated(true)
        return
      }

      try {
        const res = await fetch("/api/admin/auth/verify", {
          method: "GET",
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          if (data.authenticated && data.user) {
            setUser(data.user)
            setIsAuthenticated(true)
          } else {
            router.push("/admin/login")
          }
        } else {
          router.push("/admin/login")
        }
      } catch {
        router.push("/admin/login")
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  return <>{children}</>
}
