import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
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
  Bed,
  Bath,
  Users,
  ArrowLeft,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VillaImageGallery } from "@/components/villa-image-gallery"
import { PropertyJsonLd } from "@/components/seo/property-json-ld"
import { VillaBookingButton } from "@/components/booking/villa-booking-button"

export const dynamic = "force-dynamic"

const SITE_URL = "https://valartravel.de"

async function getPropertyData(id: string) {
  const supabase = await createClient()

  const { data: property, error } = await supabase.from("scraped_luxury_properties").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching property:", error)
    return null
  }

  return property
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getPropertyData(params.id)

  if (!property) {
    return {
      title: "Property Not Found | Valar Travel",
      description: "The requested luxury property could not be found. Browse our collection of handpicked Caribbean properties.",
    }
  }

  const bedroomText = property.bedrooms ? `${property.bedrooms} bedroom` : ""
  const locationText = property.location || "Caribbean"
  const priceText = property.price_per_night ? `from $${property.price_per_night}/night` : ""
  const amenitiesText = property.amenities?.slice(0, 3).join(", ") || ""

  const description = `${property.name} - ${bedroomText ? `Luxurious ${bedroomText} property in ${locationText}` : `Exclusive luxury property in ${locationText}`}${priceText ? ` ${priceText}` : ""}. ${amenitiesText ? `Features: ${amenitiesText}.` : ""} Book your Caribbean dream escape with Valar Travel's personalized concierge service.`

  return {
    title: `${property.name} | Luxury Property in ${locationText} | Valar Travel`,
    description: description.slice(0, 160),
    keywords: [
      property.name,
      `${locationText} property`,
      "luxury property rental",
      "Caribbean vacation",
      "private villa",
      ...(property.amenities?.slice(0, 5) || []),
    ],
    openGraph: {
      title: `${property.name} | Luxury Property in ${locationText}`,
      description: description.slice(0, 160),
      url: `${SITE_URL}/properties/${params.id}`,
      siteName: "Valar Travel",
      images: property.images?.[0]
        ? [
            {
              url: property.images[0],
              width: 1200,
              height: 630,
              alt: `${property.name} - Luxury property in ${locationText}`,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.name} | Valar Travel`,
      description: description.slice(0, 160),
      images: property.images?.[0] ? [property.images[0]] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/properties/${params.id}`,
    },
  }
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

  const bedrooms = property.bedrooms || null
  const bathrooms = property.bathrooms || null
  const maxGuests = property.max_guests || property.guests || null

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data for SEO */}
      <PropertyJsonLd
        property={{
          id: property.id,
          name: property.name,
          description: property.description,
          location: property.location,
          price_per_night: property.price_per_night,
          currency: property.currency,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          max_guests: maxGuests,
          images: propertyImages,
          amenities: property.amenities,
          rating: property.rating,
        }}
        url={`${SITE_URL}/properties/${property.id}`}
      />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/villas" className="hover:text-foreground transition-colors">
              Properties
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{property.name}</li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 pb-4">
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Properties
        </Link>
      </div>

      <div className="container mx-auto px-4 mb-6 md:mb-8">
        <VillaImageGallery
          images={propertyImages}
          villaName={property.name}
          location={property.location || "Caribbean"}
        />
      </div>

      {(bedrooms || bathrooms || maxGuests) && (
        <div className="container mx-auto px-4 mb-6">
          <div className="flex flex-wrap items-center gap-6 md:gap-8 justify-center md:justify-start p-4 bg-slate-50 rounded-lg border border-slate-200">
            {bedrooms && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Bed className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Bath className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
              </div>
            )}
            {maxGuests && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{maxGuests}</p>
                  <p className="text-sm text-muted-foreground">Sleeps</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property Details */}
      <section className="container mx-auto px-4 py-4 md:py-8">
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
                  {property.price_per_night ? (
                    <VillaBookingButton
                      villa={{
                        id: property.id,
                        name: property.name,
                        location: property.location || "Caribbean",
                        pricePerNight: property.price_per_night,
                        currency: property.currency || "USD",
                        maxGuests: maxGuests || 10,
                        image: propertyImages[0],
                      }}
                      className="w-full bg-green-700 hover:bg-green-800"
                      size="lg"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </VillaBookingButton>
                  ) : property.affiliate_links?.booking ? (
                    <Button className="w-full bg-green-700 hover:bg-green-800" size="lg" asChild>
                      <Link href={property.affiliate_links.booking} target="_blank" rel="noopener noreferrer">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-green-700 hover:bg-green-800" size="lg" asChild>
                      <Link href="/contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        Check Availability
                      </Link>
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
