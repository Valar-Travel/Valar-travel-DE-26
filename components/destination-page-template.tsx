"use client"

import { useEffect, useState } from "react"
import { DynamicImage } from "@/components/dynamic-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

interface Property {
  id: string
  name: string
  image?: string
  thumbnail?: string
  location?: {
    city?: string
  }
  city?: string
  address?: string
  rating?: number
  reviews?: number
  review_count?: number
  price_display?: string
  price?: string
  originalPrice?: number
  amenities?: string[]
}

interface DestinationPageProps {
  destination: string
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  apiEndpoint: string
}

export default function DestinationPageTemplate({
  destination,
  heroImage,
  heroTitle,
  heroSubtitle,
  apiEndpoint,
}: DestinationPageProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const apiUrl = `${apiEndpoint}?destination=${encodeURIComponent(destination)}&limit=50`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`)
        const data = await res.json()

        if (data.success && data.properties) {
          setProperties(data.properties)
        } else if (Array.isArray(data)) {
          setProperties(data)
        } else {
          setProperties([])
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [apiEndpoint, destination])

  if (loading) return <div className="p-8">Loading properties…</div>
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <DynamicImage
          src={heroImage}
          alt={`${destination} cityscape`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">{heroTitle}</h1>
            <p className="text-xl md:text-2xl opacity-90 text-pretty">{heroSubtitle}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Top Hotels & Properties in {destination}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((p, i) => (
            <article
              key={p.id || i}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                <DynamicImage
                  src={p.image || p.thumbnail || "/placeholder-400x300.png"}
                  alt={p.name || "Property"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {p.originalPrice && p.price_display && (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    Save ${p.originalPrice - Number.parseInt(p.price_display.replace(/[^0-9]/g, ""))}
                  </Badge>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-lg truncate" title={p.name}>
                  {p.name || "Unnamed Property"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.location?.city || p.city || p.address || destination}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {p.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${
                                idx < Math.floor(p.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{p.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">({p.reviews || p.review_count || 0})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">From</div>
                    <div className="text-base font-bold">{p.price_display || p.price || "—"}</div>
                  </div>
                </div>

                {p.amenities && p.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.amenities.slice(0, 2).map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {p.amenities.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{p.amenities.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <Button className="w-full" onClick={() => window.open(`/property/${p.id || i}`, "_blank")}>
                    View Details
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No properties found for {destination}</p>
            <p className="text-gray-400">Try checking back later for new listings.</p>
          </div>
        )}
      </main>
    </div>
  )
}
