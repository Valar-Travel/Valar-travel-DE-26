import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Star,
  Bed,
  Bath,
  Users,
  Wifi,
  Waves,
  UtensilsCrossed,
  Car,
  Wind,
  Dumbbell,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Phone,
  Tv,
  Utensils,
  Coffee,
  Flame,
  Lock,
  Mountain,
  TreePalm,
  Umbrella,
  Gamepad2,
  Music,
  Baby,
  Dog,
  Shirt,
  Fan,
  Sun,
  Mail,
  Shield,
  Award,
  Clock,
  Headphones,
  CalendarDays,
  Info,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VillaImageGallery } from "@/components/villa-image-gallery"
import { InternalLinks, destinationLinks } from "@/components/internal-links"
import { VillaBookingButton } from "@/components/booking/villa-booking-button"
import { PropertyJsonLd } from "@/components/seo/property-json-ld"

const CONTACT_PHONE = "+49 160 92527436"
const WHATSAPP_LINK = "https://wa.me/4916092527436"
const CONTACT_EMAIL = "hello@valartravel.de"
const SITE_URL = "https://valartravel.de"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyData(id)

  if (!property) {
    return {
      title: "Property Not Found | Valar Travel",
      description:
        "The requested luxury property could not be found. Browse our collection of handpicked Caribbean properties.",
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
      url: `${SITE_URL}/properties/${id}`,
      siteName: "Valar Travel",
      images: property.images?.[0]
        ? [
            {
              url: property.images[0],
              width: 1200,
              height: 630,
              alt: `${property.name} - Luxury property exterior view in ${locationText}`,
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
      canonical: `${SITE_URL}/properties/${id}`,
    },
  }
}

async function getPropertyData(id: string) {
  const supabase = await createClient()

  // 1. Try to find by UUID in scraped_luxury_properties
  if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    const { data: scrapedProperty } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (scrapedProperty) {
      return scrapedProperty
    }
  }

  // 2. Try to find by slug in scraped_luxury_properties
  const { data: propertyBySlug } = await supabase
    .from("scraped_luxury_properties")
    .select("*")
    .ilike("name", `%${id.replace(/-/g, " ")}%`)
    .maybeSingle()

  if (propertyBySlug) return propertyBySlug

  // 3. Try villas table by slug
  const { data: villaFromVillas } = await supabase.from("villas").select("*").eq("slug", id).maybeSingle()

  if (villaFromVillas) return villaFromVillas

  // 4. Try by numeric ID in villas table
  if (!isNaN(Number(id))) {
    const { data: villaById } = await supabase.from("villas").select("*").eq("id", Number(id)).maybeSingle()

    if (villaById) return villaById
  }

  return null
}

function extractAmenitiesFromDescription(description: string): string[] {
  const amenityKeywords = [
    // Pool & Water
    { keywords: ["pool", "swimming pool", "infinity pool", "plunge pool"], label: "Private Pool" },
    { keywords: ["jacuzzi", "hot tub", "whirlpool"], label: "Jacuzzi/Hot Tub" },
    { keywords: ["beach access", "beach club", "beachfront"], label: "Beach Access" },

    // Climate & Comfort
    { keywords: ["air conditioning", "a/c", "ac", "air-conditioning", "climate control"], label: "Air Conditioning" },
    { keywords: ["ceiling fan", "fans"], label: "Ceiling Fans" },
    { keywords: ["heating", "heated"], label: "Heating" },

    // Kitchen & Dining
    {
      keywords: ["full kitchen", "fully equipped kitchen", "gourmet kitchen", "modern kitchen"],
      label: "Full Kitchen",
    },
    { keywords: ["chef", "private chef", "chef service"], label: "Private Chef Available" },
    { keywords: ["bbq", "barbecue", "grill"], label: "BBQ/Grill" },
    { keywords: ["dishwasher"], label: "Dishwasher" },
    { keywords: ["coffee maker", "espresso", "nespresso"], label: "Coffee Maker" },

    // Entertainment
    { keywords: ["wifi", "wi-fi", "internet", "high-speed internet"], label: "High-Speed WiFi" },
    { keywords: ["tv", "television", "smart tv", "cable tv", "satellite"], label: "Smart TV" },
    { keywords: ["sound system", "sonos", "bluetooth speaker"], label: "Sound System" },
    { keywords: ["game room", "games", "billiards", "pool table"], label: "Game Room" },
    { keywords: ["home theater", "cinema", "movie room"], label: "Home Theater" },

    // Outdoor & Views
    { keywords: ["ocean view", "sea view", "water view", "oceanfront"], label: "Ocean View" },
    { keywords: ["garden", "tropical garden", "landscaped"], label: "Tropical Garden" },
    { keywords: ["terrace", "patio", "deck", "balcony", "veranda"], label: "Outdoor Terrace" },
    { keywords: ["gazebo", "pergola"], label: "Gazebo" },
    { keywords: ["sun lounger", "sun bed", "loungers"], label: "Sun Loungers" },

    // Services
    { keywords: ["housekeeping", "daily housekeeping", "maid service", "cleaning"], label: "Daily Housekeeping" },
    { keywords: ["concierge", "butler"], label: "Concierge Service" },
    { keywords: ["laundry", "washer", "dryer", "washing machine"], label: "Laundry Facilities" },
    { keywords: ["spa", "massage", "wellness"], label: "Spa Services" },

    // Sports & Fitness
    { keywords: ["gym", "fitness", "exercise", "workout"], label: "Fitness Center" },
    { keywords: ["tennis", "tennis court"], label: "Tennis Court" },
    { keywords: ["golf", "golf course", "golf access"], label: "Golf Access" },
    { keywords: ["kayak", "paddleboard", "water sports"], label: "Water Sports Equipment" },

    // Safety & Security
    { keywords: ["security", "alarm", "gated", "safe"], label: "Security System" },
    { keywords: ["parking", "garage", "car park"], label: "Private Parking" },

    // Family & Pets
    { keywords: ["child", "kids", "family friendly", "crib", "high chair"], label: "Family Friendly" },
    { keywords: ["pet friendly", "pets allowed", "dog friendly"], label: "Pet Friendly" },
  ]

  const foundAmenities: string[] = []
  const lowerDescription = description.toLowerCase()

  for (const amenity of amenityKeywords) {
    if (amenity.keywords.some((keyword) => lowerDescription.includes(keyword))) {
      if (!foundAmenities.includes(amenity.label)) {
        foundAmenities.push(amenity.label)
      }
    }
  }

  return foundAmenities
}

function getSeasonalPricing(basePrice: number, currency: string) {
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"

  return [
    {
      season: "Peak Season",
      dates: "Dec 15 - Apr 15",
      description: "Christmas, New Year & Winter Escape",
      price: Math.round(basePrice * 1.4),
      priceFormatted: `${currencySymbol}${Math.round(basePrice * 1.4).toLocaleString()}`,
      highlight: true,
      badge: "Most Popular",
    },
    {
      season: "Festive Season",
      dates: "Dec 20 - Jan 5",
      description: "Christmas & New Year Celebrations",
      price: Math.round(basePrice * 1.75),
      priceFormatted: `${currencySymbol}${Math.round(basePrice * 1.75).toLocaleString()}`,
      highlight: false,
      badge: "Premium",
    },
    {
      season: "High Season",
      dates: "Apr 16 - Jun 14 & Nov 1 - Dec 14",
      description: "Spring & Early Winter",
      price: Math.round(basePrice * 1.15),
      priceFormatted: `${currencySymbol}${Math.round(basePrice * 1.15).toLocaleString()}`,
      highlight: false,
      badge: null,
    },
    {
      season: "Summer Season",
      dates: "Jun 15 - Aug 31",
      description: "Family Vacation Period",
      price: basePrice,
      priceFormatted: `${currencySymbol}${basePrice.toLocaleString()}`,
      highlight: false,
      badge: "Best Value",
    },
    {
      season: "Low Season",
      dates: "Sep 1 - Oct 31",
      description: "Tranquil & Budget-Friendly",
      price: Math.round(basePrice * 0.85),
      priceFormatted: `${currencySymbol}${Math.round(basePrice * 0.85).toLocaleString()}`,
      highlight: false,
      badge: "Save 15%",
    },
  ]
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyData(id)

  if (!property) {
    notFound()
  }

  const amenityIcons: Record<string, any> = {
    // Pool & Water
    "Private Pool": Waves,
    Pool: Waves,
    "Jacuzzi/Hot Tub": Waves,
    "Beach Access": Umbrella,
    "Water Sports Equipment": Waves,

    // Climate
    "Air Conditioning": Wind,
    "Ceiling Fans": Fan,
    Heating: Flame,

    // Kitchen
    "Full Kitchen": Utensils,
    "Private Chef Available": UtensilsCrossed,
    "BBQ/Grill": Flame,
    Dishwasher: Sparkles,
    "Coffee Maker": Coffee,

    // Entertainment
    "High-Speed WiFi": Wifi,
    WiFi: Wifi,
    "Smart TV": Tv,
    "Sound System": Music,
    "Game Room": Gamepad2,
    "Home Theater": Tv,

    // Outdoor
    "Ocean View": Mountain,
    "Tropical Garden": TreePalm,
    "Outdoor Terrace": Sun,
    Gazebo: TreePalm,
    "Sun Loungers": Sun,

    // Services
    "Daily Housekeeping": Sparkles,
    Housekeeping: Sparkles,
    "Concierge Service": Star,
    "Laundry Facilities": Shirt,
    "Spa Services": Sparkles,

    // Sports
    "Fitness Center": Dumbbell,
    Gym: Dumbbell,
    "Tennis Court": Dumbbell,
    "Golf Access": Dumbbell,

    // Safety
    "Security System": Lock,
    "Private Parking": Car,
    Parking: Car,

    // Family
    "Family Friendly": Baby,
    "Pet Friendly": Dog,
  }

  let amenities = property.amenities || []
  if (Array.isArray(amenities) && amenities.length === 0 && property.description) {
    amenities = extractAmenitiesFromDescription(property.description)
  }

  const amenitiesWithIcons = (Array.isArray(amenities) ? amenities : []).map((amenity: string) => ({
    icon: amenityIcons[amenity] || amenityIcons[amenity?.toLowerCase()] || Sparkles,
    label: amenity,
  }))

  const propertyImages =
    property.images && Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : [
          `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(property.name + " luxury villa exterior")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " bedroom suite")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " modern kitchen")}`,
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(property.name + " pool terrace")}`,
        ]

  const pricePerNight = property.price_per_night || property.price || 0
  const currency = property.currency || "USD"

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
          price_per_night: pricePerNight,
          currency: currency,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          max_guests: maxGuests,
          images: propertyImages,
          amenities: amenities,
          rating: property.rating,
        }}
        url={`${SITE_URL}/properties/${property.id}`}
      />

      {/* Breadcrumb Navigation - SEO */}
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
          {property.location && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/destinations/${property.location.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {property.location}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{property.name}</li>
        </ol>
      </nav>

      {/* Back Link */}
      <div className="container mx-auto px-4 pb-4">
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Properties
        </Link>
      </div>

      {/* Image Gallery - pass location for better alt text */}
      <div className="container mx-auto px-4 mb-6 md:mb-8">
        <VillaImageGallery images={propertyImages} villaName={property.name} location={property.location || "Caribbean"} />
      </div>

      {/* Property Stats - Added directly under images */}
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-4 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-10">
            {/* Header - Cleaner typography */}
            <div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                <span className="uppercase tracking-widest font-medium">{property.location || "Caribbean"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-balance leading-tight tracking-tight">
                {property.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
                <Badge
                  variant="outline"
                  className="gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 font-medium text-xs md:text-sm"
                >
                  <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                  Verified
                </Badge>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Description - Improved readability with better typography */}
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-5 tracking-tight">
                About This Property
              </h2>
              <div className="prose prose-sm md:prose-lg max-w-none">
                <div className="text-muted-foreground leading-relaxed space-y-3 md:space-y-4">
                  {(property.description || "Experience luxury Caribbean living at this stunning property.")
                    .split(/\n\n|\n/)
                    .filter((p: string) => p.trim())
                    .map((paragraph: string, idx: number) => (
                      <p
                        key={idx}
                        className="text-sm md:text-base lg:text-lg leading-6 md:leading-7 lg:leading-8 text-pretty"
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* Amenities - Cleaner grid with better spacing */}
            {amenitiesWithIcons.length > 0 && (
              <>
                <Separator className="bg-border/40" />
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-5 tracking-tight">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {amenitiesWithIcons.map((amenity: { icon: any; label: string }, idx: number) => {
                      const Icon = amenity.icon
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-4 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                          </div>
                          <span className="text-xs md:text-sm font-medium leading-tight">{amenity.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Seasonal Pricing - Cleaner table-like design */}
            {pricePerNight > 0 && (
              <>
                <Separator className="bg-border/40" />
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-5 tracking-tight flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    Seasonal Rates
                  </h2>

                  <div className="mb-3 md:mb-4 p-2.5 md:p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2 md:gap-3">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-amber-800">
                      Rates are per night and may vary. Contact us for a personalized quote.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {getSeasonalPricing(pricePerNight, currency).map((season, idx) => (
                      <div
                        key={idx}
                        className={`p-3 md:p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 ${
                          season.highlight ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">{season.season}</h3>
                            {season.badge && (
                              <Badge
                                variant="secondary"
                                className={`text-[10px] md:text-xs ${
                                  season.badge === "Most Popular"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : season.badge === "Premium"
                                      ? "bg-amber-100 text-amber-700"
                                      : season.badge === "Best Value"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                              >
                                {season.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{season.dates}</p>
                          <p className="text-xs text-muted-foreground hidden sm:block">{season.description}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg md:text-xl font-bold text-emerald-700">{season.priceFormatted}</p>
                          <p className="text-sm text-muted-foreground">per night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Why Book With Us - Simplified benefits section */}
            <Separator className="bg-border/40" />
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-5 tracking-tight">
                Why Book With Valar Travel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  {
                    icon: Award,
                    title: "Best Price Guarantee",
                    desc: "We match any competitor price",
                    color: "emerald",
                  },
                  { icon: Star, title: "Personalized Service", desc: "Dedicated concierge support", color: "amber" },
                  { icon: Shield, title: "Verified Properties", desc: "Personally inspected villas", color: "blue" },
                  { icon: Headphones, title: "24/7 Support", desc: "Always here when you need us", color: "purple" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div
                      className={`w-10 h-10 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Sticky on mobile at bottom */}
          <div className="lg:col-span-1">
            {/* Desktop sidebar */}
            <div className="hidden lg:block sticky top-24">
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-emerald-600 px-4 py-2.5">
                  <p className="text-white text-sm font-medium text-center">Exclusive Rates Available</p>
                </div>

                <CardContent className="p-5 space-y-5">
                  {/* Price Display */}
                  <div className="text-center py-2">
                    {pricePerNight > 0 ? (
                      <>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">From</p>
                        <p className="text-4xl font-bold text-emerald-700">
                          {currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"}
                          {pricePerNight.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">per night</p>
                      </>
                    ) : (
                      <p className="text-xl font-semibold text-emerald-700">Contact for Pricing</p>
                    )}
                  </div>

                  <Separator />

                  {/* Quick Stats */}
                  {(bedrooms || bathrooms || maxGuests) && (
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                      {bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {bedrooms} BR
                        </span>
                      )}
                      {bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          {bathrooms} BA
                        </span>
                      )}
                      {maxGuests && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {maxGuests}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="space-y-2.5">
                    <VillaBookingButton
                      villa={{
                        id: property.id,
                        name: property.name,
                        location: property.location || "Caribbean",
                        pricePerNight: pricePerNight,
                        currency: currency,
                        maxGuests: maxGuests || 10,
                        image: propertyImages[0],
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"
                    >
                      Book Now
                    </VillaBookingButton>
                    <Button
                      variant="outline"
                      className="w-full h-11 bg-transparent"
                      asChild
                    >
                      <a
                        href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Sarah, I'm interested in ${property.name}. Can you help me with availability?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp Us
                      </a>
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t">
                    <p className="text-xs font-semibold text-center mb-3">Contact Sarah Directly</p>
                    <div className="space-y-2">
                      <a
                        href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{CONTACT_PHONE}</span>
                      </a>
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Inquiry: ${property.name}`)}`}
                        className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{CONTACT_EMAIL}</span>
                      </a>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
                    <Clock className="w-3 h-3" />
                    <span>Usually responds within 1 hour</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile sticky booking bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 safe-area-inset-bottom">
              <div className="flex items-center justify-between gap-4">
                <div>
                  {pricePerNight > 0 ? (
                    <>
                      <p className="text-xl font-bold text-emerald-700">
                        {currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}
                        {pricePerNight.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </>
                  ) : (
                    <p className="font-semibold text-emerald-700">Contact for Price</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    asChild
                  >
                    <a href={`tel:${CONTACT_PHONE}`}>
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                  <VillaBookingButton
                    villa={{
                      id: property.id,
                      name: property.name,
                      location: property.location || "Caribbean",
                      pricePerNight: pricePerNight,
                      currency: currency,
                      maxGuests: maxGuests || 10,
                      image: propertyImages[0],
                    }}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                  >
                    Book Now
                  </VillaBookingButton>
                </div>
              </div>
            </div>

            {/* Add bottom padding on mobile to account for sticky bar */}
            <div className="h-24 lg:hidden" />
          </div>
        </div>
      </section>

      {/* Related Destinations - Internal Linking for SEO */}
      <section className="container mx-auto px-4 py-12 border-t">
        <InternalLinks title="Explore More Caribbean Destinations" links={destinationLinks} variant="cards" />
      </section>

      {/* Additional Internal Links */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Looking for something else?</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/villas" className="text-emerald-700 hover:underline">
              Browse All Villas
            </Link>
            <Link href="/contact" className="text-emerald-700 hover:underline">
              Contact Our Concierge
            </Link>
            <Link href="/about" className="text-emerald-700 hover:underline">
              About Valar Travel
            </Link>
            <Link href="/owners" className="text-emerald-700 hover:underline">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
