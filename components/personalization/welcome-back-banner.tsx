"use client"

import { useEffect, useState } from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface WelcomeBackBannerProps {
  className?: string
}

interface UserData {
  firstName?: string
  lastDestination?: string
  savedProperties?: number
  daysAway?: number
}

export function WelcomeBackBanner({ className }: WelcomeBackBannerProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/crm/user-context")
        const data = await response.json()

        if (data.isReturningUser) {
          setUserData({
            firstName: data.firstName,
            lastDestination: data.lastDestination,
            savedProperties: data.savedProperties,
            daysAway: data.daysAway,
          })
        }
      } catch {
        // Silently fail - non-critical personalization
      } finally {
        setLoading(false)
      }
    }

    // Check if banner was dismissed in this session
    const wasDismissed = sessionStorage.getItem("welcome_banner_dismissed")
    if (wasDismissed) {
      setDismissed(true)
      setLoading(false)
      return
    }

    fetchUserData()
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem("welcome_banner_dismissed", "true")
  }

  if (loading || dismissed || !userData) {
    return null
  }

  const getMessage = () => {
    if (userData.daysAway && userData.daysAway > 30) {
      return `We've missed you! It's been ${userData.daysAway} days. Check out what's new.`
    }
    if (userData.lastDestination) {
      return `Still dreaming of ${userData.lastDestination}? We have new properties waiting for you.`
    }
    if (userData.savedProperties && userData.savedProperties > 0) {
      return `You have ${userData.savedProperties} saved properties. Ready to book your next getaway?`
    }
    return "Welcome back! Ready to plan your next Caribbean adventure?"
  }

  return (
    <div
      className={`bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white py-3 px-4 ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-300" />
          <p className="text-sm md:text-base">
            <span className="font-semibold">
              {userData.firstName ? `Welcome back, ${userData.firstName}!` : "Welcome back!"}
            </span>{" "}
            <span className="hidden sm:inline text-emerald-100">{getMessage()}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={userData.lastDestination ? `/destinations/${userData.lastDestination.toLowerCase()}` : "/villas"}>
            <Button size="sm" variant="secondary" className="rounded-none text-xs tracking-wider">
              Explore Now
            </Button>
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
