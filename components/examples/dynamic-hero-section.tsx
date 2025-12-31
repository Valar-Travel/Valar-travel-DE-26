"use client"

import { UnsplashImage } from "@/components/unsplash-image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DynamicHeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      <UnsplashImage
        context="home"
        section="hero"
        alt="Luxury Caribbean villa with ocean view"
        width={1920}
        height={1080}
        className="object-cover"
        priority
        fallbackUrl="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Discover Your Caribbean Villa Paradise</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-pretty">
            Luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy
          </p>
          <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
            <Link href="/villas">Browse Villas</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
