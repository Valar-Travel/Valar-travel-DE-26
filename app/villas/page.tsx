import type { Metadata } from "next"
import VillasClientPage from "./villas-client"

export const metadata: Metadata = {
  title: "Luxury Caribbean Villas | Browse Our Exclusive Collection | Valar Travel",
  description:
    "Discover 50+ handpicked luxury villas across Barbados, St. Lucia, Jamaica & St. Barthélemy. Filter by bedrooms, price, amenities. Book with personalized concierge service.",
  keywords: [
    "luxury Caribbean villas",
    "villa rentals Barbados",
    "St Lucia vacation homes",
    "Jamaica luxury properties",
    "St Barth villas",
    "private pool villas",
    "beachfront rentals",
  ],
  openGraph: {
    title: "Luxury Caribbean Villas | Valar Travel",
    description:
      "Browse our curated collection of exclusive Caribbean villa rentals with private pools, ocean views, and premium amenities.",
    url: "https://valartravel.de/villas",
    siteName: "Valar Travel",
    type: "website",
  },
  alternates: {
    canonical: "https://valartravel.de/villas",
  },
}

export default function VillasPage() {
  return <VillasClientPage />
}
