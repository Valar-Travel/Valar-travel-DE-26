"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"
import { OptimizedImage } from "./optimized-image"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

interface Hotel {
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
  description?: string
}

interface HotelCardProps {
  hotel: Hotel
  source: "expedia" | "hotels.com" | "booking.com"
  variant?: "compact" | "detailed"
}

export default function HotelCard({ hotel, source, variant = "compact" }: HotelCardProps) {
  const savings = hotel.originalPrice
    ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
    : 0

  const getSourceBadge = (source: string) => {
    const badges = {
      expedia: { label: "Expedia", color: "bg-blue-500" },
      "hotels.com": { label: "Hotels.com", color: "bg-red-500" },
      "booking.com": { label: "Booking.com", color: "bg-blue-600" },
    }
    return badges[source as keyof typeof badges] || { label: source, color: "bg-gray-500" }
  }

  const sourceBadge = getSourceBadge(source)

  const [imageLoading, setImageLoading] = useState(true)

  const handleViewHotel = () => {
    alert(`Hotel: ${hotel.name} - ${hotel.currency}${hotel.price} per night`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {imageLoading && <Skeleton className="absolute inset-0 z-10" />}

        <OptimizedImage
          src={hotel.image}
          alt={hotel.name}
          width={400}
          height={192}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          fallbackSrc={`/placeholder.svg?height=192&width=400&query=${encodeURIComponent(`${hotel.name} hotel`)}`}
          priority={false}
          onLoad={() => setImageLoading(false)}
        />

        <Badge className={`absolute top-3 left-3 ${sourceBadge.color} text-white border-0 z-20`}>
          {sourceBadge.label}
        </Badge>

        {savings > 0 && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0 z-20">Save {savings}%</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {hotel.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="font-medium">{hotel.rating}</span>
          <span className="text-sm text-gray-500">({hotel.reviewCount} reviews)</span>
        </div>

        {variant === "detailed" && hotel.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{hotel.description}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-baseline gap-2">
              {hotel.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {hotel.currency}
                  {hotel.originalPrice}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">
                {hotel.currency}
                {hotel.price}
              </span>
            </div>
            <p className="text-xs text-gray-500">per night</p>
          </div>

          <Button onClick={handleViewHotel} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
