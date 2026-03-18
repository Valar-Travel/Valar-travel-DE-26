"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Sparkles, 
  MapPin, 
  Bed, 
  Bath, 
  ChevronRight,
  Settings2,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PrivacyConsentModal } from "@/components/privacy/privacy-consent-modal"

interface RecommendedProperty {
  id: string
  property_id: string
  match_score: number
  match_reasons: string[]
  recommendation_type: string
  scraped_properties: {
    id: string
    name: string
    location: string
    price_per_night: number
    currency: string
    bedrooms: number
    bathrooms: number
    images: string[]
    property_type: string
  }
}

interface CuratedForYouProps {
  className?: string
  showTitle?: boolean
  maxItems?: number
}

export function CuratedForYou({ 
  className, 
  showTitle = true, 
  maxItems = 6 
}: CuratedForYouProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [hasConsent, setHasConsent] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)

  useEffect(() => {
    const fetchRecommendations = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }
      
      setIsAuthenticated(true)

      // Check consent
      const { data: consent } = await supabase
        .from("user_privacy_consent")
        .select("ai_recommendations")
        .eq("user_id", user.id)
        .single()

      if (!consent?.ai_recommendations) {
        setHasConsent(false)
        setLoading(false)
        return
      }

      setHasConsent(true)

      // Fetch recommendations
      const { data: recs } = await supabase
        .from("ai_recommendations")
        .select(`
          id,
          property_id,
          match_score,
          match_reasons,
          recommendation_type,
          scraped_properties (
            id,
            name,
            location,
            price_per_night,
            currency,
            bedrooms,
            bathrooms,
            images,
            property_type
          )
        `)
        .eq("user_id", user.id)
        .gt("expires_at", new Date().toISOString())
        .order("match_score", { ascending: false })
        .limit(maxItems)

      if (recs && recs.length > 0) {
        setRecommendations(recs as RecommendedProperty[])
        
        // Mark as shown
        for (const rec of recs) {
          await supabase
            .from("ai_recommendations")
            .update({ was_shown: true, shown_at: new Date().toISOString() })
            .eq("id", rec.id)
        }
      }

      setLoading(false)
    }

    fetchRecommendations()
  }, [maxItems])

  // Show nothing if not authenticated
  if (!isAuthenticated && !loading) {
    return null
  }

  // Show consent prompt if no AI consent
  if (!hasConsent && !loading && isAuthenticated) {
    return (
      <section className={cn("py-16 bg-gradient-to-b from-emerald-50/50 to-white", className)}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recommendations
            </div>
            <h2 className="text-3xl font-serif mb-4">
              Discover Villas Curated Just for You
            </h2>
            <p className="text-neutral-600 mb-8">
              Enable AI recommendations to receive personalized villa suggestions based on your preferences and browsing history.
            </p>
            <Button 
              onClick={() => setShowConsentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Enable Personalization
            </Button>
          </div>
        </div>

        <PrivacyConsentModal
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          onConsentSaved={(consent) => {
            if (consent.ai_recommendations) {
              setHasConsent(true)
              window.location.reload()
            }
          }}
        />
      </section>
    )
  }

  // Loading state
  if (loading) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container mx-auto px-4">
          {showTitle && (
            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // No recommendations yet
  if (recommendations.length === 0) {
    return (
      <section className={cn("py-16 bg-neutral-50", className)}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-3">Building Your Recommendations</h2>
            <p className="text-neutral-600">
              Browse a few more villas and we'll start curating personalized suggestions for you.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-serif">Curated For You</h2>
              <Badge 
                variant="secondary" 
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Picks
              </Badge>
            </div>
            <Link 
              href="/recommendations" 
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <RecommendationCard 
              key={rec.id} 
              recommendation={rec}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface RecommendationCardProps {
  recommendation: RecommendedProperty
  index: number
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const property = recommendation.scraped_properties
  const [isFavorited, setIsFavorited] = useState(false)
  
  if (!property) return null

  const imageUrl = property.images?.[0] || "/placeholder-villa.jpg"
  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: property.currency || "EUR",
    minimumFractionDigits: 0,
  }).format(property.price_per_night || 0)

  const handleClick = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from("ai_recommendations")
        .update({ was_clicked: true, clicked_at: new Date().toISOString() })
        .eq("id", recommendation.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/properties/${property.id}`} onClick={handleClick}>
        <Card className="group overflow-hidden border-neutral-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            
            {/* Match Score Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-emerald-700 backdrop-blur-sm font-semibold">
                {Math.round(recommendation.match_score)}% Match
              </Badge>
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <Heart 
                className={cn(
                  "w-4 h-4 transition-colors",
                  isFavorited ? "fill-red-500 text-red-500" : "text-neutral-600"
                )} 
              />
            </button>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <CardContent className="p-4">
            {/* Property Name */}
            <h3 className="font-semibold text-lg text-neutral-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {property.name}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-neutral-500 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{property.location}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} baths</span>
              </div>
            </div>

            {/* Match Reasons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recommendation.match_reasons.slice(0, 2).map((reason, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full"
                >
                  {reason}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div>
                <span className="text-lg font-semibold text-neutral-900">
                  {formattedPrice}
                </span>
                <span className="text-sm text-neutral-500"> / night</span>
              </div>
              <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
