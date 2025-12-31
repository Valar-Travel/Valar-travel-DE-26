import Head from "next/head"

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonicalUrl?: string
  propertyType?: "hotel" | "villa" | "resort" | "suite"
  location?: string
  priceRange?: string
  starRating?: number
  structuredData?: object
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  propertyType,
  location,
  priceRange,
  starRating,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = `${title} | Valar Travel - Luxury Travel Deals & Comparisons`
  const defaultOgImage = "/og-image.png"

  const enhancedKeywords = keywords
    ? `${keywords}, luxury travel, premium hotels, luxury accommodations, ${propertyType || "hotels"}, ${location || "travel"}, ${starRating ? `${starRating} star` : "luxury"} properties, exclusive deals, luxury vacation rentals`
    : `luxury travel, premium hotels, luxury accommodations, exclusive deals, luxury vacation rentals, ${location || "worldwide destinations"}`

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Valar Travel",
    description: "Luxury travel deals and premium accommodation comparisons",
    url: canonicalUrl || "https://valartravel.de",
    logo: "https://valartravel.de/logo.png",
    sameAs: ["https://twitter.com/valartravel", "https://facebook.com/valartravel"],
    offers: {
      "@type": "Offer",
      category: "Luxury Accommodations",
      priceRange: priceRange || "$300-$2000+",
      availability: "https://schema.org/InStock",
    },
  }

  const finalStructuredData = structuredData || defaultStructuredData

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={enhancedKeywords} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Valar Travel" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {location && <meta property="og:locality" content={location} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@valartravel" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {propertyType && <meta name="property:type" content={propertyType} />}
      {starRating && <meta name="property:rating" content={starRating.toString()} />}
      {priceRange && <meta name="property:price_range" content={priceRange} />}
      <meta name="theme-color" content="#d97706" />
      <meta name="msapplication-TileColor" content="#d97706" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.expedia.com" />
      <link rel="preconnect" href="https://www.hotels.com" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />
    </Head>
  )
}
