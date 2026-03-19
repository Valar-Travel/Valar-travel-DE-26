"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialAuthButtons, SocialAuthDivider } from "@/components/auth/social-auth-buttons"
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react"

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      // Trigger onboarding (welcome email, mailing list, admin notification)
      if (data?.user) {
        try {
          await fetch("/api/webhooks/new-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              name: displayName,
              provider: "email",
            }),
          })
        } catch (e) {
          // Don't block signup if onboarding fails
          console.error("Onboarding error:", e)
        }
      }
      router.push("/auth/sign-up-success")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white p-4">
      <Card className="w-full max-w-md border-neutral-200 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl tracking-tight">Create Account</CardTitle>
          <CardDescription>Join Valar Travel for exclusive villa experiences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Auth */}
          <SocialAuthButtons 
            redirectTo={redirectTo} 
            onError={(err) => setMessage(err)}
          />

          <SocialAuthDivider />

          {/* Email Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                Your Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="How should we address you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            {message && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">{message}</p>
            )}
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <Link 
                href={`/auth/login${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} 
                className="text-emerald-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  )
}
