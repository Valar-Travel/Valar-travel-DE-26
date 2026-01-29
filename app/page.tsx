// v0 deployment fix - 2026-01-28
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getFeaturedVillas } from "@/app/actions/get-featured-villas"

// Dynamic import to fix chunk loading issues
const HomePageClient = dynamic(() => import("@/components/home-page-client"), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  ),
})

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

export default async function HomePage() {
  let featuredVillas: any[] = []
  
  try {
    console.log("[v0] HomePage: Calling getFeaturedVillas...")
    featuredVillas = await getFeaturedVillas()
    console.log("[v0] HomePage: Got", featuredVillas.length, "featured villas")
  } catch (error) {
    console.error("[v0] HomePage: Error fetching featured villas:", error)
    // Continue with empty array - homepage will still render
  }
  
  return <HomePageClient featuredVillas={featuredVillas} />
}
