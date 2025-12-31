"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, SlidersHorizontal } from "lucide-react"

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

interface AccommodationFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}

const amenityOptions = [
  "wifi",
  "pool",
  "gym",
  "spa",
  "restaurant",
  "kitchen",
  "garden",
  "parking",
  "beach_access",
  "airport_shuttle",
  "pet_friendly",
  "business_center",
]

const cancellationOptions = [
  { value: "flexible", label: "Flexible" },
  { value: "moderate", label: "Moderate" },
  { value: "strict", label: "Strict" },
  { value: "super_strict", label: "Super Strict" },
]

const propertyTypeOptions = [
  { value: "hotel", label: "Hotel" },
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "resort", label: "Resort" },
  { value: "boutique", label: "Boutique Hotel" },
]

const sortOptions = [
  { value: "price", label: "Price" },
  { value: "star_rating", label: "Star Rating" },
  { value: "review_score", label: "Review Score" },
  { value: "review_count", label: "Number of Reviews" },
]

export default function AccommodationFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: AccommodationFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    updateFilter("amenities", newAmenities)
  }

  const toggleArrayFilter = (key: "cancellationPolicy" | "propertyType", value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const activeFiltersCount =
    (filters.starRating.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.cancellationPolicy.length > 0 ? 1 : 0) +
    (filters.propertyType.length > 0 ? 1 : 0) +
    (filters.reviewScore > 0 ? 1 : 0) +
    (filters.guestCapacity > 2 ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onToggle} className="flex items-center gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters & Sorting</span>
          <span className="sm:hidden">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Sort By */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <SlidersHorizontal className="h-4 w-4" />
                Sort By
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") => updateFilter("sortOrder", value)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Low to High</SelectItem>
                    <SelectItem value="desc">High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm sm:text-base">Price Range</h3>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                  max={2000}
                  min={50}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-1">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm sm:text-base">Star Rating</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.starRating.includes(rating) ? "default" : "outline"}
                    size="sm"
                    className="min-w-[44px] h-10 sm:h-9"
                    onClick={() => {
                      const newRatings = filters.starRating.includes(rating)
                        ? filters.starRating.filter((r) => r !== rating)
                        : [...filters.starRating, rating]
                      updateFilter("starRating", newRatings)
                    }}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>

            {/* Review Score */}
            <div className="space-y-3">
              <h3 className="font-semibold">Minimum Review Score</h3>
              <div className="px-2">
                <Slider
                  value={[filters.reviewScore]}
                  onValueChange={(value) => updateFilter("reviewScore", value[0])}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground mt-1">{filters.reviewScore}/10 and above</div>
              </div>
            </div>

            {/* Guest Capacity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Guest Capacity</h3>
              <div className="px-2">
                <Slider
                  value={[filters.guestCapacity]}
                  onValueChange={(value) => updateFilter("guestCapacity", value[0])}
                  max={12}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground mt-1">{filters.guestCapacity} guests minimum</div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm sm:text-base">Property Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {propertyTypeOptions.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2 min-h-[44px] sm:min-h-auto">
                    <Checkbox
                      id={type.value}
                      checked={filters.propertyType.includes(type.value)}
                      onCheckedChange={() => toggleArrayFilter("propertyType", type.value)}
                      className="min-w-[20px] min-h-[20px]"
                    />
                    <label htmlFor={type.value} className="text-sm cursor-pointer flex-1">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="space-y-3">
              <h3 className="font-semibold">Cancellation Policy</h3>
              <div className="grid grid-cols-2 gap-2">
                {cancellationOptions.map((policy) => (
                  <div key={policy.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={policy.value}
                      checked={filters.cancellationPolicy.includes(policy.value)}
                      onCheckedChange={() => toggleArrayFilter("cancellationPolicy", policy.value)}
                    />
                    <label htmlFor={policy.value} className="text-sm capitalize">
                      {policy.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h3 className="font-semibold">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm capitalize">
                      {amenity.replace("_", " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
