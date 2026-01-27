// v0 deployment fix - 2026-01-19
import type { Metadata } from "next"
import PageClient from "@/components/home-page-client"
import { getFeaturedVillas } from "@/app/actions/get-featured-villas"

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
    featuredVillas = await getFeaturedVillas()
  } catch (error) {
    console.error("[v0] Error fetching featured villas:", error)
    // Continue with empty array - homepage will still render
  }
  
  return <PageClient featuredVillas={featuredVillas} />
}
