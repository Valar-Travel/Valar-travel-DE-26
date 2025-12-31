import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  Wifi,
  Waves,
  UtensilsCrossed,
  Car,
  Wind,
  Dumbbell,
  Sparkles,
  Calendar,
  MessageSquare,
  Home,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Property Details | Valar Travel",
  description: "Explore luxury property details, amenities, and book your Caribbean getaway.",
}

async function getPropertyData(id: string) {
  const supabase = await createClient()

  const { data: property, error } = await supabase.from("scraped_luxury_properties").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching property:", error)
    return null
  }

  return property
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyData(params.id)

  if (!property) {
    notFound()
  }

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    "High-Speed WiFi": Wifi,
    Pool: Waves,
    "Private Pool": Waves,
    "Chef Service": UtensilsCrossed,
    Parking: Car,
    "Air Conditioning": Wind,
    "Fitness Center": Dumbbell,
    Gym: Dumbbell,
    Housekeeping: Sparkles,
    "Beach Access": Waves,
    "Golf Access": Dumbbell,
    "Spa Services": Sparkles,
  }

  const amenitiesWithIcons = (property.amenities || []).map((amenity: string) => ({
    icon: amenityIcons[amenity] || Sparkles,
    label: amenity,
  }))

  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : [
          `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(property.name + " luxury villa")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " bedroom")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " kitchen")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " outdoor")}`,
        ]

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] md:row-span-2">
            <Image
              src={propertyImages[0] || "/placeholder.svg"}
              alt={property.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          {propertyImages.slice(1, 4).map((image: string, idx: number) => (
            <div key={idx} className="relative aspect-[4/3]">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${property.name} ${idx + 2}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Property Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                {property.location}
              </div>
              <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
              <div className="flex items-center gap-6 text-lg flex-wrap">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-muted-foreground" />
                  <span>Luxury Property</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{property.rating}</span>
                </div>
                <span className="text-muted-foreground">(Verified rating)</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "Luxury Caribbean property with stunning views and world-class amenities."}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            {amenitiesWithIcons.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesWithIcons.map((amenity: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <amenity.icon className="w-5 h-5 text-green-700" />
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Source Link */}
            {property.source_url && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">View more details about this property</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={property.source_url} target="_blank" rel="noopener noreferrer">
                    View Original Listing
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                {property.price_per_night ? (
                  <>
                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-green-700">${property.price_per_night}</span>
                        <span className="text-muted-foreground">/ night</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {property.currency || "USD"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base rate (7 nights)</span>
                        <span className="font-medium">${(property.price_per_night * 7).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span className="font-medium">$350</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>${(property.price_per_night * 7 + 350).toLocaleString()}</span>
                      </div>
                    </div>

                    <Separator />
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Contact us for pricing and availability</p>
                  </div>
                )}

                <div className="space-y-4">
                  {property.affiliate_links?.booking ? (
                    <Button className="w-full bg-green-700 hover:bg-green-800" size="lg" asChild>
                      <Link href={property.affiliate_links.booking} target="_blank" rel="noopener noreferrer">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-green-700 hover:bg-green-800" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Check Availability
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                    <Link href="/contact">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                  <p className="font-medium mb-2">What's Included:</p>
                  <ul className="space-y-1">
                    <li>• 24/7 concierge service</li>
                    <li>• Welcome amenities</li>
                    <li>• Pool & beach towels</li>
                    <li>• Property management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">More Luxury Properties</h2>
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations/barbados">View More Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
