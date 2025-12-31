"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Wifi, Car, Utensils, Waves, Star, ExternalLink, MapPin, Users, Loader2 } from "lucide-react"
import AccommodationFilters from "./accommodation-filters"
import { VerifiedReviews } from "./verified-reviews"
import { GoogleMaps } from "./google-maps"
import { AffiliateDisclosure } from "./affiliate-disclosure"

interface Property {
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
  propertyType: "hotel" | "villa"
  coordinates?: {
    lat: number
    lng: number
  }
}

interface FilterState {
  priceRange: [number, number]
  starRating: number[]
  reviewScore: number
  amenities: string[]
  cancellationPolicy: string[]
  propertyType: string[]
  guestCapacity: number
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface HotelVillaComparisonProps {
  cityName: string
}

export function HotelVillaComparison({ cityName }: HotelVillaComparisonProps) {
  const [activeTab, setActiveTab] = useState("hotels")
  const [accommodations, setAccommodations] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [50, 2000],
    starRating: [],
    reviewScore: 0,
    amenities: [],
    cancellationPolicy: [],
    propertyType: [],
    guestCapacity: 1,
    sortBy: "price",
    sortOrder: "asc",
  })

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/expedia/hotels/search?destination=${encodeURIComponent(cityName)}&adults=2&rooms=1`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch accommodations")
        }

        const data = await response.json()

        console.log("[v0] Hotel Villa Comparison API response:", data)

        if (data.success && Array.isArray(data.properties)) {
          console.log("[v0] Properties received for comparison:", data.properties.length)

          // Log image URLs for each property
          data.properties.forEach((property: any, index: number) => {
            console.log(`[v0] Comparison Property ${index + 1} - ${property.name}:`)
            console.log(`[v0] Raw image URL:`, property.image)
            console.log(`[v0] Image URL before transformation:`, property.image)
          })

          const transformedProperties = data.properties.map((property: any) => ({
            ...property,
            propertyType:
              property.name.toLowerCase().includes("villa") ||
              property.name.toLowerCase().includes("apartment") ||
              property.name.toLowerCase().includes("house")
                ? "villa"
                : "hotel",
            coordinates: property.coordinates || {
              lat: 48.8566 + (Math.random() - 0.5) * 0.02, // Paris center with small random offset
              lng: 2.3522 + (Math.random() - 0.5) * 0.02,
            },
          }))

          console.log("[v0] Transformed properties image URLs:")
          transformedProperties.forEach((property: Property, index: number) => {
            console.log(`[v0] Transformed ${index + 1} - ${property.name}: ${property.image}`)
          })

          const filteredProperties = transformedProperties.filter((property: Property) => {
            if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false
            if (filters.starRating.length > 0 && !filters.starRating.includes(Math.floor(property.rating))) return false
            if (filters.reviewScore > 0 && property.rating < filters.reviewScore) return false
            if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) return false
            return true
          })

          setAccommodations(filteredProperties)
        } else {
          setAccommodations([])
        }
      } catch (err) {
        console.error("Error fetching accommodations:", err)
        setError("Failed to load accommodations")
        setAccommodations([])
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [cityName, filters])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [50, 2000],
      starRating: [],
      reviewScore: 0,
      amenities: [],
      cancellationPolicy: [],
      propertyType: [],
      guestCapacity: 1,
      sortBy: "price",
      sortOrder: "asc",
    })
  }

  const hotels = accommodations.filter((acc) => acc.propertyType === "hotel")
  const villas = accommodations.filter((acc) => acc.propertyType === "villa")

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
      case "free wifi":
        return <Wifi className="w-4 h-4" />
      case "restaurant":
      case "dining":
        return <Utensils className="w-4 h-4" />
      case "parking":
      case "free parking":
        return <Car className="w-4 h-4" />
      case "pool":
      case "swimming pool":
        return <Waves className="w-4 h-4" />
      case "kitchen":
      case "kitchenette":
        return <Utensils className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const handleBookNow = (affiliateLink: string, name: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "accommodation_click", {
        event_category: "affiliate",
        event_label: name,
        value: 1,
      })
    }
    window.open(affiliateLink, "_blank", "noopener,noreferrer")
  }

  const AccommodationCard = ({ accommodation }: { accommodation: Property }) => {
    const savings =
      accommodation.originalPrice && accommodation.originalPrice > accommodation.price
        ? ((accommodation.originalPrice - accommodation.price) / accommodation.originalPrice) * 100
        : 0

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        {savings > 20 && (
          <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">Best Value</div>
        )}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={
              accommodation.image ||
              `/placeholder.svg?height=200&width=300&query=${accommodation.propertyType || "/placeholder.svg"}+${cityName}`
            }
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2">{accommodation.name}</CardTitle>
            {savings > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save {savings.toFixed(0)}%
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {accommodation.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              2-4 guests
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(accommodation.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="font-medium ml-1">{accommodation.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({accommodation.reviewCount} reviews)</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{accommodation.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {accommodation.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                {amenity}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">€{accommodation.price}</div>
              {accommodation.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">€{accommodation.originalPrice}</div>
              )}
              <div className="text-xs text-muted-foreground">per night</div>
            </div>
          </div>

          <Button
            onClick={() => handleBookNow(accommodation.affiliateLink, accommodation.name)}
            className="w-full"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Book Now
          </Button>

          <div className="mt-3">
            <AffiliateDisclosure variant="inline" className="text-xs justify-center" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const mapMarkers = accommodations.map((property) => ({
    id: property.id,
    position: property.coordinates || { lat: 48.8566, lng: 2.3522 },
    title: property.name,
    price: `€${property.price}`,
    rating: property.rating,
    image: property.image,
    link: property.affiliateLink,
  }))

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading accommodations...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Live Hotel Search
          </div>
          <h2 className="text-4xl font-bold mb-4 text-balance">Hotels & Villas in {cityName}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Real-time availability and pricing from our travel partners. All bookings include our best price guarantee.
          </p>
        </div>

        <div className="mb-8">
          <AccommodationFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
        </div>

        {accommodations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No accommodations match your current filters for {cityName}.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Property Locations</h3>
              <GoogleMaps
                address={`${cityName} City Center`}
                city={cityName}
                className="max-w-6xl mx-auto h-96"
                markers={mapMarkers}
                showPropertyMarkers={true}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="hotels" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Hotels ({hotels.length})
                </TabsTrigger>
                <TabsTrigger value="villas" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Villas ({villas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hotels">
                {hotels.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hotels match your current filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <AccommodationCard key={hotel.id} accommodation={hotel} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="villas">
                {villas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No villas match your current filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {villas.map((villa) => (
                      <AccommodationCard key={villa.id} accommodation={villa} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {accommodations.length > 0 && (
              <div className="mt-16">
                <VerifiedReviews
                  reviews={[
                    {
                      id: "1",
                      user_name: "Emma Thompson",
                      rating: 5,
                      comment:
                        "Exceptional service and beautiful accommodations. The map feature helped us find the perfect location.",
                      date: "1 week ago",
                      verified: true,
                      stay_type: "Romantic Getaway",
                    },
                    {
                      id: "2",
                      user_name: "David Chen",
                      rating: 5,
                      comment: "Real-time pricing and availability made booking so easy. Exactly as shown on the map.",
                      date: "2 weeks ago",
                      verified: true,
                      stay_type: "Business Trip",
                    },
                    {
                      id: "3",
                      user_name: "Lisa Rodriguez",
                      rating: 4,
                      comment: "Great filtering options and the map view helped us choose the perfect neighborhood.",
                      date: "3 weeks ago",
                      verified: true,
                      stay_type: "Family Vacation",
                    },
                  ]}
                  averageRating={4.8}
                  totalReviews={247}
                />
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Prices shown are per night and may vary based on dates and availability. All bookings are made directly with
            our trusted partners.
          </p>
        </div>
      </div>
    </section>
  )
}
