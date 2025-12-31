import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
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
  Sparkles,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Shield,
  Award,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const CONTACT_PHONE = "+49 160 92527436"
const WHATSAPP_LINK = "https://wa.me/4916092527436"
const CONTACT_EMAIL = "sarah@valartravel.de"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug)

  if (!property) {
    return {
      title: "Property Not Found | Valar Travel",
    }
  }

  return {
    title: `${property.name} - Luxury Villa in ${property.region}, Barbados | Valar Travel`,
    description:
      property.description ||
      `Discover ${property.name}, a luxury villa in ${property.location}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, sleeps ${property.max_guests} guests. From $${property.price_per_night}/night.`,
  }
}

async function getPropertyBySlug(slug: string) {
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from("scraped_luxury_properties")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    console.error("[v0] Error fetching property:", error)
    return null
  }

  return property
}

export default async function BarbadosVillaPage({ params }: Props) {
  const property = await getPropertyBySlug(params.slug)

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
    Housekeeping: Sparkles,
    "Beach Access": Waves,
  }

  const amenitiesWithIcons = (property.amenities || []).map((amenity: string) => ({
    icon: amenityIcons[amenity] || Sparkles,
    label: amenity,
  }))

  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : [`/placeholder.svg?height=600&width=800&query=${encodeURIComponent(property.name + " luxury villa barbados")}`]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Link
          href="/destinations/barbados"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Barbados Villas</span>
        </Link>
      </div>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 pb-8">
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
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="uppercase tracking-widest text-sm font-medium">{property.location}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{property.name}</h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-emerald-600" />
                  {property.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-emerald-600" />
                  {property.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Sleeps {property.max_guests}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Badge
                  variant="secondary"
                  className="gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border-amber-200 font-medium"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {property.rating || 4.8}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </Badge>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Description - Better typography */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-5 tracking-tight">About This Villa</h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  {(property.description || "")
                    .split(/\n\n|\n/)
                    .filter((p: string) => p.trim())
                    .map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-base md:text-lg leading-7 md:leading-8 text-pretty">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Amenities - Cleaner grid */}
            {amenitiesWithIcons.length > 0 && (
              <>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-5 tracking-tight">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {amenitiesWithIcons.map((amenity: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                          <amenity.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="bg-border/40" />
              </>
            )}

            {/* Why Book Section - Simplified */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-5 tracking-tight">Why Book With Valar Travel</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Best Price Guarantee</p>
                    <p className="text-xs text-muted-foreground mt-0.5">We match any competitor price</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Personalized Service</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Dedicated concierge support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Cleaner compact design */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg border-emerald-100 overflow-hidden">
              <div className="bg-emerald-600 px-4 py-2.5">
                <p className="text-white text-sm font-medium text-center">Exclusive Rates Available</p>
              </div>
              <CardContent className="p-5 space-y-5">
                <div className="text-center py-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">From</p>
                  <p className="text-4xl font-bold text-emerald-700">${property.price_per_night?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>

                <Separator />

                <div className="space-y-2.5">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold" asChild>
                    <a
                      href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hi Sarah, I'm interested in ${property.name} in Barbados. Can you help me with availability?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full h-11 bg-transparent" asChild>
                    <Link href="/contact">
                      <Calendar className="w-4 h-4 mr-2" />
                      Check Availability
                    </Link>
                  </Button>
                </div>

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

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
                  <Clock className="w-3 h-3" />
                  <span>Usually responds within 1 hour</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* More Villas CTA */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore More Barbados Villas</h2>
          <Button asChild variant="outline" size="lg">
            <Link href="/destinations/barbados">View All Properties</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
