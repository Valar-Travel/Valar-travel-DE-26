"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MapPin, Star, ArrowRight } from "lucide-react"
import { DynamicImage } from "@/components/dynamic-image"
import Link from "next/link"
import { useCRMAnalytics } from "@/hooks/use-crm-analytics"

interface Property {
  id: string
  name: string
  destination?: string
  location?: string
  price?: number
  price_per_night?: number
  nightly_rate?: number
  image_url?: string
  image?: string
  images?: string[]
  rating?: number
  property_type?: string
  propertyType?: string
  match_reason?: string
  slug?: string
}

interface PersonalizedRecommendationsProps {
  userId?: string
  maxItems?: number
  title?: string
  subtitle?: string
}

export function PersonalizedRecommendations({
  userId,
  maxItems = 4,
  title = "Recommended for You",
  subtitle = "Based on your preferences and browsing history",
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { trackPropertyClick } = useCRMAnalytics()

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch(`/api/crm/recommendations?limit=${maxItems}`)
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch {
        // Silently fail - non-critical personalization
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId, maxItems])

  const handlePropertyClick = (property: Property) => {
    const price = property.price ?? property.price_per_night ?? property.nightly_rate ?? 0
    const destination = property.destination ?? property.location ?? "Caribbean"

    trackPropertyClick({
      id: property.id,
      name: property.name,
      destination,
      price,
      source: "personalized_recommendations",
    })
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: maxItems }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-2">Personalized</p>
          <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((property) => {
            const price = property.price ?? property.price_per_night ?? property.nightly_rate
            const destination = property.destination ?? property.location ?? "Caribbean"
            const images =
              property.images ??
              (property.image_url ? [property.image_url] : null) ??
              (property.image ? [property.image] : null) ??
              []
            const propertyType = property.property_type ?? property.propertyType ?? "Villa"
            const propertyLink = property.slug ? `/villas/${property.slug}` : `/villas/${property.id}`

            return (
              <Link
                key={property.id}
                href={propertyLink}
                onClick={() => handlePropertyClick(property)}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <DynamicImage
                      src={images}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackSrc="/images/fallback-luxury-villa.jpg"
                      propertyType="villa"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        type="button"
                        className="h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    {property.match_reason && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge className="bg-emerald-600/90 text-white text-xs">{property.match_reason}</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {property.name}
                      </h3>
                      {property.rating && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{property.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {destination}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {price != null && price > 0 ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">${price.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm"> /night</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Contact for pricing</span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {propertyType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/villas">
            <Button variant="outline" className="rounded-none tracking-wider bg-transparent">
              View All Properties
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
