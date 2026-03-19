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

// Fallback villas for when database is unavailable
const FALLBACK_VILLAS = [
  {
    id: "fallback-1",
    name: "Sunset Bay Villa",
    location: "Barbados",
    price: 1200,
    bedrooms: 5,
    bathrooms: 4,
    guests: 10,
    image: "/images/destinations/barbados-beach.jpg",
    rating: 4.9,
  },
  {
    id: "fallback-2", 
    name: "Piton View Estate",
    location: "St. Lucia",
    price: 1500,
    bedrooms: 6,
    bathrooms: 5,
    guests: 12,
    image: "/images/destinations/st-lucia-pitons.jpg",
    rating: 4.8,
  },
  {
    id: "fallback-3",
    name: "Caribbean Dream Villa",
    location: "Jamaica",
    price: 950,
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    image: "/images/destinations/jamaica-coast.webp",
    rating: 4.7,
  },
]

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
    console.log("[HomePage] Fetched", featuredVillas.length, "featured villas")
  } catch (error) {
    console.error("[HomePage] Error fetching featured villas:", error)
  }
  
  // Use fallback villas if database returns empty or fails
  if (!featuredVillas || featuredVillas.length === 0) {
    console.log("[HomePage] Using fallback villas")
    featuredVillas = FALLBACK_VILLAS
  }
  
  return <HomePageClient featuredVillas={featuredVillas} />
}
