"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Star, Users, Bed, Bath } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UNSPLASH_IMAGES, getImageUrl } from "@/lib/unsplash-images"

export default function PageClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/villas?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const featuredDestinations = [
    {
      name: "Barbados",
      slug: "barbados",
      description: "Pristine beaches and British colonial charm",
      image: getImageUrl(UNSPLASH_IMAGES.home.barbadosCard, 800),
      villaCount: 45,
    },
    {
      name: "St. Lucia",
      slug: "st-lucia",
      description: "Dramatic Pitons and lush rainforests",
      image: getImageUrl(UNSPLASH_IMAGES.home.stLuciaCard, 800),
      villaCount: 38,
    },
    {
      name: "Jamaica",
      slug: "jamaica",
      description: "Vibrant culture and turquoise waters",
      image: getImageUrl(UNSPLASH_IMAGES.home.jamaicaCard, 800),
      villaCount: 52,
    },
    {
      name: "St. Barthélemy",
      slug: "st-barthelemy",
      description: "French elegance meets Caribbean paradise",
      image: getImageUrl(UNSPLASH_IMAGES.home.stBarthsCard, 800),
      villaCount: 31,
    },
  ]

  const featuredVillas = [
    {
      id: "1",
      name: "Villa Serenity",
      location: "Barbados",
      price: 1200,
      bedrooms: 5,
      bathrooms: 4,
      guests: 10,
      image: getImageUrl(UNSPLASH_IMAGES.home.villa1, 800),
      rating: 4.9,
    },
    {
      id: "2",
      name: "Ocean Breeze Estate",
      location: "St. Lucia",
      price: 950,
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      image: getImageUrl(UNSPLASH_IMAGES.home.villa2, 800),
      rating: 4.8,
    },
    {
      id: "3",
      name: "Paradise Cove Villa",
      location: "Jamaica",
      price: 850,
      bedrooms: 3,
      bathrooms: 3,
      guests: 6,
      image: getImageUrl(UNSPLASH_IMAGES.home.villa3, 800),
      rating: 5.0,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={getImageUrl(UNSPLASH_IMAGES.home.hero, 1920) || "/placeholder.svg"}
            alt={UNSPLASH_IMAGES.home.hero.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Discover Your Caribbean Villa Paradise</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8 text-pretty">
            Luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy. Your dream Caribbean escape
            awaits.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by destination, villa name, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-4 text-lg rounded-full border-0 bg-white text-gray-900 placeholder-gray-500"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-700 hover:bg-green-800 rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">166+</div>
              <p className="text-muted-foreground">Luxury Villas</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">4</div>
              <p className="text-muted-foreground">Caribbean Islands</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">24/7</div>
              <p className="text-muted-foreground">Concierge Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-balance">Explore Caribbean Destinations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover the perfect island for your luxury villa getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Link key={destination.slug} href={`/destinations/${destination.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{destination.name}</h3>
                      <p className="text-sm opacity-90">{destination.villaCount} villas</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{destination.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Villas */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">Featured Properties</Badge>
            <h2 className="text-4xl font-bold mb-4 text-balance">Handpicked Luxury Villas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Exclusive properties with stunning views, private pools, and world-class amenities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVillas.map((villa) => (
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
                    {villa.location}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{villa.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/villas">View All Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-balance">What Our Guests Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Real experiences from travelers who found their perfect Caribbean villa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Our stay at Villa Serenity in Barbados was absolutely magical. The service was impeccable and the
                  views were breathtaking."
                </p>
                <p className="font-semibold">Sarah & Michael</p>
                <p className="text-sm text-muted-foreground">New York, USA</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Valar Travel made finding our dream villa in St. Lucia so easy. The booking process was seamless and
                  the property exceeded our expectations."
                </p>
                <p className="font-semibold">James Thompson</p>
                <p className="text-sm text-muted-foreground">London, UK</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The perfect family vacation! Our villa in Jamaica had everything we needed and more. Can't wait to
                  book again next year."
                </p>
                <p className="font-semibold">The Rodriguez Family</p>
                <p className="text-sm text-muted-foreground">Miami, USA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-balance">Ready to Find Your Perfect Villa?</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8 text-pretty">
            Browse our curated collection of luxury Caribbean villas and start planning your dream getaway today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/villas">Browse All Villas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent"
            >
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
