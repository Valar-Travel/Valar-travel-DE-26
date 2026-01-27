import type { Metadata } from "next"
import PropertyPromClient from "./client"

export const metadata: Metadata = {
  title: "Property Prom | Exclusive Caribbean Luxury Villa Showcase | Valar Travel",
  description:
    "Property Prom is the Caribbean's premier virtual showcase of handpicked luxury villas. Discover exceptional estates in Barbados, St. Lucia, Jamaica, and beyond. Submit your property or find your dream vacation home.",
  keywords: [
    "luxury villas Caribbean",
    "exclusive property showcase",
    "Caribbean real estate",
    "premium vacation rentals",
    "Barbados villas",
    "St. Lucia estates",
    "Jamaica luxury homes",
    "virtual property tour",
    "high-end vacation rentals",
    "luxury villa listing",
    "Caribbean luxury travel",
    "Valar Travel",
    "Property Prom",
  ],
  openGraph: {
    title: "Property Prom | Caribbean's Most Exclusive Luxury Villa Showcase",
    description:
      "Discover the Caribbean's finest handpicked luxury villas. An exclusive virtual showcase connecting extraordinary estates with discerning travelers.",
    type: "website",
    url: "https://valartravel.de/property-prom",
    siteName: "Valar Travel",
    images: [
      {
        url: "/images/property-prom-og.jpg",
        width: 1200,
        height: 630,
        alt: "Property Prom - Exclusive Caribbean Luxury Villa Showcase by Valar Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Prom | Caribbean's Most Exclusive Luxury Villa Showcase",
    description: "Discover the Caribbean's finest handpicked luxury villas and premium properties.",
    images: ["/images/property-prom-og.jpg"],
  },
  alternates: {
    canonical: "https://valartravel.de/property-prom",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function PropertyPromPage() {
  return <PropertyPromClient />
}
