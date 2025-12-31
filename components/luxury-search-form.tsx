"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Search, Crown, Filter, MapPin, Users, Star, Sparkles } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface LuxurySearchFilters {
  destination: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  rooms: number
  priceRange: [number, number]
  minStarRating: number
  propertyTypes: string[]
  amenities: string[]
  luxuryOnly: boolean
  sortBy: string
}

interface LuxurySearchFormProps {
  onSearch: (filters: LuxurySearchFilters) => void
  className?: string
}

const luxuryAmenities = [
  "Spa",
  "Pool",
  "Concierge",
  "Butler Service",
  "Michelin Restaurant",
  "Private Beach",
  "Valet Parking",
  "Champagne Bar",
  "Fitness Center",
  "Business Center",
  "Room Service",
  "Airport Transfer",
]

const propertyTypes = [
  { value: "luxury_hotel", label: "Luxury Hotels" },
  { value: "boutique", label: "Boutique Hotels" },
  { value: "villa", label: "Private Villas" },
  { value: "resort", label: "Luxury Resorts" },
  { value: "suite", label: "Executive Suites" },
]

const popularDestinations = [
  "Barbados",
  "St. Lucia",
  "Jamaica",
  "St. Barthélemy",
  "Turks and Caicos",
  "Antigua and Barbuda",
  "Cayman Islands",
  "Grenada",
]

export function LuxurySearchForm({ onSearch, className }: LuxurySearchFormProps) {
  const [filters, setFilters] = useState<LuxurySearchFilters>({
    destination: "",
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    rooms: 1,
    priceRange: [300, 2000],
    minStarRating: 4,
    propertyTypes: [],
    amenities: [],
    luxuryOnly: true,
    sortBy: "rating",
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([])

  const updateFilter = <K extends keyof LuxurySearchFilters>(key: K, value: LuxurySearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "propertyTypes" | "amenities", value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const handleDestinationChange = (value: string) => {
    updateFilter("destination", value)
    if (value.length > 2) {
      const suggestions = popularDestinations.filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))
      setDestinationSuggestions(suggestions)
    } else {
      setDestinationSuggestions([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!filters.destination || !filters.checkIn || !filters.checkOut) return
    onSearch(filters)
  }

  const activeFiltersCount =
    (filters.propertyTypes.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.minStarRating > 4 ? 1 : 0) +
    (filters.priceRange[0] > 300 || filters.priceRange[1] < 2000 ? 1 : 0)

  return (
    <Card
      className={cn(
        "w-full max-w-6xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-amber-50/30",
        className,
      )}
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Crown className="w-6 h-6 text-amber-600" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Luxury Property Search
          </span>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            Premium Collection
          </Badge>
        </CardTitle>
        <p className="text-amber-700/80 text-sm">
          Discover exceptional luxury accommodations with personalized service and world-class amenities
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Search Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination
              </Label>
              <div className="relative">
                <Input
                  id="destination"
                  placeholder="Where would you like to stay?"
                  value={filters.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="text-base h-12"
                />
                {destinationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                    {destinationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        onClick={() => {
                          updateFilter("destination", suggestion)
                          setDestinationSuggestions([])
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label>Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !filters.checkIn && "text-slate-700",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.checkIn ? format(filters.checkIn) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.checkIn}
                    onSelect={(date) => updateFilter("checkIn", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !filters.checkOut && "text-slate-700",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.checkOut ? format(filters.checkOut) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.checkOut}
                    onSelect={(date) => updateFilter("checkOut", date)}
                    disabled={(date) => date < (filters.checkIn || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Guests and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Adults
              </Label>
              <Select
                value={filters.adults.toString()}
                onValueChange={(value) => updateFilter("adults", Number.parseInt(value))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Adult" : "Adults"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rooms</Label>
              <Select
                value={filters.rooms.toString()}
                onValueChange={(value) => updateFilter("rooms", Number.parseInt(value))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Room" : "Rooms"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Minimum Rating
              </Label>
              <Select
                value={filters.minStarRating.toString()}
                onValueChange={(value) => updateFilter("minStarRating", Number.parseInt(value))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Checkbox
                id="luxury-only"
                checked={filters.luxuryOnly}
                onCheckedChange={(checked) => updateFilter("luxuryOnly", checked as boolean)}
              />
              <Label htmlFor="luxury-only" className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Luxury Properties Only
              </Label>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <Card className="bg-gray-50/50 border-gray-200">
              <CardContent className="p-6 space-y-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Price Range (per night)</Label>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                      max={5000}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}+</span>
                    </div>
                  </div>
                </div>

                {/* Property Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Property Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {propertyTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={filters.propertyTypes.includes(type.value)}
                          onCheckedChange={() => toggleArrayFilter("propertyTypes", type.value)}
                        />
                        <Label htmlFor={type.value} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Luxury Amenities */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Luxury Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {luxuryAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={() => toggleArrayFilter("amenities", amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sort Results By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="luxury_score">Luxury Score</SelectItem>
                      <SelectItem value="reviews">Most Reviewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              className="px-12 h-14 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
            >
              <Search className="w-5 h-5 mr-3" />
              Search Luxury Properties
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
