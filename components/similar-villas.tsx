import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Users, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface SimilarVillasProps {
  currentVillaId: string
  location?: string
  limit?: number
}

export async function SimilarVillas({ currentVillaId, location, limit = 3 }: SimilarVillasProps) {
  const supabase = await createClient()

  // Try to fetch similar villas from same location first, then fill with others
  let similarVillas: any[] = []

  try {
    if (location) {
      // First, try to get villas from the same location
      const { data: sameLocationVillas } = await supabase
        .from("scraped_luxury_properties")
        .select("id, name, location, bedrooms, bathrooms, max_guests, price_per_night, currency, images")
        .neq("id", currentVillaId)
        .ilike("location", `%${location}%`)
        .limit(limit)

      if (sameLocationVillas && sameLocationVillas.length > 0) {
        similarVillas = sameLocationVillas
      }
    }

    // If not enough villas from same location, get more from other locations
    if (similarVillas.length < limit) {
      const existingIds = similarVillas.map((v) => v.id)
      existingIds.push(currentVillaId)

      const { data: otherVillas } = await supabase
        .from("scraped_luxury_properties")
        .select("id, name, location, bedrooms, bathrooms, max_guests, price_per_night, currency, images")
        .not("id", "in", `(${existingIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(limit - similarVillas.length)

      if (otherVillas) {
        similarVillas = [...similarVillas, ...otherVillas]
      }
    }
  } catch (error) {
    console.error("[SimilarVillas] Error fetching villas:", error)
    return null
  }

  if (similarVillas.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          {location ? `More Villas in ${location}` : "You May Also Like"}
        </h2>
        <Link
          href="/villas"
          className="text-emerald-700 hover:text-emerald-800 text-sm font-medium inline-flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarVillas.map((villa) => {
          const image = villa.images?.[0] || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(villa.name)}`
          const currency = villa.currency === "USD" ? "$" : villa.currency === "EUR" ? "€" : "£"

          return (
            <Link key={villa.id} href={`/villas/${villa.id}`} className="group">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={`${villa.name} - Luxury villa in ${villa.location || "Caribbean"}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {villa.location && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-xs">
                      {villa.location}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {villa.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {villa.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {villa.bedrooms}
                      </span>
                    )}
                    {villa.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {villa.bathrooms}
                      </span>
                    )}
                    {villa.max_guests && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {villa.max_guests}
                      </span>
                    )}
                  </div>

                  {villa.price_per_night > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-lg font-bold text-emerald-700">
                        {currency}
                        {villa.price_per_night.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground"> /night</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
