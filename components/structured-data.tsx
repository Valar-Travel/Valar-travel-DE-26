import Script from "next/script"

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Valar Travel",
    description:
      "Curated luxury villa rentals in the Caribbean. Discover handpicked properties in Barbados, St. Lucia, Jamaica, and St. Barthélemy with 24/7 concierge service.",
    url: "https://valartravel.de",
    logo: "https://valartravel.de/og-image.jpg",
    image: "https://valartravel.de/og-image.jpg",
    telephone: "+1-555-123-4567",
    email: "hello@valartravel.de",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Caribbean",
    },
    sameAs: [
      "https://facebook.com/valartravel",
      "https://twitter.com/valartravel",
      "https://instagram.com/valartravel",
      "https://youtube.com/@valartravel",
    ],
    areaServed: [
      {
        "@type": "Place",
        name: "Barbados",
      },
      {
        "@type": "Place",
        name: "St. Lucia",
      },
      {
        "@type": "Place",
        name: "Jamaica",
      },
      {
        "@type": "Place",
        name: "St. Barthélemy",
      },
    ],
    priceRange: "$$$",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      suppressHydrationWarning
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      suppressHydrationWarning
    />
  )
}
