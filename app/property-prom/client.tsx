"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Eye, ShieldCheck, Star, MapPin, ArrowRight, CheckCircle2, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicImage } from "@/components/dynamic-image"
import { createClient } from "@/lib/supabase/client"

interface FeaturedProperty {
  id: string
  name: string
  location: string
  price: number
  image: string
}

const features = [
  {
    icon: Crown,
    title: "Handpicked Selection",
    description:
      "Every property is personally curated by our team to ensure only the finest Caribbean estates make it to our showcase.",
  },
  {
    icon: Eye,
    title: "Virtual Display",
    description:
      "Immersive virtual tours and stunning visuals bring each property to life for potential guests worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Luxury",
    description:
      "Rigorous vetting process ensures authenticity, quality, and the true luxury experience our guests expect.",
  },
  {
    icon: Star,
    title: "Premium Exposure",
    description:
      "Featured properties gain access to our exclusive network of high-net-worth travelers and luxury seekers.",
  },
]

const ownerBenefits = [
  "Global exposure to premium travelers",
  "Professional virtual tour creation",
  "Dedicated concierge support",
  "Exclusive marketing opportunities",
]

const ROTATION_INTERVAL = 8000

export default function PropertyPromClient() {
  const [allProperties, setAllProperties] = useState<FeaturedProperty[]>([])
  const [displayedProperties, setDisplayedProperties] = useState<FeaturedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [rotationKey, setRotationKey] = useState(0)

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("scraped_luxury_properties")
          .select("id, name, location, price_per_night, images")
          .not("images", "is", null)
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) throw error

        const properties = (data || [])
          .filter((p) => {
            const hasImages = Array.isArray(p.images) ? p.images.length > 0 : !!p.images
            return hasImages
          })
          .map((p) => ({
            id: p.id,
            name: p.name || "Luxury Villa",
            location: p.location || "Caribbean",
            price: p.price_per_night || 0,
            image: Array.isArray(p.images) ? p.images[0] : p.images || "",
          }))

        setAllProperties(properties)
        setDisplayedProperties(getRandomProperties(properties, 3))
      } catch (error) {
        console.error("Error fetching properties:", error)
        const fallback = [
          {
            id: "1",
            name: "Casa Marina",
            location: "Barbados",
            price: 12000,
            image: "/images/destinations/barbados-aerial.jpg",
          },
          {
            id: "2",
            name: "Villa Serenity",
            location: "St. Lucia",
            price: 8500,
            image: "/images/destinations/st-lucia-pitons.jpg",
          },
          {
            id: "3",
            name: "Ocean Pearl Estate",
            location: "Turks & Caicos",
            price: 15000,
            image: "/images/destinations/turks-caicos-grace-bay.jpg",
          },
        ]
        setAllProperties(fallback)
        setDisplayedProperties(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  const getRandomProperties = useCallback((pool: FeaturedProperty[], count: number): FeaturedProperty[] => {
    if (pool.length <= count) return pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }, [])

  useEffect(() => {
    if (allProperties.length <= 3) return

    const interval = setInterval(() => {
      setDisplayedProperties(getRandomProperties(allProperties, 3))
      setRotationKey((prev) => prev + 1)
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [allProperties, getRandomProperties])

  const scrollToExplore = () => {
    document.getElementById("featured-estates")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <DynamicImage
            src="/images/destinations/barbados-aerial.jpg"
            alt="Luxury Caribbean Villa"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/70 to-[#0a1628]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-12 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              <span className="text-xs sm:text-sm text-white/90 uppercase tracking-widest">
                Exclusive Virtual Showcase
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Property
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                Prom
              </span>
            </h1>

            {/* Byline */}
            <p className="text-base sm:text-lg md:text-xl text-amber-200/80 font-serif italic mb-4 sm:mb-6">
              by Valar Travel
            </p>

            <p className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-white/70 mb-8 sm:mb-10 leading-relaxed px-2">
              Discover the Caribbean&apos;s most prestigious collection of handpicked luxury villas. An exclusive
              virtual showcase where extraordinary estates meet discerning travelers seeking unforgettable experiences
              in paradise.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full w-full sm:w-auto"
              >
                <Link href="/property-prom/submit">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                onClick={scrollToExplore}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full bg-transparent w-full sm:w-auto"
              >
                Explore Collection
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToExplore}
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors hidden sm:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            aria-label="Scroll to explore"
          >
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.button>
        </div>
      </section>

      {/* What is Property Prom Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-[#0a1628] to-[#0d1e36]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <p className="text-emerald-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4">
              The Experience
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 px-2">
              What is{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Property Prom
              </span>
              ?
            </h2>
            <p className="max-w-3xl mx-auto text-white/60 text-sm sm:text-base md:text-lg leading-relaxed px-2">
              Property Prom is an exclusive digital showcase featuring the Caribbean&apos;s finest luxury estates. We
              personally curate each property to ensure only exceptional villas with stunning amenities, breathtaking
              views, and unparalleled service standards are featured. Our platform connects elite property owners with
              high-net-worth travelers seeking authentic Caribbean luxury experiences.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Estates Section */}
      <section id="featured-estates" className="py-16 sm:py-20 md:py-28 bg-[#0d1e36]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <p className="text-emerald-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4">
              Featured Estates
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4">
              <span className="italic text-amber-300">Exceptional</span> Properties
            </h2>
            <p className="text-white/50 text-sm sm:text-base md:text-lg px-2">
              A glimpse of the extraordinary estates awaiting your discovery
            </p>
          </motion.div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-xl sm:rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={rotationKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {displayedProperties.map((property, index) => (
                  <motion.div
                    key={`${property.id}-${rotationKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/villas/${property.id}`}
                      className="group block relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden"
                    >
                      <DynamicImage
                        src={property.image}
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        propertyType="villa"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm mb-1 sm:mb-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="uppercase tracking-wider">{property.location}</span>
                        </div>
                        <h3 className="text-white font-serif text-xl sm:text-2xl mb-1">{property.name}</h3>
                        {property.price > 0 && (
                          <p className="text-white/70 text-sm sm:text-base">${property.price.toLocaleString()}/night</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Rotation indicator dots */}
          {allProperties.length > 3 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              {Array.from({ length: Math.min(5, Math.ceil(allProperties.length / 3)) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${
                    i === rotationKey % Math.min(5, Math.ceil(allProperties.length / 3))
                      ? "bg-emerald-400"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}

          <p className="text-center text-white/40 text-xs sm:text-sm mt-6 sm:mt-8 italic">
            And many more exclusive properties awaiting discovery...
          </p>
        </div>
      </section>

      {/* Owner CTA Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 px-2">
                Own a{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent">
                  Luxury Property
                </span>
                ?
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed px-2">
                Join Property Prom and showcase your Caribbean estate to an exclusive audience of discerning travelers.
                We handpick only the finest properties for our curated collection.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-8 sm:mb-10">
                {ownerBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-white/90">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-700 hover:bg-white/90 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-full font-semibold w-full sm:w-auto"
              >
                <Link href="/property-prom/submit">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>

              <p className="text-white/60 text-xs sm:text-sm mt-4 sm:mt-6">Applications are reviewed within 48 hours</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 bg-[#0a1628] border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-serif text-xl sm:text-2xl">Property Prom</h3>
                <p className="text-emerald-400 text-xs uppercase tracking-wider">by Valar Travel</p>
              </div>
            </div>

            <p className="text-white/50 text-xs sm:text-sm max-w-md mb-6 sm:mb-8 px-2">
              Curating the Caribbean&apos;s most exceptional luxury villas and properties for discerning travelers
              worldwide.
            </p>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Link href="/about" className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors">
                About Us
              </Link>
              <Link href="/villas" className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors">
                Properties
              </Link>
              <Link
                href="/property-prom/submit"
                className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
              >
                For Owners
              </Link>
              <Link href="/contact" className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-white/30 text-xs">© 2026 Valar Travel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
