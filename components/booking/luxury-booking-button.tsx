"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { LuxuryBookingForm } from "./luxury-booking-form"

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
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsFormOpen(true)}
      >
        {children || (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Book with Concierge
          </>
        )}
      </Button>

      <LuxuryBookingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        villa={villa}
      />
    </>
  )
}
