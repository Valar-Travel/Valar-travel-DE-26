import type { Metadata } from "next"

export interface OGMetadataOptions {
  title: string
  description: string
  image?: string
  imageAlt?: string
  path?: string
  type?: "website" | "article" | "product"
}

export function generateOGMetadata(options: OGMetadataOptions): Metadata {
  const {
    title,
    description,
    image = "https://valartravel.de/og-image.jpg",
    imageAlt = "Valar Travel - Luxury Caribbean Villa Rentals",
    path = "",
    type = "website",
  } = options

  const url = `https://valartravel.de${path}`

  return {
    title,
    description,
    openGraph: {
      type,
      locale: "de_DE",
      url,
      siteName: "Valar Travel",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@valartravel",
      title,
      description,
      images: [image],
    },
  }
}

/**
 * Generate metadata for destination pages
 * Example: /destinations/barbados
 */
export function generateDestinationMetadata(
  destinationName: string,
  path: string,
  image: string
): Metadata {
  return generateOGMetadata({
    title: `${destinationName} Luxury Villa Rentals | Valar Travel`,
    description: `Discover exclusive luxury villas in ${destinationName}. Handpicked properties with private beach access and personalized concierge service.`,
    image,
    imageAlt: `Luxury villas in ${destinationName}`,
    path,
    type: "website",
  })
}

/**
 * Generate metadata for individual property pages
 * Example: /villas/villa-12345
 */
export function generatePropertyMetadata(
  propertyName: string,
  destination: string,
  path: string,
  image: string,
  shortDescription?: string
): Metadata {
  return generateOGMetadata({
    title: `${propertyName} - Luxury Villa in ${destination} | Valar Travel`,
    description:
      shortDescription ||
      `Book ${propertyName}, an exclusive luxury villa in ${destination}. Private beach access, infinity pools, and world-class amenities await.`,
    image,
    imageAlt: propertyName,
    path,
    type: "product",
  })
}
