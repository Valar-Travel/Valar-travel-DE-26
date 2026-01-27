"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  Trash2,
  Search,
  Play,
  Trash,
  RefreshCw,
  Loader2,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"
import { AddPropertyDialog } from "./add-property-dialog"
import { PhotoManager } from "./photo-manager"

interface ScrapedProperty {
  id: string
  name: string
  location: string
  rating: number
  price_per_night?: number
  currency?: string
  description?: string
  amenities: string[]
  images: string[]
  affiliate_links?: any
  source_url?: string
  is_active?: boolean
  is_published?: boolean
  scraped_at?: string
  created_at?: string
  updated_at?: string
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "x-admin-auth": typeof window !== "undefined" ? localStorage.getItem("valar_admin_auth") || "" : "",
    },
  }).then((res) => res.json())

export function PropertiesAdmin() {
  const [filter, setFilter] = useState<"all" | "pending" | "published">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<ScrapedProperty | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [scraperUrl, setScraperUrl] = useState("")
  const [scraperDestination, setScraperDestination] = useState("")
  const [isScraperRunning, setIsScraperRunning] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [scraperProgress, setScraperProgress] = useState("")
  const [scraperDialogOpen, setScraperDialogOpen] = useState(false)
  const [photoManagerOpen, setPhotoManagerOpen] = useState(false)
  const [photoManagerProperty, setPhotoManagerProperty] = useState<ScrapedProperty | null>(null)

  const { data, error, mutate } = useSWR<ScrapedProperty[]>(
    `/api/admin/properties?filter=${filter}&search=${searchQuery}`,
    fetcher,
  )

  const properties = Array.isArray(data) ? data : []
  const isLoading = !data && !error

  const handleApprove = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
        body: JSON.stringify({ is_published: true, is_active: true }),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Failed to approve property")

      toast.success("Property approved and published")
      mutate()
    } catch (error: any) {
      console.error("[v0] Approve error:", error)
      toast.error(error.message || "Failed to approve property")
    }
  }

  const handleReject = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
        body: JSON.stringify({ is_published: false, is_active: false }),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Failed to reject property")

      toast.success("Property rejected")
      mutate()
    } catch (error: any) {
      console.error("[v0] Reject error:", error)
      toast.error(error.message || "Failed to reject property")
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to delete property")
      }

      toast.success("Property deleted")
      mutate()
    } catch (error: any) {
      console.error("[v0] Delete error:", error)
      toast.error(error.message || "Failed to delete property")
    }
  }

  const handleViewDetails = (property: ScrapedProperty) => {
    setSelectedProperty(property)
    setIsDialogOpen(true)
  }

  const handleRunScraper = async () => {
    let trimmedUrl = scraperUrl.trim()

    if (!trimmedUrl) {
      toast.error("Please enter a URL")
      return
    }

    // Check for double https:// or corrupted URLs
    const httpsCount = (trimmedUrl.match(/https?:\/\//g) || []).length
    if (httpsCount > 1) {
      toast.error("Invalid URL detected", {
        description: "The URL appears to be corrupted (contains multiple http/https). Please paste a clean URL.",
        duration: 6000,
      })
      return
    }

    // Validate URL format
    try {
      const urlObj = new URL(trimmedUrl)
      // Ensure the URL is properly formed
      if (!urlObj.hostname || urlObj.hostname.length < 4) {
        throw new Error("Invalid hostname")
      }
      // Use the cleaned URL
      trimmedUrl = urlObj.href
    } catch {
      toast.error("Invalid URL format", {
        description: "Please enter a valid URL (e.g., https://example.com/properties)",
        duration: 6000,
      })
      return
    }

    if (!scraperDestination) {
      toast.error("Please select a destination for these properties")
      return
    }

    setIsScraperRunning(true)
    setScraperProgress("Connecting to website...")

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
        body: JSON.stringify({
          url: trimmedUrl,
          maxProperties: 50,
          destination: scraperDestination,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.blocked) {
          toast.error("Website Blocked", {
            description: data.error,
            duration: 10000,
          })
        } else {
          toast.error(data.error || "Failed to scrape properties")
        }
        return
      }

      if (data.count === 0) {
        toast.warning("No properties found", {
          description: "Try a different URL or check if the page has property listings.",
          duration: 6000,
        })
        return
      }

      toast.success(`Successfully scraped ${data.count} properties!`)
      setScraperDialogOpen(false)
      setScraperUrl("")
      setScraperDestination("")
      mutate()
    } catch (error: any) {
      toast.error("Scraper failed", {
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsScraperRunning(false)
      setScraperProgress("")
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${properties.length} properties? This cannot be undone!`)) return
    if (!confirm("This will permanently delete all properties from the database. Are you absolutely sure?")) return

    setIsDeletingAll(true)

    try {
      const response = await fetch("/api/admin/properties", {
        method: "DELETE",
        headers: {
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to delete all properties")
      }

      toast.success("All properties deleted successfully")
      mutate()
    } catch (error: any) {
      console.error("[v0] Delete all error:", error)
      toast.error(error.message || "Failed to delete all properties")
    } finally {
      setIsDeletingAll(false)
    }
  }

  const handleManagePhotos = (property: ScrapedProperty) => {
    setPhotoManagerProperty(property)
    setPhotoManagerOpen(true)
  }

  const pendingCount = properties.filter((p) => !p.is_published).length
  const publishedCount = properties.filter((p) => p.is_published).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Scraper Control Button */}
      <Card>
        <CardHeader>
          <CardTitle>Property Scraper</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Automatically scrape and import luxury properties from external websites
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => mutate()} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {properties.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteAll} disabled={isDeletingAll} size="sm">
                  <Trash className="h-4 w-4 mr-2" />
                  {isDeletingAll ? "Deleting..." : `Delete All (${properties.length})`}
                </Button>
              )}
              <AddPropertyDialog onSuccess={() => mutate()} />
              <Dialog open={scraperDialogOpen} onOpenChange={setScraperDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run Scraper
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Run Property Scraper</DialogTitle>
                    <DialogDescription>
                      Enter the URL of a property listing page or individual property to scrape
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scraper-url">Property URL</Label>
                      <Input
                        id="scraper-url"
                        type="text"
                        placeholder="https://sunnyvillaholidays.com/properties/villa-name/"
                        value={scraperUrl}
                        onChange={(e) => setScraperUrl(e.target.value)}
                        disabled={isScraperRunning}
                        className="mt-1.5"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <Label htmlFor="scraper-destination">Destination (Required)</Label>
                      <Select
                        value={scraperDestination}
                        onValueChange={setScraperDestination}
                        disabled={isScraperRunning}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select destination..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Barbados">Barbados</SelectItem>
                          <SelectItem value="Jamaica">Jamaica</SelectItem>
                          <SelectItem value="St. Lucia">St. Lucia</SelectItem>
                          <SelectItem value="St. Barthélemy">St. Barthélemy</SelectItem>
                          <SelectItem value="St. Maarten">St. Maarten</SelectItem>
                          <SelectItem value="Antigua">Antigua</SelectItem>
                          <SelectItem value="Anguilla">Anguilla</SelectItem>
                          <SelectItem value="Turks and Caicos">Turks and Caicos</SelectItem>
                          <SelectItem value="Grenada">Grenada</SelectItem>
                          <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-2">
                      <p className="font-medium">Recommended websites:</p>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        <li>sunnyvillaholidays.com</li>
                        <li>villasbarbados.com</li>
                        <li>exceptionvillas.com</li>
                        <li>caribbeanway.com</li>
                      </ul>
                      <p className="text-orange-600 mt-3">
                        Note: Cloudflare-protected sites (like isleblue.co) cannot be scraped.
                      </p>
                    </div>

                    {isScraperRunning && scraperProgress && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{scraperProgress}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setScraperDialogOpen(false)}
                        disabled={isScraperRunning}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleRunScraper}
                        disabled={isScraperRunning || !scraperUrl.trim() || !scraperDestination}
                      >
                        {isScraperRunning ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Scraping
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Properties List */}
      {isLoading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No properties found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {property.images && property.images.length > 0 && (
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/luxury-villa.png"
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-balance">{property.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {property.location}
                          {property.rating && ` • ${property.rating} rating`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {property.is_published ? (
                          <Badge variant="default" className="bg-green-600">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      {property.price_per_night && (
                        <span className="font-semibold text-foreground">
                          ${property.price_per_night}/{property.currency || "USD"} per night
                        </span>
                      )}
                      {property.images && <span>{property.images.length} images</span>}
                      {property.amenities && <span>{property.amenities.length} amenities</span>}
                    </div>

                    {property.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{property.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(property)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => handleManagePhotos(property)}>
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Photos ({property.images?.length || 0})
                      </Button>

                      {property.source_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(property.source_url, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Source
                        </Button>
                      )}

                      {!property.is_published && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(property.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}

                      {!property.is_published && (
                        <Button size="sm" variant="destructive" onClick={() => handleReject(property.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}

                      <Button size="sm" variant="ghost" onClick={() => handleDelete(property.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Property Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProperty.name}</DialogTitle>
                <DialogDescription>{selectedProperty.location}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Images - using images array */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.images.slice(0, 6).map((img, idx) => (
                      <img
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt={`${selectedProperty.name} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/luxury-villa.png"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Location</Label>
                    <p>{selectedProperty.location}</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <p>{selectedProperty.rating || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Price per Night</Label>
                    <p>{selectedProperty.price_per_night ? `$${selectedProperty.price_per_night}` : "N/A"}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p>{selectedProperty.is_published ? "Published" : "Pending"}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedProperty.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedProperty.description}</p>
                  </div>
                )}

                {/* Amenities */}
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div>
                    <Label>Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Info */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground space-y-1">
                    {selectedProperty.source_url && <p>Source: {new URL(selectedProperty.source_url).hostname}</p>}
                    {selectedProperty.scraped_at && (
                      <p>Scraped: {new Date(selectedProperty.scraped_at).toLocaleDateString()}</p>
                    )}
                    {selectedProperty.updated_at && (
                      <p>Last Updated: {new Date(selectedProperty.updated_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Manager */}
      {photoManagerProperty && (
        <PhotoManager
          propertyId={photoManagerProperty.id}
          propertyName={photoManagerProperty.name}
          images={photoManagerProperty.images || []}
          open={photoManagerOpen}
          onOpenChange={setPhotoManagerOpen}
          onUpdate={() => mutate()}
        />
      )}
    </div>
  )
}
