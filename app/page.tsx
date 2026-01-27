// v0 deployment fix - 2026-01-19
import type { Metadata } from "next"
import { Suspense } from "react"
import PageClient from "@/components/home-page-client"
import { getFeaturedVillas } from "@/app/actions/get-featured-villas"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Luxury Caribbean Villa Rentals - Barbados, St. Lucia, Jamaica & St. Barthélemy",
  description:
    "Discover handpicked luxury villa rentals across the Caribbean. Browse 166+ exclusive properties in Barbados, St. Lucia, Jamaica, and St. Barthélemy with 24/7 concierge service.",
  openGraph: {
    title: "Luxury Caribbean Villa Rentals | Valar Travel",
    description: "Discover handpicked luxury villa rentals across the Caribbean with 24/7 concierge service.",
    url: "https://valartravel.de",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Caribbean Villa Rentals",
      },
    ],
  },
}

// Loading skeleton for featured villas section
function FeaturedVillasSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// Async component for featured villas - streams in with PPR
async function FeaturedVillasData() {
  const featuredVillas = await getFeaturedVillas()
  return <PageClient featuredVillas={featuredVillas} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<FeaturedVillasSkeleton />}>
      <FeaturedVillasData />
    </Suspense>
  )
}
