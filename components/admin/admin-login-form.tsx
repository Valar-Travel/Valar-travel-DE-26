"use client"

import React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Loader2, AlertCircle, RefreshCw } from "lucide-react"

// Authorized admin emails that can log in without password
const AUTHORIZED_ADMIN_EMAILS = [
  "sarahkuhmichel5@gmail.com",
  "admin@valartravel.de",
]

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState("")
  const router = useRouter()

  // Check if the current email is an authorized admin email
  const isAuthorizedEmail = useMemo(() => {
    const normalizedEmail = email.toLowerCase().trim()
    return AUTHORIZED_ADMIN_EMAILS.some(e => e.toLowerCase() === normalizedEmail)
  }, [email])

  const handleResetAdmin = async () => {
    setResetting(true)
    setResetMessage("")
    setError("")
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: "RESET_ADMIN_2024" }),
      })
      const data = await res.json()
      if (data.success) {
        setResetMessage(`Admin reset! Use: ${data.users?.map((u: {email: string}) => u.email).join(" or ")} with password: ${data.password}`)
        setEmail("admin@valartravel.de")
        setPassword("ValarAdmin2024!")
      } else {
        setError(data.error || "Reset failed")
      }
    } catch {
      setError("Reset failed")
    }
    setResetting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 w-full border-neutral-300 focus:border-emerald-600 focus:ring-emerald-600"
            placeholder="admin@valartravel.de"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {!isAuthorizedEmail && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full border-neutral-300 focus:border-emerald-600 focus:ring-emerald-600"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
        </div>
      )}

      {isAuthorizedEmail && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm">
          Authorized admin email detected. Click Sign In to continue.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {resetMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {resetMessage}
        </div>
      )}

      <div className="pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetAdmin}
          disabled={resetting}
          className="w-full text-sm"
        >
          {resetting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Admin Password (One-time Setup)
            </>
          )}
        </Button>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Click this button to create/reset admin accounts
        </p>
      </div>
    </form>
  )
}
