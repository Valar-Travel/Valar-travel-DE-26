"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (username === "sarah" && password === "valar2025") {
      localStorage.setItem("valar_admin_auth", "valar-admin-logged-in")
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminUser", "Sarah Kuhmichel")

      // Redirect to admin properties
      router.push("/admin/properties")
    } else {
      setError("Invalid credentials. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">Valar Travel</h1>
          <p className="text-emerald-200 text-sm tracking-wider uppercase">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-serif text-neutral-900 mb-2 text-center">Admin Login</h2>
          <p className="text-sm text-neutral-600 text-center mb-6">
            Use your username and password (no email required)
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border-neutral-300 focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border-neutral-300 focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Test Credentials Info */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center mb-2">Test Credentials:</p>
            <div className="bg-neutral-50 rounded p-3 text-sm font-mono">
              <div className="text-neutral-700">
                <span className="text-neutral-500">Username:</span> sarah
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Password:</span> valar2025
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-3 text-center font-medium">
              ⓘ No email verification required - just enter username and password above
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
