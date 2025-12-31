// Structured data helpers for SEO

export function generateVillaStructuredData(villa: {
  id: string
  name: string
  description: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  guests: number
  image: string
  rating?: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: villa.name,
    description: villa.description,
    image: villa.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: villa.location,
      addressCountry: "Caribbean",
    },
    priceRange: `$${villa.price}`,
    starRating: villa.rating
      ? {
          "@type": "Rating",
          ratingValue: villa.rating,
          bestRating: 5,
        }
      : undefined,
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Bedrooms",
        value: villa.bedrooms,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Bathrooms",
        value: villa.bathrooms,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Max Guests",
        value: villa.guests,
      },
    ],
  }
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Valar Travel",
    url: "https://valartravel.de",
    logo: "https://valartravel.de/logo.png",
    description: "Luxury Caribbean villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "Customer Service",
      email: "hello@valartravel.de",
      availableLanguage: ["English", "German"],
    },
    sameAs: [
      "https://facebook.com/valartravel",
      "https://twitter.com/valartravel",
      "https://instagram.com/valartravel",
      "https://youtube.com/@valartravel",
    ],
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleStructuredData(article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Valar Travel",
      logo: {
        "@type": "ImageObject",
        url: "https://valartravel.de/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }
}
