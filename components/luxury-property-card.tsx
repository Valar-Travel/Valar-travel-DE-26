"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Crown, Sparkles, Users, Calendar, Shield, Heart, Eye } from "lucide-react"
import { DynamicImage } from "./dynamic-image"
import { generateLuxurySummary } from "@/lib/description-enhancer"
import Link from "next/link"

interface LuxuryProperty {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  starRating: number
  price: number
  originalPrice?: number
  currency: string
  image: string
  images?: string[]
  coordinates?: { lat: number; lng: number }
  amenities: string[]
  affiliateLink: string
  description: string
  propertyType: string
  isLuxury: boolean
  badges: string[]
  luxuryScore?: number
  checkIn?: string
  checkOut?: string
  nights?: number
  reviewSnippet?: string // Added review snippet field
}

interface LuxuryPropertyCardProps {
  property: LuxuryProperty
  onMapClick?: (coordinates: { lat: number; lng: number }) => void
  onFavorite?: (propertyId: string) => void
  isFavorited?: boolean
  variant?: "grid" | "list"
}

export function LuxuryPropertyCard({
  property,
  onMapClick,
  onFavorite,
  isFavorited = false,
  variant = "grid",
}: LuxuryPropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const images = property.images || [property.image]
  const savings = property.originalPrice
    ? Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)
    : 0

  const luxuryDescription = generateLuxurySummary(property.description, 150)

  const getLuxuryAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("pool") || amenityLower.includes("infinity")) return "🏊"
    if (amenityLower.includes("spa")) return "🧖"
    if (amenityLower.includes("jacuzzi") || amenityLower.includes("hot tub")) return "🛁"
    if (amenityLower.includes("beach")) return "🏖️"
    if (amenityLower.includes("ocean") || amenityLower.includes("sea view")) return "🌊"
    if (amenityLower.includes("chef") || amenityLower.includes("kitchen")) return "👨‍🍳"
    if (amenityLower.includes("bbq") || amenityLower.includes("grill")) return "🍖"
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return "📶"
    if (amenityLower.includes("tv") || amenityLower.includes("theater")) return "📺"
    if (amenityLower.includes("gym") || amenityLower.includes("fitness")) return "💪"
    if (amenityLower.includes("tennis")) return "🎾"
    if (amenityLower.includes("golf")) return "⛳"
    if (amenityLower.includes("garden") || amenityLower.includes("tropical")) return "🌴"
    if (amenityLower.includes("terrace") || amenityLower.includes("patio")) return "🏡"
    if (amenityLower.includes("parking") || amenityLower.includes("garage")) return "🚗"
    if (amenityLower.includes("security") || amenityLower.includes("safe")) return "🔒"
    if (amenityLower.includes("housekeep") || amenityLower.includes("maid")) return "🧹"
    if (amenityLower.includes("concierge")) return "🛎️"
    if (amenityLower.includes("laundry") || amenityLower.includes("washer")) return "👕"
    if (amenityLower.includes("air condition") || amenityLower.includes("a/c")) return "❄️"
    if (amenityLower.includes("bedroom") || amenityLower.includes("suite")) return "🛏️"
    if (amenityLower.includes("bathroom")) return "🚿"
    if (amenityLower.includes("butler")) return "🤵"
    if (amenityLower.includes("champagne") || amenityLower.includes("bar")) return "🥂"
    if (amenityLower.includes("sun loung")) return "🌞"
    return "✨"
  }

  const handleBookNow = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "luxury_property_click", {
        event_category: "view_property",
        event_label: property.name,
        property_type: property.propertyType,
        luxury_score: property.luxuryScore,
        star_rating: property.starRating,
        value: property.price,
      })
    }
  }

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(property.id)
    }
  }

  const handleViewOnMap = () => {
    if (onMapClick && property.coordinates) {
      onMapClick(property.coordinates)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (variant === "list") {
    return (
      <Card
        className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-amber-50/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Enhanced Image Gallery */}
          <div className="relative w-full lg:w-96 h-64 lg:h-80 group">
            <DynamicImage
              src={images}
              alt={property.name}
              propertyType={property.propertyType}
              width={384}
              height={320}
              className="w-full h-full"
              enableGallery={true}
              transformations={{
                quality: 90,
                format: "webp",
                crop: "fill",
                gravity: "auto",
              }}
              onImageError={(url) => {
                console.log(`[v0] Image failed to load: ${url}`)
              }}
            />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Luxury Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {property.isLuxury && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Luxury
                </Badge>
              )}
              {savings > 20 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  Save {savings}%
                </Badge>
              )}
              {property.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-black/70 text-white border-0">
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>

          {/* Enhanced Property Details */}
          <CardContent className="flex-1 p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{property.name}</h3>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{property.location}</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">{luxuryDescription}</p>

                {property.reviewSnippet && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <div className="flex text-amber-400 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 italic leading-relaxed">"{property.reviewSnippet}"</p>
                        <p className="text-xs text-gray-500 mt-1">Recent guest review</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Rating Display */}
              <div className="ml-6 text-right">
                <div className="text-xs text-gray-600">{property.reviewCount} reviews</div>
                {property.luxuryScore && (
                  <div className="text-xs text-amber-600 font-medium mt-1">
                    Luxury Score: {property.luxuryScore}/100
                  </div>
                )}
              </div>
            </div>

            {/* Premium Amenities */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Premium Amenities
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {property.amenities.slice(0, 8).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-gray-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100"
                  >
                    <span className="mr-2">{getLuxuryAmenityIcon(amenity)}</span>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Details */}
            {(property.checkIn || property.nights) && (
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                {property.checkIn && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {property.checkIn} - {property.checkOut}
                    </span>
                  </div>
                )}
                {property.nights && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{property.nights} nights</span>
                  </div>
                )}
              </div>
            )}

            {/* Price and Actions */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  {property.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {property.currency}
                      {property.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    {property.currency}
                    {property.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-semibold">per night, includes taxes & fees</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium">Best Price Guarantee</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 ml-6">
                {property.coordinates && (
                  <Button
                    onClick={handleViewOnMap}
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                )}
                <Button
                  onClick={handleBookNow}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl px-10 py-3 text-lg font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href={`/villas/${property.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Grid variant (compact card)
  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-emerald-50/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <DynamicImage
          src={images}
          alt={property.name}
          propertyType={property.propertyType}
          width={400}
          height={256}
          className="w-full h-full"
          enableGallery={images.length > 1}
          transformations={{
            quality: 85,
            format: "webp",
            crop: "fill",
            gravity: "center",
          }}
          onImageError={(url) => {
            console.log(`[v0] Grid image failed to load: ${url}`)
          }}
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {property.isLuxury && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Luxury
            </Badge>
          )}
          {savings > 20 && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              Save {savings}%
            </Badge>
          )}
        </div>

        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      {/* Content Section */}
      <CardContent className="p-6">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">{property.name}</h3>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{luxuryDescription}</p>

        {property.reviewSnippet && (
          <div className="bg-amber-50 border border-amber-200 p-3 mb-4 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-700 italic line-clamp-2">"{property.reviewSnippet}"</p>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              <span className="mr-1">{getLuxuryAmenityIcon(amenity)}</span>
              {amenity}
            </Badge>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-baseline gap-1">
              {property.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {property.currency}
                  {property.originalPrice}
                </span>
              )}
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                {property.currency}
                {property.price}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-semibold">per night</p>
          </div>

          <Button
            onClick={handleBookNow}
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            asChild
          >
            <Link href={`/villas/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
