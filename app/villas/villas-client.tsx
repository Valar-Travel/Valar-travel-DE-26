"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Bed, Bath, Users, Search, Star, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { DynamicImage } from "@/components/dynamic-image"

interface Villa {
  id: string
  name: string
  location: string
  bedrooms: number
  bathrooms: number
  guests: number
  price: number
  image_url: string
  images: string[]
  amenities: string[]
  rating: number
  description: string
}

export default function VillasClientPage() {
  const searchParams = useSearchParams()
  const [villas, setVillas] = useState<Villa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [bedrooms, setBedrooms] = useState("all")
  const [destination, setDestination] = useState(searchParams?.get("destination") || "all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const params = new URLSearchParams({ maxResults: "200" })
        if (destination && destination !== "all") {
          params.set("location", destination)
        }

        const response = await fetch(`/api/luxury-properties?${params.toString()}`)
        if (response.ok) {
          const result = await response.json()
          const properties = Array.isArray(result) ? result : result.data || []

          const mappedVillas = properties.map((prop: any) => ({
            id: prop.id,
            name: prop.name || "Luxury Villa",
            location: prop.location || "Caribbean",
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
            guests: prop.max_guests || 0,
            price: prop.price_per_night || 0,
            image_url: prop.images?.[0] || "",
            images: prop.images || [],
            amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
            rating: prop.rating || 0,
            description: prop.description || "",
          }))

          setVillas(mappedVillas)
        }
      } catch (error) {
        console.error("Error fetching villas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVillas()
  }, [destination])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (destination && destination !== "all") {
      url.searchParams.set("destination", destination)
    } else {
      url.searchParams.delete("destination")
    }
    window.history.replaceState({}, "", url.toString())
  }, [destination])

  const filteredAndSortedVillas = useMemo(() => {
    let filtered = [...villas]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (villa) =>
          villa.name.toLowerCase().includes(query) ||
          villa.location.toLowerCase().includes(query) ||
          villa.description?.toLowerCase().includes(query) ||
          villa.amenities.some((amenity: string) => amenity.toLowerCase().includes(query)),
      )
    }

    if (bedrooms !== "all") {
      filtered = filtered.filter((villa) => villa.bedrooms >= Number.parseInt(bedrooms))
    }

    filtered = filtered.filter((villa) => villa.price >= priceRange[0] && villa.price <= priceRange[1])

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price || b.rating - a.rating)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price || b.rating - a.rating)
        break
      case "bedrooms":
        filtered.sort((a, b) => b.bedrooms - a.bedrooms || b.rating - a.rating)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "featured":
      default:
        filtered.sort((a, b) => {
          const scoreA = (a.rating || 0) * 10 - Math.log10(a.price || 1)
          const scoreB = (b.rating || 0) * 10 - Math.log10(b.price || 1)
          return scoreB - scoreA
        })
        break
    }

    return filtered
  }, [villas, searchQuery, bedrooms, priceRange, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setBedrooms("all")
    setDestination("all")
    setPriceRange([0, 10000])
    setSortBy("featured")
  }

  const hasActiveFilters =
    searchQuery !== "" || bedrooms !== "all" || destination !== "all" || priceRange[0] > 0 || priceRange[1] < 10000

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Luxury Caribbean Villas</h1>
          <p className="text-emerald-100/80 text-lg max-w-2xl">
            Discover handpicked luxury villas across the Caribbean's most exclusive destinations
          </p>
        </div>
      </section>

      <section className="py-6 bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="barbados">Barbados</SelectItem>
                <SelectItem value="jamaica">Jamaica</SelectItem>
                <SelectItem value="st-lucia">St. Lucia</SelectItem>
                <SelectItem value="st-barthelemy">St. Barthélemy</SelectItem>
                <SelectItem value="st-maarten">St. Maarten</SelectItem>
                <SelectItem value="antigua">Antigua</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Beds</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-sm font-medium whitespace-nowrap">Price:</span>
              <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="w-32" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                ${priceRange[0]}-${priceRange[1]}
              </span>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="lg:hidden gap-2 bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t space-y-4">
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="barbados">Barbados</SelectItem>
                  <SelectItem value="jamaica">Jamaica</SelectItem>
                  <SelectItem value="st-lucia">St. Lucia</SelectItem>
                  <SelectItem value="st-barthelemy">St. Barthélemy</SelectItem>
                  <SelectItem value="st-maarten">St. Maarten</SelectItem>
                  <SelectItem value="antigua">Antigua</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Bedrooms</SelectItem>
                  <SelectItem value="1">1+ Bedrooms</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                  <SelectItem value="5">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {loading
                ? "Loading..."
                : `${filteredAndSortedVillas.length} ${filteredAndSortedVillas.length === 1 ? "Villa" : "Villas"} Found`}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-5 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAndSortedVillas.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Villas Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {villas.length === 0
                  ? "No properties have been added yet. Use the admin panel to add or scrape properties."
                  : "No villas match your current filters. Try adjusting your search criteria."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedVillas.map((villa) => (
                <Card
                  key={villa.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md"
                >
                  <Link href={`/villas/${villa.id}`}>
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <DynamicImage
                        src={villa.images.length > 0 ? villa.images : villa.image_url}
                        alt={`${villa.name} - Luxury villa in ${villa.location}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        propertyType="villa"
                        enableGallery={villa.images.length > 1}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {villa.rating > 0 && (
                        <Badge className="absolute top-4 right-4 bg-white/95 text-foreground shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {villa.rating.toFixed(1)}
                        </Badge>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-semibold text-white line-clamp-1 drop-shadow-lg">{villa.name}</h3>
                        <div className="flex items-center text-white/90 text-sm mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {villa.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {villa.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{villa.bedrooms}</span>
                        </div>
                      )}
                      {villa.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{villa.bathrooms}</span>
                        </div>
                      )}
                      {villa.guests > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{villa.guests}</span>
                        </div>
                      )}
                    </div>

                    {villa.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {villa.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {villa.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{villa.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        {villa.price > 0 ? (
                          <>
                            <span className="text-2xl font-bold text-emerald-600">${villa.price}</span>
                            <span className="text-muted-foreground text-sm">/night</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Contact for pricing</span>
                        )}
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href={`/villas/${villa.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
