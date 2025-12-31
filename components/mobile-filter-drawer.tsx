"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Filter, SlidersHorizontal } from "lucide-react"
import AccommodationFilters from "./accommodation-filters"

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

interface MobileFilterDrawerProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  resultsCount?: number
}

export function MobileFilterDrawer({
  filters,
  onFiltersChange,
  onClearFilters,
  resultsCount,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeFiltersCount =
    (filters.starRating.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.cancellationPolicy.length > 0 ? 1 : 0) +
    (filters.propertyType.length > 0 ? 1 : 0) +
    (filters.reviewScore > 0 ? 1 : 0) +
    (filters.guestCapacity > 2 ? 1 : 0)

  return (
    <div className="sm:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 w-full bg-transparent">
            <Filter className="h-4 w-4" />
            Filters & Sort
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters & Sorting
              </span>
              {resultsCount && <span className="text-sm text-muted-foreground">{resultsCount} results</span>}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <AccommodationFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClearFilters={onClearFilters}
              isOpen={true}
              onToggle={() => {}}
            />

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClearFilters} className="flex-1 bg-transparent">
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
