"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, ExternalLink } from "lucide-react"
import Image from "next/image"
import { PropertyCarousel } from "./property-carousel"

interface PropertyCardProps {
  property: {
    id?: string
    name: string
    location?: string
    city?: string
    rating: string | number
    price: string | number
    price_per_night?: string | number
    image_url?: string
    images?: string
    review_snippet?: string
    affiliate_link?: string
    url?: string
    description?: string
    reviews?: string
    coordinates?: { lat: number; lng: number }
  }
  affiliateLink?: string
}

function PropertyCard({ property, affiliateLink }: PropertyCardProps) {
  const rating = typeof property.rating === "string" ? Number.parseFloat(property.rating) || 0 : property.rating || 0
  const reviewCount = property.reviews ? Number.parseInt(property.reviews) || 0 : 0
  const price = property.price_per_night || property.price || 0
  const location = property.location || property.city || ""
  const imageUrl =
    property.image_url || (property.images ? property.images.split(",")[0] : "/placeholder.svg?height=224&width=400")
  const bookingUrl = property.affiliate_link || property.url || affiliateLink || "#"

  const createAffiliateUrl = (originalUrl: string) => {
    if (!originalUrl || originalUrl === "#") return "#"
    try {
      const url = new URL(originalUrl)
      url.searchParams.set("affiliate", "cTACVOG")
      url.searchParams.set("ref", "valar-travel")
      return url.toString()
    } catch {
      return affiliateLink ? `${affiliateLink}?redirect=${encodeURIComponent(originalUrl)}` : originalUrl
    }
  }

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50/20 group">
      <div className="relative w-full h-56 overflow-hidden">
        {property.images ? (
          <PropertyCarousel images={property.images} propertyName={property.name} />
        ) : (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-white" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{property.name}</h2>
          {location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-amber-600">
              {rating.toFixed(1)} {reviewCount > 0 && `(${reviewCount} reviews)`}
            </span>
          </div>
        )}

        <div className="mb-4">
          <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ${typeof price === "string" ? price : price.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 font-semibold">per night</p>
        </div>

        {property.review_snippet && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4 rounded-r-lg">
            <div className="flex items-start gap-2">
              <div className="flex text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{property.review_snippet}"</p>
                <p className="text-xs text-gray-500 mt-1">Recent guest review</p>
              </div>
            </div>
          </div>
        )}

        {property.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">{property.description}</p>
        )}

        <Button
          asChild
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <a
            href={createAffiliateUrl(bookingUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Book Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export { PropertyCard }
export default PropertyCard
