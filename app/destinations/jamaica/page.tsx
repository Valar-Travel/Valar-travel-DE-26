import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Bed, Bath, Users, Music, Waves, Coffee, Sun } from "lucide-react"
import { UNSPLASH_IMAGES, getImageUrl } from "@/lib/unsplash-images"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Luxury Villas in Jamaica | Beachfront & Hillside Rentals | Valar Travel",
  description:
    "Discover 50+ exclusive luxury villa rentals in Jamaica. Seven Mile Beach, Montego Bay & Ocho Rios villas with private pools, staff & authentic Caribbean culture.",
  keywords: [
    "Jamaica luxury villas",
    "Jamaica villa rentals",
    "Seven Mile Beach villas",
    "Montego Bay luxury villa",
    "Ocho Rios beachfront villa",
    "Jamaica vacation rental",
  ],
  openGraph: {
    title: "Luxury Villas in Jamaica | Valar Travel",
    description: "Handpicked luxury villas in Jamaica with private pools, staff & authentic Caribbean hospitality.",
    url: "https://valartravel.de/destinations/jamaica",
  },
  alternates: {
    canonical: "https://valartravel.de/destinations/jamaica",
  },
}

const JAMAICA_SOURCE_URLS = [
  "jamaicavillas.com",
  "villasjamaica.com",
  "jamaicaluxuryvillas.com",
  "tryallclub.com",
  "roundhilljamaica.com",
]

async function getJamaicaVillas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("scraped_luxury_properties")
    .select("*")
    .or(`location.ilike.%jamaica%,${JAMAICA_SOURCE_URLS.map((url) => `source_url.ilike.%${url}%`).join(",")}`)
    .order("rating", { ascending: false })
    .limit(12)

  if (error || !data) return []

  return data.map((prop) => ({
    id: prop.id,
    name: prop.name,
    price: prop.price_per_night || 850,
    bedrooms: prop.bedrooms || 4,
    bathrooms: prop.bathrooms || 3,
    guests: (prop.bedrooms || 4) * 2,
    image: prop.images?.[0] || getImageUrl(UNSPLASH_IMAGES.jamaica.villa1, 800),
    rating: prop.rating || 4.8,
    features: prop.amenities?.slice(0, 4) || ["Pool", "Ocean View", "Staff"],
  }))
}

export default async function JamaicaPage() {
  const villas = await getJamaicaVillas()

  const highlights = [
    {
      icon: Music,
      title: "Vibrant Culture",
      description: "Birthplace of reggae and home to rich cultural heritage",
    },
    {
      icon: Waves,
      title: "Stunning Beaches",
      description: "From Seven Mile Beach to hidden coves",
    },
    {
      icon: Coffee,
      title: "Blue Mountain Coffee",
      description: "World-famous coffee and authentic Jamaican cuisine",
    },
    {
      icon: Sun,
      title: "Year-Round Sunshine",
      description: "Perfect tropical weather for your villa getaway",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src={getImageUrl(UNSPLASH_IMAGES.jamaica.hero, 1920) || "/placeholder.svg"}
          alt={UNSPLASH_IMAGES.jamaica.hero.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">One Love</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Luxury Villas in Jamaica</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-pretty">
              Experience authentic Caribbean culture, world-class beaches, and warm Jamaican hospitality
            </p>
          </div>
        </div>
      </section>

      {/* Destination Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Choose Jamaica?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Jamaica is the heart and soul of the Caribbean, offering an authentic island experience like no other.
              From the legendary Seven Mile Beach in Negril to the lush Blue Mountains, Jamaica combines natural beauty
              with vibrant culture. Experience world-class beaches, reggae music, delicious jerk cuisine, and the
              warmest hospitality in the Caribbean - all from the comfort of your private luxury villa.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <highlight.icon className="w-10 h-10 text-green-700 mb-3" />
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
            <h2 className="text-4xl font-bold mb-4 text-balance">Featured Jamaica Villas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Beachfront estates and hillside retreats with authentic Jamaican charm
            </p>
          </div>

          {villas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No villas available for Jamaica yet.</p>
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
                    <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {villa.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      Jamaica
                    </div>
                    <h3 className="text-xl font-bold mb-3">{villa.name}</h3>
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
                        <span className="text-2xl font-bold text-green-700">${villa.price}</span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      <Button asChild className="bg-green-700 hover:bg-green-800">
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
              <Link href="/villas?destination=jamaica">View All Jamaica Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Things to Do in Jamaica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Adventure & Culture</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Climb Dunn's River Falls</li>
                  <li>- Visit Bob Marley Museum in Kingston</li>
                  <li>- Raft down the Martha Brae River</li>
                  <li>- Explore Blue Mountain coffee plantations</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Beach & Relaxation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Sunset at Seven Mile Beach, Negril</li>
                  <li>- Snorkel at Doctor's Cave Beach</li>
                  <li>- Enjoy authentic jerk chicken at Scotchies</li>
                  <li>- Experience Rick's Cafe cliff diving</li>
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
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">One Love</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Ready to Experience <span className="font-semibold italic">Jamaica</span>
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Book your luxury villa in Jamaica today and immerse yourself in authentic Caribbean culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-900 hover:bg-amber-50 rounded-none px-8 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/villas?destination=jamaica">Browse Villas</Link>
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
