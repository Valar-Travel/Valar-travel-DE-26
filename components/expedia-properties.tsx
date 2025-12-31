"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ExternalLink, Car, Bed, Plus } from "lucide-react"

interface ExpediaProperty {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  location: string
  amenities: string[]
  affiliateLink: string
  description: string
  propertyType: "hotel" | "car"
}

interface ExpediaPropertiesProps {
  destination: string
  type: "hotels" | "cars"
  checkIn?: string
  checkOut?: string
  adults?: number
  rooms?: number
}

export default function ExpediaProperties({
  destination,
  type,
  checkIn,
  checkOut,
  adults = 2,
  rooms = 1,
}: ExpediaPropertiesProps) {
  const [properties, setProperties] = useState<ExpediaProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const endpoint =
          type === "hotels"
            ? `/api/expedia/hotels/search?destination=${encodeURIComponent(destination)}&adults=${adults}&rooms=${rooms}`
            : `/api/expedia/car-rentals/search?location=${encodeURIComponent(destination)}`

        const response = await fetch(endpoint)
        const data = await response.json()

        if (data.success && (data.properties || data.cars)) {
          setProperties(data.properties || data.cars || [])
        } else {
          setProperties([])
        }
      } catch (err) {
        console.error(`[v0] Error fetching ${type}:`, err)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [destination, type, adults, rooms])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          {type === "hotels" ? <Bed className="h-8 w-8 text-blue-600" /> : <Car className="h-8 w-8 text-green-600" />}
          <h2 className="text-3xl font-bold text-ocean-900">
            {type === "hotels" ? "Hotels" : "Car Rentals"} in {destination}
          </h2>
        </div>
        <Card className="p-12 text-center bg-gray-50">
          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No {type} Available</h3>
          <p className="text-gray-500 mb-4">Properties can be added via the admin panel.</p>
          <Button asChild variant="outline">
            <Link href="/admin/properties">Go to Admin Panel</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        {type === "hotels" ? <Bed className="h-8 w-8 text-blue-600" /> : <Car className="h-8 w-8 text-green-600" />}
        <h2 className="text-3xl font-bold text-ocean-900">
          {type === "hotels" ? "Hotels" : "Car Rentals"} in {destination}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/90 backdrop-blur-sm"
          >
            <div className="relative h-48 overflow-hidden">
              {property.image ? (
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {property.originalPrice && (
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  Save ${property.originalPrice - property.price}
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ocean-900 mb-1 line-clamp-1">{property.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-ocean-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-ocean-900">${property.price}</div>
                  {property.originalPrice && (
                    <div className="text-sm text-ocean-600 line-through">${property.originalPrice}</div>
                  )}
                  <div className="text-xs text-ocean-500">{type === "hotels" ? "per night" : "per day"}</div>
                </div>
              </div>

              {property.rating > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(property.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-ocean-700">{property.rating}</span>
                  <span className="text-sm text-ocean-500">({property.reviewCount} reviews)</span>
                </div>
              )}

              <p className="text-sm text-ocean-700 mb-4 line-clamp-2">{property.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-ocean-50 text-ocean-700">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-ocean-50 text-ocean-700">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              {property.affiliateLink && property.affiliateLink !== "#" ? (
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Link href={property.affiliateLink} target="_blank" rel="noopener noreferrer">
                    View Details
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button className="w-full bg-transparent" variant="outline">
                  View Details
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
