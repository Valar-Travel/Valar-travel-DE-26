"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  /** If true, navigates to the dedicated checkout page instead of opening modal */
  useCheckoutPage?: boolean
}

export function VillaBookingButton({ 
  villa, 
  variant = "default", 
  size = "default",
  className = "",
  children,
  useCheckoutPage = false
}: VillaBookingButtonProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (useCheckoutPage) {
      router.push(`/checkout/${villa.id}`)
    } else {
      setIsCheckoutOpen(true)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children || (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Book Now
          </>
        )}
      </Button>

      {!useCheckoutPage && (
        <VillaCheckout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          villa={villa}
        />
      )}
    </>
  )
}
