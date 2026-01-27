"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Users,
  ExternalLink,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

interface Property {
  id: string
  name: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  rating: number
  description: string
  images: string[]
  amenities: string[]
  is_published: boolean
  created_at: string
}

interface DestinationStats {
  name: string
  slug: string
  count: number
  avgPrice: number
  minPrice: number
  maxPrice: number
}

const DESTINATIONS = [
  { name: "Barbados", slug: "barbados" },
  { name: "Jamaica", slug: "jamaica" },
  { name: "St. Lucia", slug: "st-lucia", searchTerm: "lucia" },
  { name: "St. Barthelemy", slug: "st-barthelemy", searchTerm: "barth" },
  { name: "St. Maarten", slug: "st-maarten", searchTerm: "maarten" },
  { name: "Antigua", slug: "antigua" },
]

export default function SitemapPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/properties?filter=all")
      const data = await response.json()
      setProperties(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPropertiesByDestination = (destination: { name: string; slug: string; searchTerm?: string }) => {
    const searchTerm = (destination.searchTerm || destination.slug).toLowerCase()
    return properties.filter((p) => p.location?.toLowerCase().includes(searchTerm))
  }

  const destinationStats: DestinationStats[] = DESTINATIONS.map((dest) => {
    const destProperties = getPropertiesByDestination(dest)
    const prices = destProperties.map((p) => p.price_per_night || 0).filter((p) => p > 0)
    return {
      name: dest.name,
      slug: dest.slug,
      count: destProperties.length,
      avgPrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
    }
  })

  const totalProperties = properties.length
  const publishedProperties = properties.filter((p) => p.is_published).length
  const propertiesWithPrice = properties.filter((p) => p.price_per_night && p.price_per_night > 0).length
  const propertiesWithImages = properties.filter((p) => p.images && p.images.length > 0).length

  const filteredProperties = properties.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const exportSitemap = () => {
    const sitemapContent = [
      "URL,Name,Location,Price,Bedrooms,Bathrooms,Published",
      ...properties.map(
        (p) =>
          `https://valartravel.de/villas/${p.id},"${p.name}","${p.location}",${p.price_per_night || 0},${p.bedrooms || 0},${p.bathrooms || 0},${p.is_published ? "Yes" : "No"}`
      ),
    ].join("\n")

    const blob = new Blob([sitemapContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "valar-travel-sitemap.csv"
    a.click()
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Property Sitemap</h1>
            <p className="text-muted-foreground">Overview of all properties across destinations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchProperties} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportSitemap}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-sm text-muted-foreground">Total Properties</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{publishedProperties}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{propertiesWithPrice}</div>
              <p className="text-sm text-muted-foreground">With Price</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{propertiesWithImages}</div>
              <p className="text-sm text-muted-foreground">With Images</p>
            </CardContent>
          </Card>
        </div>

        {/* Destination Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Properties by Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinationStats.map((dest) => (
                <Card key={dest.slug} className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{dest.name}</h3>
                      <Badge variant={dest.count > 0 ? "default" : "secondary"}>{dest.count} villas</Badge>
                    </div>
                    {dest.count > 0 ? (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <DollarSign className="w-3 h-3 inline mr-1" />
                          Avg: ${dest.avgPrice}/night
                        </p>
                        <p>
                          Range: ${dest.minPrice} - ${dest.maxPrice}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No properties yet</p>
                    )}
                    <Link href={`/destinations/${dest.slug}`} className="text-xs text-emerald-600 hover:underline mt-2 block">
                      View destination page
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Properties</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">All ({filteredProperties.length})</TabsTrigger>
                {DESTINATIONS.map((dest) => {
                  const count = getPropertiesByDestination(dest).length
                  return (
                    <TabsTrigger key={dest.slug} value={dest.slug}>
                      {dest.name} ({count})
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <TabsContent value="overview">
                <PropertyTable properties={filteredProperties} />
              </TabsContent>

              {DESTINATIONS.map((dest) => (
                <TabsContent key={dest.slug} value={dest.slug}>
                  <PropertyTable properties={getPropertiesByDestination(dest).filter(
                    (p) =>
                      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.location?.toLowerCase().includes(searchQuery.toLowerCase())
                  )} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}

function PropertyTable({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No properties found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price/Night</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Baths</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{property.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {property.location || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                {property.price_per_night ? (
                  <span className="font-semibold text-emerald-600">${property.price_per_night}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Bed className="w-3 h-3" />
                  {property.bedrooms || "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Bath className="w-3 h-3" />
                  {property.bathrooms || "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {property.max_guests || "-"}
                </div>
              </TableCell>
              <TableCell>{property.images?.length || 0}</TableCell>
              <TableCell>
                {property.is_published ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/villas/${property.id}`} target="_blank">
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
