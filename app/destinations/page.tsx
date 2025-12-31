"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Palmtree, Waves, Sun, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const destinations = [
  {
    id: "barbados",
    name: "Barbados",
    slug: "barbados",
    tagline: "Where British elegance meets Caribbean soul",
    description: "Pink sand beaches, world-class dining, and sophisticated island culture",
    image: "/barbados-beach-luxury-villa.jpg",
    villas: 12,
    startingPrice: 850,
    highlights: ["Pink Sand Beaches", "Rum Distilleries", "Cricket Culture", "Platinum Coast"],
  },
  {
    id: "st-lucia",
    name: "St. Lucia",
    slug: "st-lucia",
    tagline: "Nature's masterpiece in the Caribbean",
    description: "Dramatic Pitons, lush rainforests, and secluded luxury hideaways",
    image: "/st-lucia-pitons-luxury-resort.jpg",
    villas: 8,
    startingPrice: 950,
    highlights: ["The Pitons", "Sulphur Springs", "Rainforest Adventures", "Secluded Beaches"],
  },
  {
    id: "jamaica",
    name: "Jamaica",
    slug: "jamaica",
    tagline: "Rhythm, culture, and natural beauty",
    description: "Vibrant culture, pristine beaches, and legendary hospitality",
    image: "/jamaica-beach-palm-trees.jpg",
    villas: 15,
    startingPrice: 750,
    highlights: ["Negril Cliffs", "Blue Mountains", "Reggae Culture", "Dunn's River Falls"],
  },
  {
    id: "st-barthelemy",
    name: "St. Barthélemy",
    slug: "st-barthelemy",
    tagline: "The jewel of the French Caribbean",
    description: "European sophistication with Caribbean charm and world-class luxury",
    image: "/st-barths-luxury-yacht-harbor.jpg",
    villas: 10,
    startingPrice: 1500,
    highlights: ["Gustavia Harbor", "Designer Shopping", "Gourmet Dining", "Pristine Beaches"],
  },
]

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Palmtree className="w-4 h-4" />
            Caribbean Luxury Destinations
          </div>
          <h1 className="text-5xl font-bold mb-6 text-balance">Discover Your Caribbean Paradise</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty">
            Four extraordinary islands, each with its own character and charm. From the sophisticated shores of St.
            Barthélemy to the vibrant culture of Jamaica, find your perfect luxury villa escape.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-medium">{destination.name}</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{destination.tagline}</h3>
                    <p className="text-white/90 text-sm">{destination.description}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available Villas</p>
                      <p className="text-2xl font-bold text-emerald-600">{destination.villas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Starting From</p>
                      <p className="text-2xl font-bold">${destination.startingPrice}/night</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Highlights</p>
                    <div className="grid grid-cols-2 gap-2">
                      {destination.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/destinations/${destination.slug}`}>
                        Explore {destination.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/villas?destination=${destination.slug}`}>View Villas</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose the Caribbean?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of luxury, culture, and natural beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pristine Beaches</h3>
              <p className="text-muted-foreground">
                Crystal-clear waters, powder-soft sand, and year-round sunshine create the perfect beach paradise
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palmtree className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Island Culture</h3>
              <p className="text-muted-foreground">
                Rich history, vibrant music, world-class cuisine, and warm hospitality define Caribbean living
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Luxury Living</h3>
              <p className="text-muted-foreground">
                Exclusive villas, private beaches, and personalized service ensure an unforgettable experience
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
