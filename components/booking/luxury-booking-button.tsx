"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { LuxuryBookingForm } from "./luxury-booking-form"
import { AuthModal } from "./auth-modal"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface LuxuryBookingButtonProps {
  villa: {
    id: string
    name: string
    location: string
    pricePerNight: number
    currency: string
    maxGuests: number
    image?: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

export function LuxuryBookingButton({
  villa,
  variant = "default",
  size = "default",
  className = "",
  children,
}: LuxuryBookingButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleClick = () => {
    if (loading) return
    
    if (user) {
      // User is authenticated, open booking form directly
      setIsFormOpen(true)
    } else {
      // User not authenticated, show auth modal first
      setIsAuthModalOpen(true)
    }
  }

  const handleAuthSuccess = () => {
    // Close auth modal and open booking form
    setIsAuthModalOpen(false)
    setIsFormOpen(true)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={loading}
      >
        {children || (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Book with Concierge
          </>
        )}
      </Button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        villaName={villa.name}
      />

      <LuxuryBookingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        villa={villa}
      />
    </>
  )
}
