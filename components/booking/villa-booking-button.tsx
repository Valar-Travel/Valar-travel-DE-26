"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { VillaCheckout } from "./villa-checkout"

interface VillaBookingButtonProps {
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

export function VillaBookingButton({ 
  villa, 
  variant = "default", 
  size = "default",
  className = "",
  children 
}: VillaBookingButtonProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsCheckoutOpen(true)}
      >
        {children || (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Book Now
          </>
        )}
      </Button>

      <VillaCheckout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        villa={villa}
      />
    </>
  )
}
