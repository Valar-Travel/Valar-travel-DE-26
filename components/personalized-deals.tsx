"use client"

import { useEffect, useState } from "react"
import { usePersonalization } from "@/hooks/use-personalization"
import { DealCard } from "./deal-card"
import { Skeleton } from "./ui/skeleton"
import { TrendingUp, User } from "lucide-react"

interface Deal {
  id: string
  name: string
  city: string
  price: number
  normal_price: number
  discount_type: string
  affiliate_link: string
  image_url?: string
  star_rating?: number
  review_score?: number
  review_count?: number
}

export function PersonalizedDeals() {
  const { getPersonalizedDeals, session, isLoading: sessionLoading } = usePersonalization()
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPersonalizedDeals = async () => {
      if (sessionLoading || !session) return

      try {
        const personalizedDeals = await getPersonalizedDeals()
        setDeals(personalizedDeals)
      } catch (error) {
        console.error("Error loading personalized deals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPersonalizedDeals()
  }, [session, sessionLoading])

  if (sessionLoading || isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!deals.length) {
    return null
  }

  const getPersonalizationReason = () => {
    if (session?.preferences?.destinations.length) {
      return `Based on your interest in ${session.preferences.destinations.slice(0, 2).join(" and ")}`
    }
    if (session?.location?.city) {
      return `Recommended for travelers from ${session.location.city}`
    }
    return "Curated just for you"
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Personalized for You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Perfect Deals</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Discover handpicked luxury accommodations tailored to your preferences and travel style.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>{getPersonalizationReason()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, 6).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {deals.length > 6 && (
          <div className="text-center mt-8">
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              View More Personalized Deals
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
