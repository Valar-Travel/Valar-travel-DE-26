// Antigua Destination Page - Fixed 2026-01-22
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Users, Waves, Anchor, Palmtree, Sailboat } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Luxury Villas in Antigua | 365 Beaches & Historic Charm | Valar Travel",
  description:
    "Discover exclusive luxury villa rentals in Antigua. Famous for 365 beaches, English Harbour, world-class sailing & Caribbean elegance. Book your villa today.",
  keywords: [
    "Antigua luxury villas",
    "Antigua villa rentals",
    "English Harbour villas",
    "Caribbean villa Antigua",
    "Antigua beachfront villa",
    "Jolly Harbour villas",
  ],
  openGraph: {
    title: "Luxury Villas in Antigua | Valar Travel",
    description: "Handpicked luxury villas in Antigua with beach access, private pools & concierge service.",
    url: "https://valartravel.de/destinations/antigua",
  },
  alternates: {
    canonical: "https://valartravel.de/destinations/antigua",
  },
}

async function getAntiguaVillas() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .ilike("location", "%antigua%")
      .limit(12)

    if (error || !data) return []

    return data.map((prop) => ({
      id: prop.id,
      name: prop.name,
      description: prop.description || "",
      price: prop.price_per_night || 800,
      bedrooms: prop.bedrooms || 4,
      bathrooms: prop.bathrooms || 3,
      guests: prop.max_guests || (prop.bedrooms || 4) * 2,
      image: prop.images?.[0] || "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
      features: prop.amenities?.slice(0, 4) || ["Beach Access", "Pool", "Ocean View"],
      rating: prop.rating || 4.5,
      location: prop.location || "Antigua",
    }))
  } catch {
    return []
  }
}

export default async function AntiguaPage() {
  const villas = await getAntiguaVillas()
  
  const highlights = [
    {
      icon: Waves,
      title: "365 Beaches",
      description: "A different beach for every day of the year",
    },
    {
      icon: Anchor,
      title: "English Harbour",
      description: "UNESCO World Heritage historic naval dockyard",
    },
    {
      icon: Sailboat,
      title: "Sailing Capital",
      description: "World-renowned Antigua Sailing Week",
    },
    {
      icon: Palmtree,
      title: "Natural Beauty",
      description: "Lush tropical landscapes and coral reefs",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&q=80"
          alt="Antigua turquoise waters and pristine beaches"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">365 Beaches</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Luxury Villas in Antigua</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-pretty">
              Discover the island with a beach for every day of the year and a rich maritime heritage
            </p>
          </div>
        </div>
      </section>

      {/* Destination Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Choose Antigua?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Antigua, the heart of the Caribbean's Leeward Islands, is famous for its 365 pristine beaches - one for
              every day of the year. This island paradise combines British colonial heritage with natural Caribbean
              beauty. Home to the historic English Harbour and Nelson's Dockyard, Antigua offers a perfect blend of
              history, sailing culture, and luxury living. The island's coral reefs, calm waters, and consistent trade
              winds make it a sailor's paradise and beach lover's dream.
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
            <h2 className="text-4xl font-bold mb-4 text-balance">Featured Antigua Villas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Exquisite properties overlooking pristine Caribbean waters with world-class amenities
            </p>
          </div>

          {villas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No villas available for Antigua yet.</p>
              <Button asChild variant="outline">
                <Link href="/contact">Contact us for available properties</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((villa) => (
                <Card key={villa.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image src={villa.image || "/placeholder.svg"} alt={villa.name} fill className="object-cover" loading="lazy" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      Antigua
                    </div>
                    <h3 className="text-xl font-bold mb-2">{villa.name}</h3>
                    {villa.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{villa.description}</p>
                    )}
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
                      <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                        <Link href={`/villas/${villa.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/villas?destination=antigua">View All Antigua Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Things to Do in Antigua</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Beach & Water Activities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Explore 365 unique beaches</li>
                  <li>• Snorkeling at Cades Reef</li>
                  <li>• Sailing and yacht charters</li>
                  <li>• Kiteboarding at Jabberwock Beach</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Culture & History</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Visit Nelson's Dockyard National Park</li>
                  <li>• Explore Shirley Heights for sunset views</li>
                  <li>• Tour Betty's Hope sugar plantation</li>
                  <li>• Shop at St. John's Heritage Quay</li>
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
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">Beach For Every Day</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Ready to Experience <span className="font-semibold italic">Antigua</span>
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Book your luxury villa in Antigua and discover why this island is a Caribbean treasure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-900 hover:bg-amber-50 rounded-none px-8 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/villas?destination=antigua">Browse Villas</Link>
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
