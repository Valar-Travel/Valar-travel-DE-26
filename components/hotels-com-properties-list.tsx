"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, SortAsc } from "lucide-react"
import HotelsComPropertyCard from "./hotels-com-property-card"

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

interface HotelsComPropertiesListProps {
  destination?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  rooms?: number
  onMapClick?: (coordinates: { lat: number; lng: number }) => void
}

export default function HotelsComPropertiesList({
  destination = "Paris, France",
  checkIn,
  checkOut,
  adults = 2,
  rooms = 1,
  onMapClick,
}: HotelsComPropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("rating")
  const [filters, setFilters] = useState({ luxury: false, hotel: true })

  useEffect(() => {
    fetchProperties()
  }, [destination, checkIn, checkOut, adults, rooms, sortBy, filters])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        destination,
        ...(checkIn && { checkIn }),
        ...(checkOut && { checkOut }),
        adults: adults.toString(),
        rooms: rooms.toString(),
        include: "images,amenities,rates",
      })

      console.log("[v0] Fetching Hotels.com properties with include parameters:", params.get("include"))
      const response = await fetch(`/api/hotels-com/properties?${params}`)
      if (!response.ok) throw new Error("Failed to fetch properties")

      const data = await response.json()

      console.log("[v0] Hotels.com API Response JSON:")
      console.log("[v0] Response keys:", Object.keys(data))
      console.log("[v0] Debug information:", data.debug)
      console.log("[v0] API Provider:", data.apiProvider)
      console.log(
        "[v0] Image URL verification:",
        data.properties?.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          amenityCount: p.amenities?.length || 0,
          hasDiscount: !!p.discount,
          affiliateLink: p.affiliateLink?.substring(0, 50) + "...",
        })),
      )

      setProperties(data.properties)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const handleFilterChange = (filterKey: string, value: boolean) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2">Loading Hotels.com properties...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Error loading properties: {error}</p>
            <Button onClick={fetchProperties} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <img
                src="https://a.travel-assets.com/globalcontrols-service/content/f285fb631b0a976202ef57611c7050e9ef5ca51a/images/hotels_logo_dark.svg"
                alt="Hotels.com"
                className="h-6 mr-3"
              />
              Featured Properties in {destination}
            </CardTitle>
            <Badge variant="secondary">{properties.length} properties found</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="rating">Guest Rating</option>
                <option value="price_low_to_high">Price (Low to High)</option>
                <option value="price_high_to_low">Price (High to Low)</option>
              </select>
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-4">
              <Filter className="w-4 h-4" />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.luxury}
                  onChange={(e) => handleFilterChange("luxury", e.target.checked)}
                />
                Luxury Properties
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.hotel}
                  onChange={(e) => handleFilterChange("hotel", e.target.checked)}
                />
                Hotels Only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <HotelsComPropertyCard key={property.id} property={property} onMapClick={onMapClick} />
        ))}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No properties found matching your criteria.</p>
            <Button onClick={fetchProperties} className="mt-4">
              Refresh Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
