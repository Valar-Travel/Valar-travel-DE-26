"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Users, Bed, Bath } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DynamicImage } from "@/components/dynamic-image"

interface FeaturedVilla {
  id: string
  name: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  guests: number
  image: string
  rating: number
}

interface HomePageClientProps {
  featuredVillas: FeaturedVilla[]
}

export default function HomePageClient({ featuredVillas }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

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
    {
      name: "St. Maarten",
      slug: "st-maarten",
      description: "Dutch-French charm with world-class beaches",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80",
      villaCount: 24,
    },
    {
      name: "Antigua",
      slug: "antigua",
      description: "365 beaches and historic English Harbour",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
      villaCount: 18,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/villas?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Image - absolute positioning to cover full section */}
        <div className="absolute inset-0 w-full h-full">
          <DynamicImage
            src="/images/destinations/st-lucia-pitons.jpg"
            alt="Caribbean luxury villas"
            fill
            className="object-cover object-center"
            priority
            fallbackSrc="/luxury-caribbean-villa.jpg"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900/85 via-emerald-800/70 to-emerald-950/85" />

        {/* Content - centered with proper padding for mobile */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Luxury badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-amber-100">
                Exclusive Caribbean Villas
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-4 sm:mb-6 text-balance tracking-tight text-white">
              Discover Your
              <span className="block font-semibold italic text-amber-200">Caribbean Paradise</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-pretty font-light leading-relaxed px-2">
              Curated luxury villa rentals in the world's most coveted Caribbean destinations. Experience unparalleled
              elegance and bespoke service.
            </p>

            <form onSubmit={handleSearch} className="max-w-xl lg:max-w-2xl mx-auto px-2">
              <div className="relative shadow-2xl">
                <Search
                  className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-emerald-700 w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search destinations, villas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-14 pr-24 sm:pr-32 md:pr-36 py-4 sm:py-5 md:py-6 text-sm sm:text-base rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-medium"
                  aria-label="Search for villas by destination, name, amenities, or features"
                />
                <Button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16 bg-background border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 text-center max-w-4xl mx-auto">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-emerald-700 tracking-tight">
                166+
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest text-muted-foreground font-medium">
                Luxury Villas
              </p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-emerald-700 tracking-tight">
                6
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest text-muted-foreground font-medium">
                Exclusive Islands
              </p>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-emerald-700 tracking-tight">
                24/7
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest text-muted-foreground font-medium">
                Concierge
              </p>
            </div>
          </div>
        </div>
      </section>



      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-emerald-600 font-medium mb-3 sm:mb-4">
              Destinations
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 text-balance tracking-tight">
              Explore the <span className="font-semibold italic">Caribbean</span>
            </h2>
            <div className="w-12 sm:w-16 h-px bg-emerald-600 mx-auto mb-4 sm:mb-6" />
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light leading-relaxed text-pretty px-2">
              Discover the perfect island sanctuary for your luxury villa retreat
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {featuredDestinations.map((destination) => (
              <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="group">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-full bg-card">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <DynamicImage
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fallbackSrc="/luxury-caribbean-villa.jpg"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Villa count badge */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                      <Badge className="bg-white/95 text-emerald-800 backdrop-blur-sm font-medium shadow-sm text-[10px] sm:text-xs tracking-wide px-1.5 sm:px-2 py-0.5 sm:py-1">
                        {destination.villaCount} Villas
                      </Badge>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white z-10">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 tracking-wide">
                        {destination.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-2 sm:mb-4 line-clamp-2 font-light hidden sm:block">
                        {destination.description}
                      </p>
                      <div className="flex items-center text-amber-300 group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-sm font-medium">
                        <span>Explore</span>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform"
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
          <div className="text-center mt-8 sm:mt-10 md:mt-14">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent rounded-none px-6 sm:px-10 tracking-wider uppercase text-xs sm:text-sm"
            >
              <Link href="/destinations" className="flex items-center gap-2 sm:gap-3">
                View All Destinations
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform"
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

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-emerald-600 font-medium mb-3 sm:mb-4">
              Featured Collection
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 sm:mb-6 text-balance tracking-tight">
              Today's <span className="font-semibold italic">Featured Villas</span>
            </h2>
            <div className="w-12 sm:w-16 h-px bg-emerald-600 mx-auto mb-4 sm:mb-6" />
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light leading-relaxed text-pretty px-2">
              Exclusive Barbados properties featuring stunning views, private pools, and world-class amenities
            </p>
          </div>

          {featuredVillas && featuredVillas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredVillas.map((villa) => (
                <Card
                  key={villa.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-md group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <DynamicImage
                      src={villa.image}
                      alt={villa.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackSrc="/images/fallback-luxury-villa.jpg"
                      propertyType="villa"
                    />
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-600 mb-2 sm:mb-3 font-medium tracking-wide">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      {villa.location}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 tracking-wide line-clamp-1">
                      {villa.name}
                    </h3>
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{villa.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{villa.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{villa.guests}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50">
                      <div>
                        <span className="text-xs sm:text-sm text-muted-foreground">From </span>
                        <span className="text-lg sm:text-xl md:text-2xl font-light text-emerald-700">
                          ${villa.price}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground"> /night</span>
                      </div>
                      <Button
                        asChild
                        className="bg-emerald-700 hover:bg-emerald-800 rounded-none px-4 sm:px-6 text-xs sm:text-sm tracking-wide"
                      >
                        <Link href={`/villas/${villa.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <div className="aspect-[4/3] bg-muted animate-pulse" />
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="h-4 bg-muted rounded animate-pulse mb-3" />
                    <div className="h-6 bg-muted rounded animate-pulse mb-4 w-3/4" />
                    <div className="flex gap-4 mb-6">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-10 md:mt-14">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none px-6 sm:px-10 tracking-wider uppercase text-xs sm:text-sm border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"
            >
              <Link href="/villas">View All Villas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
