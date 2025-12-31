"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, ExternalLink } from "lucide-react"
import Image from "next/image"

interface Property {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  reviewText: string
  price: number
  originalPrice: number
  currency: string
  nights: number
  pricePerNight: number
  discount?: string
  dates: string
  image: string
  coordinates: { lat: number; lng: number }
  amenities: string[]
  affiliateLink: string
  fullyRefundable: boolean
  reserveNowPayLater: boolean
}

interface HotelsComPropertyCardProps {
  property: Property
  onMapClick?: (coordinates: { lat: number; lng: number }) => void
}

export default function HotelsComPropertyCard({ property, onMapClick }: HotelsComPropertyCardProps) {
  const [imageError, setImageError] = useState(false)

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("wifi")) return <Wifi className="w-4 h-4" />
    if (amenity.toLowerCase().includes("restaurant")) return <Utensils className="w-4 h-4" />
    if (amenity.toLowerCase().includes("fitness") || amenity.toLowerCase().includes("gym"))
      return <Dumbbell className="w-4 h-4" />
    if (amenity.toLowerCase().includes("parking")) return <Car className="w-4 h-4" />
    return null
  }

  const handleBookNow = () => {
    window.open(property.affiliateLink, "_blank", "noopener,noreferrer")
  }

  const handleViewOnMap = () => {
    if (onMapClick) {
      onMapClick(property.coordinates)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Property Image */}
        <div className="relative w-full md:w-80 h-48 md:h-auto">
          <Image
            src={imageError ? "/placeholder.svg?height=200&width=300&query=hotel" : property.image}
            alt={property.name}
            fill
            className="object-cover"
          />
          {property.discount && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">{property.discount}</Badge>
          )}
        </div>

        {/* Property Details */}
        <CardContent className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center bg-green-100 px-2 py-1 rounded">
              <span className="text-green-800 font-semibold mr-1">{property.rating}</span>
              <Star className="w-4 h-4 text-green-600 fill-current" />
            </div>
          </div>

          {/* Review Info */}
          <div className="flex items-center mb-3">
            <Badge variant="secondary" className="mr-2">
              {property.reviewText}
            </Badge>
            <span className="text-sm text-gray-600">{property.reviewCount} reviews</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Booking Options */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.fullyRefundable && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Fully refundable
              </Badge>
            )}
            {property.reserveNowPayLater && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Reserve now, pay later
              </Badge>
            )}
          </div>

          {/* Dates */}
          <p className="text-sm text-gray-600 mb-4">{property.dates}</p>

          {/* Price and Actions */}
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-baseline">
                {property.originalPrice > property.price && (
                  <span className="text-sm text-gray-500 line-through mr-2">
                    {property.currency}
                    {property.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  {property.currency}
                  {property.price}
                </span>
              </div>
              <p className="text-sm text-gray-600">for {property.nights} nights, 1 room</p>
              <p className="text-xs text-gray-500">
                {property.currency}
                {property.pricePerNight} per night
              </p>
              <p className="text-xs text-gray-500">includes taxes & fees</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleViewOnMap} variant="outline" size="sm" className="w-full bg-transparent">
                <MapPin className="w-4 h-4 mr-1" />
                View on Map
              </Button>
              <Button onClick={handleBookNow} className="bg-red-600 hover:bg-red-700 text-white w-full">
                Book Now
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
