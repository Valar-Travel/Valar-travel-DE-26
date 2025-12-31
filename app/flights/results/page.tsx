"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plane } from "lucide-react"
import Link from "next/link"
import { FlightCard } from "@/components/flight-card"
import { FlightFilters, type FlightFilters as FlightFiltersType } from "@/components/flight-filters"
import { FlightSearchForm, type FlightSearchData } from "@/components/flight-search-form"

interface Flight {
  id: string
  price: number
  originalPrice?: number
  currency: string
  outbound: any[]
  return?: any[]
  totalDuration: string
  stops: number
  baggage: {
    carry: string
    checked: string
  }
  amenities: string[]
  affiliateLink: string
  bookingClass: string
  refundable: boolean
  changeable: boolean
}

function FlightResultsContent() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const tripType = (searchParams.get("tripType") as "one-way" | "round-trip") || "round-trip"
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const departDate = searchParams.get("departDate") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const flightClass = searchParams.get("class") || "economy"

  const [filters, setFilters] = useState<FlightFiltersType>({
    priceRange: [0, 5000],
    airlines: [],
    stops: [],
    departureTime: [],
    arrivalTime: [],
    duration: [0, 24],
    bookingClass: [],
    amenities: [],
    sortBy: "price",
    sortOrder: "asc",
  })

  useEffect(() => {
    fetchFlights()
  }, [from, to, departDate, returnDate, passengers, flightClass, tripType])

  const fetchFlights = async () => {
    if (!from || !to || !departDate) {
      setError("Missing required search parameters")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const endpoint =
        tripType === "round-trip" ? "/api/expedia/flights/search-round-trip" : "/api/expedia/flights/search-one-way"

      const params = new URLSearchParams({
        from,
        to,
        departDate,
        passengers: passengers.toString(),
        class: flightClass,
      })

      if (tripType === "round-trip" && returnDate) {
        params.append("returnDate", returnDate)
      }

      const response = await fetch(`${endpoint}?${params}`)
      const data = await response.json()

      if (data.success && Array.isArray(data.flights)) {
        setFlights(data.flights)
      } else {
        setError(data.error || "Failed to fetch flights")
        setFlights([])
      }
    } catch (err) {
      setError("Network error occurred")
      setFlights([])
      console.error("Error fetching flights:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (searchData: FlightSearchData) => {
    const params = new URLSearchParams()
    params.set("tripType", searchData.tripType)
    params.set("from", searchData.from)
    params.set("to", searchData.to)
    params.set("departDate", searchData.departDate?.toISOString() || "")
    if (searchData.returnDate) {
      params.set("returnDate", searchData.returnDate.toISOString())
    }
    params.set("passengers", searchData.passengers.toString())
    params.set("class", searchData.class)

    router.push(`/flights/results?${params.toString()}`)
  }

  const handleFiltersChange = (newFilters: FlightFiltersType) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      airlines: [],
      stops: [],
      departureTime: [],
      arrivalTime: [],
      duration: [0, 24],
      bookingClass: [],
      amenities: [],
      sortBy: "price",
      sortOrder: "asc",
    })
  }

  // Apply filters and sorting
  const filteredAndSortedFlights = flights
    .filter((flight) => {
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false
      if (filters.stops.length > 0) {
        const stopsFilter =
          (filters.stops.includes("Direct") && flight.stops === 0) ||
          (filters.stops.includes("1 stop") && flight.stops === 1) ||
          (filters.stops.includes("2+ stops") && flight.stops >= 2)
        if (!stopsFilter) return false
      }
      if (filters.bookingClass.length > 0 && !filters.bookingClass.includes(flight.bookingClass)) return false
      return true
    })
    .sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1
      switch (filters.sortBy) {
        case "price":
          return (a.price - b.price) * order
        case "duration":
          const aDuration = Number.parseInt(a.totalDuration.replace(/[^\d]/g, ""))
          const bDuration = Number.parseInt(b.totalDuration.replace(/[^\d]/g, ""))
          return (aDuration - bDuration) * order
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <section className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FlightSearchForm onSearch={handleNewSearch} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Plane className="w-6 h-6" />
                  {from} → {to}
                </h1>
                <p className="text-muted-foreground">
                  {tripType === "round-trip" ? "Round trip" : "One way"} • {passengers} passenger
                  {passengers > 1 ? "s" : ""} • {flightClass}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FlightFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                isOpen={filtersOpen}
                onToggle={() => setFiltersOpen(!filtersOpen)}
                resultsCount={filteredAndSortedFlights.length}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching for flights...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Error: {error}</p>
                  <Button onClick={fetchFlights} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}

              {!loading && !error && filteredAndSortedFlights.length === 0 && (
                <div className="text-center py-12">
                  <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              )}

              {!loading && !error && filteredAndSortedFlights.length > 0 && (
                <div className="space-y-4">
                  {filteredAndSortedFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} tripType={tripType} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function FlightResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading flight search...</p>
          </div>
        </div>
      }
    >
      <FlightResultsContent />
    </Suspense>
  )
}
