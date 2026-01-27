"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Plane, Calendar, Star } from "lucide-react"
import Link from "next/link"

interface TargetedCTAProps {
  position?: "hero" | "sidebar" | "footer"
  className?: string
}

interface CTAData {
  type: "deal" | "destination" | "booking" | "upgrade" | "default"
  headline: string
  description: string
  buttonText: string
  buttonLink: string
  icon: "gift" | "plane" | "calendar" | "star"
}

const iconMap = {
  gift: Gift,
  plane: Plane,
  calendar: Calendar,
  star: Star,
}

export function TargetedCTA({ position = "hero", className }: TargetedCTAProps) {
  const [cta, setCTA] = useState<CTAData | null>(null)

  useEffect(() => {
    async function fetchTargetedCTA() {
      try {
        const response = await fetch(`/api/crm/targeted-cta?position=${position}`)
        const data = await response.json()
        setCTA(data.cta)
      } catch (error) {
        // Use default CTA
        setCTA({
          type: "default",
          headline: "Find Your Perfect Caribbean Escape",
          description: "Discover handpicked luxury villas across the Caribbean islands",
          buttonText: "Browse Villas",
          buttonLink: "/villas",
          icon: "plane",
        })
      }
    }

    fetchTargetedCTA()
  }, [position])

  if (!cta) return null

  const Icon = iconMap[cta.icon]

  if (position === "sidebar") {
    return (
      <div className={`bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <Icon className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium tracking-widest text-emerald-600 uppercase">Special Offer</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{cta.headline}</h3>
        <p className="text-sm text-gray-600 mb-4">{cta.description}</p>
        <Link href={cta.buttonLink}>
          <Button size="sm" className="w-full rounded-none tracking-wider bg-emerald-700 hover:bg-emerald-800">
            {cta.buttonText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white py-16 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">{cta.headline}</h2>
        <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">{cta.description}</p>
        <Link href={cta.buttonLink}>
          <Button size="lg" className="rounded-none tracking-wider bg-amber-500 hover:bg-amber-600 text-gray-900">
            {cta.buttonText}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
