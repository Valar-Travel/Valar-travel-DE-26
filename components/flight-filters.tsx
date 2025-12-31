"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Plane, Clock, DollarSign } from "lucide-react"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

export interface FlightFilters {
  priceRange: [number, number]
  airlines: string[]
  stops: string[]
  departureTime: string[]
  arrivalTime: string[]
  duration: [number, number]
  bookingClass: string[]
  amenities: string[]
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface FlightFiltersProps {
  filters: FlightFilters
  onFiltersChange: (filters: FlightFilters) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
  resultsCount: number
}

export function FlightFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  resultsCount,
}: FlightFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (key: keyof FlightFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = (key: keyof FlightFilters, value: string) => {
    const currentArray = localFilters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const activeFiltersCount =
    (localFilters.airlines.length > 0 ? 1 : 0) +
    (localFilters.stops.length > 0 ? 1 : 0) +
    (localFilters.departureTime.length > 0 ? 1 : 0) +
    (localFilters.arrivalTime.length > 0 ? 1 : 0) +
    (localFilters.bookingClass.length > 0 ? 1 : 0) +
    (localFilters.amenities.length > 0 ? 1 : 0) +
    (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 5000 ? 1 : 0) +
    (localFilters.duration[0] > 0 || localFilters.duration[1] < 24 ? 1 : 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{resultsCount} flights</span>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {isOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Sort Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort by</Label>
              <div className="flex gap-2">
                <Select value={localFilters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure Time</SelectItem>
                    <SelectItem value="arrival">Arrival Time</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.sortOrder}
                  onValueChange={(value: "asc" | "desc") => updateFilter("sortOrder", value)}
                >
                  <SelectTrigger className="w-24">
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
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price Range
              </Label>
              <div className="px-2">
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                  max={5000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>${localFilters.priceRange[0]}</span>
                  <span>${localFilters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Airlines */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Airlines
              </Label>
              <div className="space-y-2">
                {["American Airlines", "Delta", "United", "Southwest", "JetBlue", "Alaska"].map((airline) => (
                  <div key={airline} className="flex items-center space-x-2">
                    <Checkbox
                      id={airline}
                      checked={localFilters.airlines.includes(airline)}
                      onCheckedChange={() => toggleArrayFilter("airlines", airline)}
                    />
                    <Label htmlFor={airline} className="text-sm font-normal">
                      {airline}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Stops</Label>
              <div className="space-y-2">
                {["Direct", "1 stop", "2+ stops"].map((stop) => (
                  <div key={stop} className="flex items-center space-x-2">
                    <Checkbox
                      id={stop}
                      checked={localFilters.stops.includes(stop)}
                      onCheckedChange={() => toggleArrayFilter("stops", stop)}
                    />
                    <Label htmlFor={stop} className="text-sm font-normal">
                      {stop}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Flight Duration (hours)
              </Label>
              <div className="px-2">
                <Slider
                  value={localFilters.duration}
                  onValueChange={(value) => updateFilter("duration", value as [number, number])}
                  max={24}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{localFilters.duration[0]}h</span>
                  <span>{localFilters.duration[1]}h</span>
                </div>
              </div>
            </div>

            {/* Departure Time */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Departure Time</Label>
              <div className="space-y-2">
                {["Early morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)", "Night (12AM-6AM)"].map(
                  (time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={localFilters.departureTime.includes(time)}
                        onCheckedChange={() => toggleArrayFilter("departureTime", time)}
                      />
                      <Label htmlFor={time} className="text-sm font-normal">
                        {time}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Booking Class */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Class</Label>
              <div className="space-y-2">
                {["Economy", "Premium Economy", "Business", "First"].map((bookingClass) => (
                  <div key={bookingClass} className="flex items-center space-x-2">
                    <Checkbox
                      id={bookingClass}
                      checked={localFilters.bookingClass.includes(bookingClass)}
                      onCheckedChange={() => toggleArrayFilter("bookingClass", bookingClass)}
                    />
                    <Label htmlFor={bookingClass} className="text-sm font-normal">
                      {bookingClass}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={onClearFilters} className="w-full bg-transparent">
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
