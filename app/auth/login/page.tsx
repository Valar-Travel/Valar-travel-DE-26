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
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"

function LoginFormContent({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Social Auth */}
      <SocialAuthButtons 
        redirectTo={redirectTo} 
        onError={(err) => setMessage(err)}
      />

      <SocialAuthDivider />

      {/* Email Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 bg-neutral-50 border-neutral-200"
              required
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
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        {message && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">{message}</p>
        )}
      </form>
    </div>
  )
}

function LoginFormWithParams() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/onboarding"

  return (
    <Card className="w-full max-w-md border-neutral-200 shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl tracking-tight">Welcome Back</CardTitle>
        <CardDescription>Sign in to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginFormContent redirectTo={redirectTo} />
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link
              href={`/auth/sign-up${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-emerald-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <LoginFormWithParams />
      </Suspense>
    </div>
  )
}
