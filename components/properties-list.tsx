"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, ExternalLink } from "lucide-react"

interface Property {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  currency: string
  image: string
  amenities: string[]
  description: string
  affiliateUrl: string
  isSponsored: boolean
  images?: string[]
  rates?: any
}

interface PropertiesListProps {
  destination?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  rooms?: number
}

export default function PropertiesList({
  destination = "Paris",
  checkIn,
  checkOut,
  adults = 2,
  rooms = 1,
}: PropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [destination, checkIn, checkOut, adults, rooms])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        destination,
        adults: adults.toString(),
        rooms: rooms.toString(),
        include: "images,amenities,rates",
      })

      if (checkIn) params.append("checkIn", checkIn)
      if (checkOut) params.append("checkOut", checkOut)

      console.log("[v0] Fetching properties with include parameters:", params.get("include"))
      const response = await fetch(`/api/properties?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch properties")
      }

      const data = await response.json()

      console.log("[v0] Properties API Response JSON:")
      console.log("[v0] Response structure:", Object.keys(data))
      console.log("[v0] Debug info:", data.debug)
      console.log(
        "[v0] Image URLs verification:",
        data.properties?.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          imageCount: p.images?.length || 0,
          hasRates: !!p.rates,
        })),
      )

      setProperties(data.properties || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading properties: {error}</p>
        <Button onClick={fetchProperties} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hotels in {destination}</h2>
        <p className="text-gray-600">{properties.length} properties found</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              {property.isSponsored && <Badge className="absolute top-2 left-2 bg-blue-600">Sponsored</Badge>}
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">{property.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < property.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({property.reviewCount} reviews)</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{property.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {property.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {property.currency}
                      {property.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-bold text-green-600">
                    {property.currency}
                    {property.price}
                  </span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>

                <Button asChild size="sm">
                  <a
                    href={property.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Book Now
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
