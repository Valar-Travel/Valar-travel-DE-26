"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SocialAuthButtons, SocialAuthDivider } from "@/components/auth/social-auth-buttons"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  villaName?: string
}

type AuthMode = "signup" | "login"

export function AuthModal({ isOpen, onClose, onSuccess, villaName }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
          data: {
            display_name: displayName,
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setSuccess(true)
        // Wait a moment then proceed - user can verify email later
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        onSuccess()
      }
    }
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setDisplayName("")
    setError("")
    setSuccess(false)
    setMode("signup")
    onClose()
  }

  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {mode === "signup" ? "Join Valar Travel" : "Welcome Back"}
              </h2>
              <p className="text-xs text-neutral-500">
                {villaName ? `Continue booking ${villaName}` : "Access exclusive villa experiences"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Account Created</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Check your email to verify your account. Continuing to booking...
                </p>
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Social Auth Buttons */}
                <SocialAuthButtons
                  redirectTo={window.location.pathname}
                  onError={(err) => setError(err)}
                />

                <SocialAuthDivider />

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
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
                )}

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
                      placeholder={mode === "signup" ? "Create a secure password" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-neutral-50 border-neutral-200"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-12 font-semibold tracking-wide transition-all",
                    "bg-emerald-600 hover:bg-emerald-700 text-white"
                  )}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Create Account & Continue" : "Sign In & Continue"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                </form>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-10 text-sm text-neutral-500"
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                >
                  {mode === "signup" 
                    ? "Already have an account? Sign in" 
                    : "New to Valar Travel? Create account"}
                </Button>

                {mode === "signup" && (
                  <p className="text-xs text-neutral-400 text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
