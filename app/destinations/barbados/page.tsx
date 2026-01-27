import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Bed, Bath, Users, Waves, Palmtree, UtensilsCrossed } from "lucide-react"
import { UNSPLASH_IMAGES, getImageUrl } from "@/lib/unsplash-images"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Luxury Villas in Barbados | Beachfront & Private Pool Rentals | Valar Travel",
  description:
    "Discover 30+ exclusive luxury villa rentals in Barbados. Pristine beaches, private pools, chef service & concierge. Book Sandy Lane, West Coast & South Coast villas.",
  keywords: [
    "Barbados luxury villas",
    "Barbados villa rentals",
    "Sandy Lane villas",
    "Barbados beachfront villa",
    "private pool villa Barbados",
    "Caribbean luxury vacation",
  ],
  openGraph: {
    title: "Luxury Villas in Barbados | Valar Travel",
    description: "Handpicked luxury villas in Barbados with private pools, beach access & concierge service.",
    url: "https://valartravel.de/destinations/barbados",
  },
  alternates: {
    canonical: "https://valartravel.de/destinations/barbados",
  },
}

async function getBarbadosProperties() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .ilike("location", "%barbados%")
      .limit(12)

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export default async function BarbadosPage() {
  const scrapedProperties = await getBarbadosProperties()

  const villas = scrapedProperties.map((prop) => ({
    id: prop.id,
    name: prop.name,
    price: prop.price_per_night || 1200,
    bedrooms: prop.bedrooms || 4,
    bathrooms: prop.bathrooms || 3,
    guests: prop.max_guests || (prop.bedrooms || 4) * 2,
    image: prop.images?.[0] || getImageUrl(UNSPLASH_IMAGES.barbados.villa1, 800),
    features: prop.amenities?.slice(0, 4) || ["Ocean View", "Private Pool", "WiFi", "Beach Access"],
    description: prop.description || "",
  }))

  const highlights = [
    {
      icon: Waves,
      title: "Pristine Beaches",
      description: "Crystal-clear turquoise waters and powder-soft white sand beaches",
    },
    {
      icon: Palmtree,
      title: "Tropical Paradise",
      description: "Lush landscapes and year-round perfect weather",
    },
    {
      icon: UtensilsCrossed,
      title: "World-Class Dining",
      description: "From beach shacks to Michelin-starred restaurants",
    },
    {
      icon: Star,
      title: "British Elegance",
      description: "Colonial charm meets Caribbean hospitality",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src={getImageUrl(UNSPLASH_IMAGES.barbados.hero, 1920) || "/placeholder.svg"}
          alt={UNSPLASH_IMAGES.barbados.hero.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Caribbean Paradise</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Luxury Villas in Barbados</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-pretty">
              Experience the perfect blend of British elegance and Caribbean charm in your private villa paradise
            </p>
          </div>
        </div>
      </section>

      {/* Destination Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Choose Barbados?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Barbados, the jewel of the Caribbean, offers an unparalleled luxury villa experience. Known for its
              pristine beaches, world-class golf courses, and vibrant culture, this island paradise combines British
              colonial heritage with warm Caribbean hospitality. From the calm west coast beaches perfect for swimming
              to the dramatic east coast surf, Barbados provides the ideal backdrop for your luxury getaway.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <highlight.icon className="w-10 h-10 text-emerald-700 mb-3" />
                    <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Villas */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-balance">Featured Barbados Villas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Handpicked luxury properties with stunning ocean views and world-class amenities
            </p>
          </div>

          {villas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                We're currently updating our Barbados property listings.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Contact us for available properties</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((villa) => (
                <Card key={villa.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <Link href={`/villas/${villa.id}`}>
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={villa.image || "/placeholder.svg"}
                        alt={villa.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        Barbados
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-700 transition-colors">
                        {villa.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {villa.bedrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {villa.bathrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {villa.guests}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {villa.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-emerald-700">${villa.price}</span>
                          <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-700 group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/villas?destination=barbados">View All Barbados Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Things to Do in Barbados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Beach & Water Activities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Snorkeling with sea turtles at Carlisle Bay</li>
                  <li>• Surfing on the east coast at Bathsheba</li>
                  <li>• Catamaran cruises along the west coast</li>
                  <li>• Swimming in the calm waters of Paynes Bay</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Culture & Dining</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Visit historic plantation houses</li>
                  <li>• Explore Bridgetown's UNESCO World Heritage sites</li>
                  <li>• Dine at world-class restaurants in Holetown</li>
                  <li>• Experience Friday night fish fry at Oistins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">Caribbean Paradise</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Ready to Experience <span className="font-semibold italic">Barbados</span>
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Book your luxury villa in Barbados today and create unforgettable Caribbean memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-900 hover:bg-amber-50 rounded-none px-8 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/villas?destination=barbados">Browse Villas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-900 bg-transparent rounded-none px-8 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
