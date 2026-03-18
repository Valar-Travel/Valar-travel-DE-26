"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Users, Bath, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format-currency"

interface RecommendedProperty {
  id: string
  name: string
  location: string
  price_per_night: number
  currency: string
  bedrooms: number
  bathrooms: number
  images: string[]
  amenities: string[]
}

interface Recommendation {
  property_id: string
  match_score: number
  match_reasons: string[]
  recommendation_type: string
  property: RecommendedProperty
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const matchReasonLabels: Record<string, string> = {
  destination_match: "Your favorite destination",
  price_match: "Within your budget",
  amenities_match: "Has your preferred amenities",
  type_match: "Your preferred style",
  family_friendly: "Perfect for families",
  romantic_getaway: "Romantic escape",
  luxury_experience: "Luxury experience",
  trending: "Trending now",
  new_listing: "New arrival",
}

export function PersonalizedRecommendations() {
  const { data, error, isLoading } = useSWR("/api/recommendations?limit=6", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  })

  const [shownIds, setShownIds] = useState<Set<string>>(new Set())

  // Track when recommendations are shown
  useEffect(() => {
    if (data?.recommendations) {
      for (const rec of data.recommendations) {
        if (!shownIds.has(rec.property_id)) {
          fetch("/api/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId: rec.property_id, action: "shown" }),
          })
          setShownIds(prev => new Set([...prev, rec.property_id]))
        }
      }
    }
  }, [data?.recommendations, shownIds])

  // Don't show section if not authenticated or no consent
  if (data?.requiresAuth || data?.requiresConsent) {
    return null
  }

  // Don't show if no recommendations
  if (!data?.recommendations || data.recommendations.length === 0) {
    return null
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return null
  }

  const recommendations: Recommendation[] = data.recommendations

  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Curated For You</h2>
              <p className="text-sm text-neutral-500">AI-powered recommendations based on your preferences</p>
            </div>
          </div>
          <Link href="/properties">
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 6).map((rec, index) => (
            <RecommendationCard key={rec.property_id} recommendation={rec} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface RecommendationCardProps {
  recommendation: Recommendation
  index: number
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const { property, match_score, match_reasons, recommendation_type } = recommendation
  const primaryImage = property.images?.[0] || "/placeholder-villa.jpg"
  const primaryReason = match_reasons[0]
  const reasonLabel = matchReasonLabels[primaryReason] || "Recommended for you"

  // Track click
  const handleClick = () => {
    fetch("/api/track-signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signalType: "property_view",
        signalData: { source: "ai_recommendation", match_score },
        propertyId: property.id,
      }),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/properties/${property.id}`} onClick={handleClick}>
        <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={primaryImage}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            
            {/* Match Score Badge */}
            <div className="absolute top-3 left-3">
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5",
                match_score >= 85 
                  ? "bg-emerald-500 text-white" 
                  : match_score >= 70 
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-white/90 text-neutral-700"
              )}>
                <Sparkles className="w-3 h-3" />
                {Math.round(match_score)}% Match
              </div>
            </div>

            {/* Reason Tag */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 inline-block">
                {reasonLabel}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {property.name}
            </h3>
            
            <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{property.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {property.bedrooms} bed
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" />
                  {property.bathrooms} bath
                </span>
              </div>
              
              <div className="text-right">
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(property.price_per_night, property.currency || "EUR")}
                </span>
                <span className="text-xs text-neutral-400 block">per night</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
