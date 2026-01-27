import type { Metadata } from "next"
import CollaborationsClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Brand Collaborations & Luxury Partnerships | Valar Travel",
  description:
    "Partner with Valar Travel to create exclusive luxury experiences for discerning Caribbean travelers. Explore collaboration opportunities with Dom Pérignon, Leica, NetJets, and more premium brands.",
  keywords: [
    "luxury brand partnerships",
    "Caribbean villa collaborations",
    "luxury travel partnerships",
    "brand experiences Caribbean",
    "exclusive villa events",
    "luxury brand activations",
    "premium travel collaborations",
    "Valar Travel partnerships",
  ],
  openGraph: {
    title: "Brand Collaborations & Luxury Partnerships | Valar Travel",
    description:
      "Create unforgettable luxury experiences with Valar Travel. Partner with us to reach discerning travelers at exclusive Caribbean villas.",
    url: "https://valartravel.de/collaborations",
    type: "website",
    images: [
      {
        url: "/luxury-champagne-tasting-at-villa.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury brand collaboration at Caribbean villa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Collaborations & Luxury Partnerships | Valar Travel",
    description: "Partner with Valar Travel to create exclusive luxury experiences for discerning Caribbean travelers.",
  },
  alternates: {
    canonical: "https://valartravel.de/collaborations",
  },
}

export default function CollaborationsPage() {
  return <CollaborationsClientPage />
}
