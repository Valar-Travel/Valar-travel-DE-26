"use client"

import { Card, CardContent } from "@/components/ui/card"
import { UnsplashImage } from "@/components/unsplash-image"
import Link from "next/link"

interface DynamicDestinationCardProps {
  destination: {
    name: string
    slug: string
    description: string
    villaCount: number
  }
}

export function DynamicDestinationCard({ destination }: DynamicDestinationCardProps) {
  return (
    <Link href={`/destinations/${destination.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-[4/3] relative">
          <UnsplashImage
            context={destination.slug}
            section="hero"
            alt={`${destination.name} luxury villas`}
            width={800}
            height={600}
            className="object-cover"
            fallbackUrl={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`}
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
  )
}
