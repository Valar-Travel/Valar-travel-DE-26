"use client"

import useSWR from "swr"
import { LuxuryPropertyCard } from "@/components/luxury-property-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, MapPin, Filter } from "lucide-react"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LuxuryProperties() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"rating" | "price">("rating")

  const { data, error, isLoading } = useSWR(`/api/luxury-properties?sort=${sortBy}&direct=true`, fetcher)

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Properties</h2>
          <p className="text-gray-600">Please try again later.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading luxury properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent mb-4">
              ✨ Luxury Properties
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exceptional accommodations with ratings over 4.2 stars
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <span className="text-sm text-gray-500">Premium properties only</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{data?.length || 0} luxury properties found</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "rating" | "price")}
                  className="text-sm border rounded-md px-3 py-1 bg-white"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>

              <div className="flex rounded-md border overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && data.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
            }
          >
            {data.map((property: any) => (
              <LuxuryPropertyCard key={property.id} property={property} variant={viewMode === "grid" ? "grid" : "list"} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No luxury properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
