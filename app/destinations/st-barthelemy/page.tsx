import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Users, Sparkles, Wine, Anchor, ShoppingBag } from "lucide-react"
import { UNSPLASH_IMAGES, getImageUrl } from "@/lib/unsplash-images"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Luxury Villas in St. Barthelemy | Ultra-Luxury St. Barths Rentals | Valar Travel",
  description:
    "Discover ultra-luxury villa rentals in St. Barthelemy (St. Barths). French elegance, designer shopping & world-class dining. Book Gustavia, Flamands & St. Jean villas.",
  keywords: [
    "St Barths luxury villas",
    "St Barthelemy villa rentals",
    "Gustavia luxury villa",
    "St Barths beachfront villa",
    "French Caribbean villa",
    "Celebrity vacation rental",
  ],
  openGraph: {
    title: "Ultra-Luxury Villas in St. Barthelemy | Valar Travel",
    description:
      "The Caribbean's most exclusive villas in St. Barths with French sophistication and impeccable service.",
    url: "https://valartravel.de/destinations/st-barthelemy",
  },
  alternates: {
    canonical: "https://valartravel.de/destinations/st-barthelemy",
  },
}

async function getStBarthsVillas() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .ilike("location", "%barth%")
      .limit(12)

    if (error || !data) return []

    return data.map((prop) => ({
      id: prop.id,
      name: prop.name,
      description: prop.description || "",
      price: prop.price_per_night || 2500,
      bedrooms: prop.bedrooms || 5,
      bathrooms: prop.bathrooms || 5,
      guests: prop.max_guests || (prop.bedrooms || 5) * 2,
      image: prop.images?.[0] || getImageUrl(UNSPLASH_IMAGES.stBarthelemy.villa1, 800),
      features: prop.amenities?.slice(0, 4) || ["Ocean View", "Infinity Pool", "Butler"],
      rating: prop.rating || 4.8,
      location: prop.location || "St. Barthelemy",
    }))
  } catch {
    return []
  }
}

export default async function StBarthelemyPage() {
  const villas = await getStBarthsVillas()

  const highlights = [
    {
      icon: Sparkles,
      title: "French Sophistication",
      description: "European elegance in a Caribbean setting",
    },
    {
      icon: Wine,
      title: "Gourmet Dining",
      description: "Michelin-quality restaurants and French cuisine",
    },
    {
      icon: Anchor,
      title: "Luxury Yachting",
      description: "Premier destination for superyacht enthusiasts",
    },
    {
      icon: ShoppingBag,
      title: "Designer Shopping",
      description: "Tax-free luxury boutiques and high-end brands",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/destinations/st-barts-nightlife.webp"
          alt="St. Barthelemy luxury harbor at night"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-800/70 to-emerald-950/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-amber-500/20 text-amber-200 border-amber-400/30 backdrop-blur-sm">
              French Caribbean Jewel
            </Badge>
            <h1 className="text-5xl md:text-6xl font-light mb-4 text-balance tracking-tight">
              Luxury Villas in <span className="font-semibold italic">St. Barthelemy</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-pretty font-light text-emerald-50/90 leading-relaxed">
              Where French sophistication meets Caribbean paradise in the world's most exclusive island destination
            </p>
          </div>
        </div>
      </section>

      {/* Destination Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Choose St. Barthélemy?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              St. Barthélemy, affectionately known as St. Barths, is the Caribbean's most exclusive and sophisticated
              destination. This French island paradise combines European elegance with tropical beauty, offering
              pristine beaches, world-class dining, designer shopping, and unparalleled luxury. Popular with celebrities
              and discerning travelers, St. Barths provides the ultimate villa experience with impeccable service,
              privacy, and refinement.
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
            <h2 className="text-4xl font-bold mb-4 text-balance">Featured St. Barths Villas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ultra-luxury estates with breathtaking views and world-class amenities
            </p>
          </div>

          {villas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No villas available for St. Barthelemy yet.</p>
              <Button asChild variant="outline">
                <Link href="/admin/properties">Add Properties</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((villa) => (
                <Card key={villa.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <Image src={villa.image || "/placeholder.svg"} alt={villa.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      St. Barthélemy
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
              <Link href="/villas?destination=st-barthelemy">View All St. Barths Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Things to Do in St. Barthélemy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Luxury & Leisure</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Shop designer boutiques in Gustavia</li>
                  <li>- Dine at Michelin-quality restaurants</li>
                  <li>- Charter a yacht for island hopping</li>
                  <li>- Relax at exclusive beach clubs</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Beach & Activities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Swim at pristine Colombier Beach</li>
                  <li>- Snorkel at Shell Beach</li>
                  <li>- Watch planes at St. Jean Beach</li>
                  <li>- Sunset cocktails at Nikki Beach</li>
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
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">French Caribbean Jewel</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Ready to Experience <span className="font-semibold italic">St. Barths</span>
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Book your ultra-luxury villa in St. Barthélemy and discover the Caribbean's most exclusive destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-900 hover:bg-amber-50 rounded-none px-8 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/villas?destination=st-barthelemy">Browse Villas</Link>
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
