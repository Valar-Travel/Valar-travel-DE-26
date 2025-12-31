"use client"

import { useEffect, useState } from "react"
import HotelCard from "./hotel-card"
import { Skeleton } from "@/components/ui/skeleton"

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
  affiliateLink: string
  description?: string
}

interface HotelListProps {
  destination: string
  source: "expedia" | "hotels.com" | "booking.com" | "agoda"
  apiEndpoint: string
  variant?: "compact" | "detailed"
}

export default function HotelList({ destination, source, apiEndpoint, variant = "compact" }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiEndpoint}?destination=${encodeURIComponent(destination)}`)
        const data = await response.json()

        if (data.success || data.properties) {
          const hotelData = data.properties || data.hotels || []
          setHotels(hotelData)
        } else {
          setError("Failed to fetch hotels")
        }
      } catch (err) {
        setError("Network error occurred")
        console.error("Error fetching hotels:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [destination, apiEndpoint])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-end">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel: Hotel) => (
        <HotelCard key={hotel.id} source={source} hotel={hotel} variant={variant} />
      ))}
    </div>
  )
}
