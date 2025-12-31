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

export default function HomePageClient() {
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
      image: "/images/destinations/barbados-beach.jpg",
      villaCount: 45,
    },
    {
      name: "St. Lucia",
      slug: "st-lucia",
      description: "Dramatic Pitons and lush rainforests",
      image: "/images/destinations/st-lucia-pitons.jpg",
      villaCount: 38,
    },
    {
      name: "Jamaica",
      slug: "jamaica",
      description: "Vibrant culture and turquoise waters",
      image: "/images/destinations/jamaica-coast.webp",
      villaCount: 52,
    },
    {
      name: "St. Barthélemy",
      slug: "st-barthelemy",
      description: "French elegance meets Caribbean paradise",
      image: "/images/destinations/st-barts-nightlife.webp",
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
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/destinations/st-lucia-pitons.jpg"
          alt="Caribbean luxury villas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-800/70 to-emerald-950/85" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Luxury badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-medium tracking-widest uppercase text-amber-100">
              Exclusive Caribbean Villas
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light mb-6 text-balance tracking-tight">
            Discover Your
            <span className="block font-semibold italic text-amber-200">Caribbean Paradise</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Curated luxury villa rentals in the world's most coveted Caribbean destinations. Experience unparalleled
            elegance and bespoke service.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative shadow-2xl">
              <Search
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-700 w-5 h-5"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder="Search destinations, villas, amenities, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-36 py-6 text-base rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-medium"
                aria-label="Search for villas by destination, name, amenities, or features"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-full px-8 py-5 font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-background border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-emerald-700 tracking-tight">166+</div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Luxury Villas</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-emerald-700 tracking-tight">4</div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Exclusive Islands</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-light text-emerald-700 tracking-tight">24/7</div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Concierge Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-medium mb-4">Destinations</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
              Explore the <span className="font-semibold italic">Caribbean</span>
            </h2>
            <div className="w-16 h-px bg-emerald-600 mx-auto mb-6" />
            <p className="text-muted-foreground text-lg font-light leading-relaxed text-pretty">
              Discover the perfect island sanctuary for your luxury villa retreat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="group">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-full bg-card">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Villa count badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-emerald-800 backdrop-blur-sm font-medium shadow-sm text-xs tracking-wide">
                        {destination.villaCount} Villas
                      </Badge>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-light mb-2 tracking-wide">{destination.name}</h3>
                      <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-2 font-light">
                        {destination.description}
                      </p>
                      <div className="flex items-center gap-2 text-amber-300 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 tracking-wide">
                        <span>Explore</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* View all destinations link */}
          <div className="text-center mt-14">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent rounded-none px-10 tracking-wider uppercase text-sm"
            >
              <Link href="/destinations" className="flex items-center gap-3">
                View All Destinations
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Villas */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-medium mb-4">Featured Collection</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
              Handpicked <span className="font-semibold italic">Luxury Villas</span>
            </h2>
            <div className="w-16 h-px bg-emerald-600 mx-auto mb-6" />
            <p className="text-muted-foreground text-lg font-light leading-relaxed text-pretty">
              Exclusive properties featuring stunning views, private pools, and world-class amenities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVillas.map((villa) => (
              <Card
                key={villa.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-md group"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={villa.image || "/placeholder.svg"}
                    alt={villa.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 right-4 bg-white/95 text-emerald-900 backdrop-blur-sm shadow-sm">
                    <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                    {villa.rating}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3 font-medium tracking-wide">
                    <MapPin className="w-4 h-4" />
                    {villa.location}
                  </div>
                  <h3 className="text-xl font-medium mb-4 tracking-wide">{villa.name}</h3>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4" />
                      <span>{villa.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4" />
                      <span>{villa.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{villa.guests} Guests</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-sm text-muted-foreground">From </span>
                      <span className="text-2xl font-light text-emerald-700">${villa.price}</span>
                      <span className="text-sm text-muted-foreground"> /night</span>
                    </div>
                    <Button asChild className="bg-emerald-700 hover:bg-emerald-800 rounded-none px-6 tracking-wide">
                      <Link href={`/villas/${villa.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none px-10 tracking-wider uppercase text-sm border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"
            >
              <Link href="/villas">View All Villas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-medium mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
              Guest <span className="font-semibold italic">Experiences</span>
            </h2>
            <div className="w-16 h-px bg-emerald-600 mx-auto mb-6" />
            <p className="text-muted-foreground text-lg font-light leading-relaxed text-pretty">
              Discover what our distinguished guests have to say about their Caribbean escapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic font-light leading-relaxed">
                  "Our stay at Villa Serenity in Barbados was absolutely magical. The service was impeccable and the
                  views were breathtaking."
                </p>
                <div className="pt-4 border-t border-border/50">
                  <p className="font-medium tracking-wide">Sarah & Michael</p>
                  <p className="text-sm text-muted-foreground">New York, USA</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic font-light leading-relaxed">
                  "Valar Travel made finding our dream villa in St. Lucia so easy. The booking process was seamless and
                  the property exceeded our expectations."
                </p>
                <div className="pt-4 border-t border-border/50">
                  <p className="font-medium tracking-wide">James Thompson</p>
                  <p className="text-sm text-muted-foreground">London, UK</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic font-light leading-relaxed">
                  "The perfect family vacation! Our villa in Jamaica had everything we needed and more. Can't wait to
                  book again next year."
                </p>
                <div className="pt-4 border-t border-border/50">
                  <p className="font-medium tracking-wide">The Rodriguez Family</p>
                  <p className="text-sm text-muted-foreground">Miami, USA</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">Begin Your Journey</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Ready to Find Your <span className="font-semibold italic">Perfect Villa</span>?
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-12 text-pretty font-light leading-relaxed">
            Browse our curated collection of luxury Caribbean villas and begin planning your unforgettable escape
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-none px-10 tracking-wider uppercase text-sm font-semibold"
            >
              <Link href="/villas">Browse All Villas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent rounded-none px-10 tracking-wider uppercase text-sm"
            >
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
