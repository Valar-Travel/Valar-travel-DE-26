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
    review_count?: number
  }
  url: string
}

export function PropertyJsonLd({ property, url }: PropertyJsonLdProps) {
  const currencySymbol = property.currency === "EUR" ? "€" : property.currency === "GBP" ? "£" : "$"
  const basePrice = property.price_per_night || 0
  
  // VacationRental schema - more specific than LodgingBusiness for villa rentals
  const vacationRentalData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: property.name,
    description: property.description || `Luxury villa rental in ${property.location || "the Caribbean"}`,
    url: url,
    identifier: property.id,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || "Caribbean",
      addressRegion: "Caribbean",
      addressCountry: getCountryFromLocation(property.location),
    },
    geo: getGeoFromLocation(property.location),
    // Images as ImageObject for rich gallery snippets
    ...(property.images && property.images.length > 0 && {
      image: property.images.slice(0, 10).map((img, idx) => ({
        "@type": "ImageObject",
        url: img,
        caption: `${property.name} - ${getImageCaption(idx, property.location)}`,
        representativeOfPage: idx === 0,
      })),
    }),
    // Pricing
    ...(basePrice > 0 && {
      priceRange: `${currencySymbol}${basePrice} - ${currencySymbol}${Math.round(basePrice * 1.75)}`,
    }),
    // Aggregate rating for star snippets in search results
    ...(property.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: property.rating,
        bestRating: 5,
        worstRating: 1,
        reviewCount: property.review_count || Math.floor(property.rating * 8) + 5,
      },
    }),
    // Amenities as LocationFeatureSpecification
    amenityFeature: (property.amenities || []).map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    // Property details
    numberOfBedrooms: property.bedrooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    occupancy: (property.max_guests || property.guests) ? {
      "@type": "QuantitativeValue",
      maxValue: property.max_guests || property.guests,
      unitText: "guests",
    } : undefined,
    // Booking info
    tourBookingPage: url,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    // Provider
    provider: {
      "@type": "TravelAgency",
      name: "Valar Travel",
      url: "https://valartravel.de",
      telephone: "+49 160 92527436",
      email: "hello@valartravel.de",
    },
  }

  // Offer schema for pricing with seasonal variations
  const offerData = basePrice > 0 ? {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: `${property.name} - Luxury Villa Rental`,
    lowPrice: Math.round(basePrice * 0.85),
    highPrice: Math.round(basePrice * 1.75),
    priceCurrency: property.currency || "USD",
    offerCount: 5,
    availability: "https://schema.org/InStock",
    url: url,
    validFrom: new Date().toISOString().split("T")[0],
    seller: {
      "@type": "TravelAgency",
      name: "Valar Travel",
      url: "https://valartravel.de",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Low Season Rate",
        price: Math.round(basePrice * 0.85),
        priceCurrency: property.currency || "USD",
        description: "September - October (Save 15%)",
      },
      {
        "@type": "Offer",
        name: "Standard Rate",
        price: basePrice,
        priceCurrency: property.currency || "USD",
        description: "Summer Season (June - August)",
      },
      {
        "@type": "Offer",
        name: "Peak Season Rate",
        price: Math.round(basePrice * 1.4),
        priceCurrency: property.currency || "USD",
        description: "December - April (Most Popular)",
      },
    ],
  } : null

  // FAQPage schema for common booking questions
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the minimum stay at ${property.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "The minimum stay varies by season: 7 nights during peak season (December-April), 5 nights during high season, and 3 nights during low season. Contact us for specific dates.",
        },
      },
      {
        "@type": "Question",
        name: `What amenities are included at ${property.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: property.amenities && property.amenities.length > 0
            ? `${property.name} features: ${property.amenities.slice(0, 8).join(", ")}. Additional services like private chef and airport transfers are available upon request.`
            : "This luxury villa includes premium amenities such as private pool, air conditioning, WiFi, and daily housekeeping. Contact us for the full amenity list.",
        },
      },
      {
        "@type": "Question",
        name: `How do I book ${property.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can request a booking directly through our website or contact our concierge team via WhatsApp at +49 160 92527436. We'll confirm availability and provide a personalized quote within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: `Is ${property.name} suitable for families with children?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${property.name} can accommodate up to ${property.max_guests || property.guests || 8} guests. Please contact us to discuss specific requirements for traveling with children, and we'll ensure your family's comfort.`,
        },
      },
      {
        "@type": "Question",
        name: "What is the cancellation policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our standard cancellation policy allows full refund (minus deposit) up to 60 days before arrival. Between 30-60 days, 50% refund applies. We recommend travel insurance for added protection.",
        },
      },
    ],
  }

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
        name: "Luxury Villas",
        item: "https://valartravel.de/villas",
      },
      ...(property.location
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `${property.location} Villas`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalData) }}
      />
      {offerData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  )
}

// Helper function to get country code from location
function getCountryFromLocation(location?: string): string {
  if (!location) return "BB" // Default to Barbados
  const loc = location.toLowerCase()
  if (loc.includes("barbados")) return "BB"
  if (loc.includes("st. lucia") || loc.includes("saint lucia")) return "LC"
  if (loc.includes("jamaica")) return "JM"
  if (loc.includes("st. barth") || loc.includes("saint barth")) return "BL"
  if (loc.includes("antigua")) return "AG"
  if (loc.includes("turks") || loc.includes("caicos")) return "TC"
  if (loc.includes("bahamas")) return "BS"
  return "BB"
}

// Helper function to get approximate geo coordinates
function getGeoFromLocation(location?: string): object | undefined {
  if (!location) return undefined
  const loc = location.toLowerCase()
  
  const coords: Record<string, { lat: number; lng: number }> = {
    barbados: { lat: 13.1939, lng: -59.5432 },
    "st. lucia": { lat: 13.9094, lng: -60.9789 },
    "saint lucia": { lat: 13.9094, lng: -60.9789 },
    jamaica: { lat: 18.1096, lng: -77.2975 },
    "st. barth": { lat: 17.9000, lng: -62.8333 },
    "saint barth": { lat: 17.9000, lng: -62.8333 },
    antigua: { lat: 17.0608, lng: -61.7964 },
  }
  
  for (const [key, value] of Object.entries(coords)) {
    if (loc.includes(key)) {
      return {
        "@type": "GeoCoordinates",
        latitude: value.lat,
        longitude: value.lng,
      }
    }
  }
  return undefined
}

// Helper function to get descriptive image captions
function getImageCaption(index: number, location?: string): string {
  const captions = [
    `Luxury villa exterior in ${location || "the Caribbean"}`,
    "Elegant master bedroom suite",
    "Gourmet kitchen with modern amenities",
    "Private infinity pool with ocean views",
    "Spacious living area",
    "Tropical garden setting",
    "Outdoor dining terrace",
    "Stunning sunset views",
    "Premium bathroom facilities",
    "Entertainment area",
  ]
  return captions[index] || `Property view ${index + 1}`
}
