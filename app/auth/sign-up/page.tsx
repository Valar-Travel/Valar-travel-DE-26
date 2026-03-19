"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function SignUpFormContent({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
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
          console.error("Onboarding error:", e)
        }
      }
      router.push("/auth/sign-up-success")
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setOauthLoading(true)
    setMessage("")
    
    try {
      const supabase = createClient()
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        setMessage(error.message)
        setOauthLoading(false)
        return
      }

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Authentication failed")
      setOauthLoading(false)
    }
  }

  return (
    <>
      {/* Full-screen loading overlay for OAuth */}
      <AnimatePresence>
        {oauthLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/95 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
              </motion.div>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-lg font-light tracking-wide"
              >
                Connecting to Google...
              </motion.p>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-neutral-400 text-sm mt-2"
              >
                You'll be redirected momentarily
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-14 font-medium bg-white hover:bg-neutral-50 border-0 text-neutral-800 transition-all shadow-lg"
          onClick={handleGoogleSignIn}
          disabled={loading || oauthLoading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-4 text-neutral-500 tracking-widest">or</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block font-light">
              Your Name
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="How should we address you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-12 h-14 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block font-light">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block font-light">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-medium tracking-wide transition-all mt-2" 
            disabled={loading || oauthLoading}
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
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg text-center border border-red-800/30"
            >
              {message}
            </motion.p>
          )}
        </form>
      </div>
    </>
  )
}

function SignUpFormWithParams() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/onboarding"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Logo/Brand */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-light tracking-wide">
            <span className="text-white">Valar</span>
            <span className="text-emerald-400 ml-1">Travel</span>
          </h1>
        </Link>
        <p className="text-neutral-400 mt-3 font-light tracking-wide">
          Begin your luxury journey
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8 shadow-2xl">
        <SignUpFormContent redirectTo={redirectTo} />
        
        <div className="mt-8 pt-6 border-t border-neutral-700/50 text-center">
          <p className="text-sm text-neutral-400 font-light">
            Already have an account?{" "}
            <Link
              href={`/auth/login${redirectTo !== "/onboarding" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
        
        <p className="text-xs text-neutral-600 text-center mt-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-neutral-600 text-xs mt-8 font-light tracking-wide">
        Exclusive Caribbean Villa Experiences
      </p>
    </motion.div>
  )
}

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-neutral-400 mt-4">Loading...</p>
          </div>
        }
      >
        <SignUpFormWithParams />
      </Suspense>
    </div>
  )
}
