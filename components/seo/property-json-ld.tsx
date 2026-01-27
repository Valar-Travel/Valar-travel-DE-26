interface PropertyJsonLdProps {
  property: {
    id: string
    name: string
    description?: string
    location?: string
    price_per_night?: number
    currency?: string
    bedrooms?: number
    bathrooms?: number
    max_guests?: number
    guests?: number
    images?: string[]
    amenities?: string[]
    rating?: number
  }
  url: string
}

export function PropertyJsonLd({ property, url }: PropertyJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: property.description || `Luxury property in ${property.location || "the Caribbean"}`,
    url: url,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || "Caribbean",
      addressRegion: property.location || "Caribbean",
    },
    ...(property.images && property.images.length > 0 && {
      image: property.images,
    }),
    ...(property.price_per_night && {
      priceRange: `$${property.price_per_night} - $${Math.round(property.price_per_night * 1.75)}`,
    }),
    ...(property.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: property.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    amenityFeature: (property.amenities || []).map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    numberOfRooms: property.bedrooms || undefined,
    ...((property.max_guests || property.guests) ? {
      maximumAttendeeCapacity: property.max_guests || property.guests,
    } : {}),
  }

  // Offer schema for pricing
  const offerData = property.price_per_night
    ? {
        "@context": "https://schema.org",
        "@type": "Offer",
        name: `${property.name} - Nightly Rental`,
        price: property.price_per_night,
        priceCurrency: property.currency || "USD",
        availability: "https://schema.org/InStock",
        url: url,
        seller: {
          "@type": "Organization",
          name: "Valar Travel",
          url: "https://valartravel.de",
        },
      }
    : null

  // Breadcrumb schema
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://valartravel.de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Villas",
        item: "https://valartravel.de/villas",
      },
      ...(property.location
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: property.location,
              item: `https://valartravel.de/destinations/${property.location.toLowerCase().replace(/\s+/g, "-")}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: property.name,
              item: url,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: property.name,
              item: url,
            },
          ]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {offerData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  )
}
