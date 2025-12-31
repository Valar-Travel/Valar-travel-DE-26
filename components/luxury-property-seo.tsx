"use client"

import { SEOHead } from "./seo-head"

interface LuxuryProperty {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  starRating: number
  price: number
  propertyType: string
  amenities: string[]
  description: string
}

interface LuxuryPropertySEOProps {
  property?: LuxuryProperty
  properties?: LuxuryProperty[]
  destination?: string
  pageType: "search" | "property" | "destination"
}

export function LuxuryPropertySEO({ property, properties, destination, pageType }: LuxuryPropertySEOProps) {
  const generateSEOContent = () => {
    switch (pageType) {
      case "property":
        if (!property) return null
        return {
          title: `${property.name} - ${property.location} | Luxury ${property.propertyType}`,
          description: `Book ${property.name} in ${property.location}. ${property.starRating}-star luxury ${property.propertyType} with ${property.amenities.slice(0, 3).join(", ")}. Starting from $${property.price}/night. ${property.reviewCount} verified reviews.`,
          keywords: `${property.name}, ${property.location}, luxury ${property.propertyType}, ${property.starRating} star hotel, ${property.amenities.join(", ")}, luxury accommodation`,
          structuredData: {
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: property.name,
            description: property.description,
            address: {
              "@type": "PostalAddress",
              addressLocality: property.location,
            },
            starRating: {
              "@type": "Rating",
              ratingValue: property.starRating,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: property.rating,
              reviewCount: property.reviewCount,
            },
            priceRange: `$${property.price}+`,
            amenityFeature: property.amenities.map((amenity) => ({
              "@type": "LocationFeatureSpecification",
              name: amenity,
            })),
          },
        }

      case "search":
        const avgPrice = properties
          ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
          : 0
        const totalProperties = properties?.length || 0
        return {
          title: `Luxury Hotels in ${destination || "Premium Destinations"}`,
          description: `Discover ${totalProperties} luxury hotels and premium accommodations in ${destination || "top destinations"}. Compare prices starting from $${avgPrice}/night. Exclusive deals on 4-5 star properties with world-class amenities.`,
          keywords: `luxury hotels ${destination || ""}, premium accommodations, 5 star hotels, luxury travel, exclusive deals, luxury vacation rentals`,
          priceRange: `$${avgPrice}-$2000+`,
          structuredData: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Luxury Hotels in ${destination}`,
            numberOfItems: totalProperties,
            itemListElement:
              properties?.slice(0, 10).map((prop, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "LodgingBusiness",
                  name: prop.name,
                  address: prop.location,
                  priceRange: `$${prop.price}+`,
                },
              })) || [],
          },
        }

      case "destination":
        return {
          title: `Luxury Travel Guide to ${destination} | Premium Hotels & Experiences`,
          description: `Complete luxury travel guide to ${destination}. Discover the finest 5-star hotels, exclusive experiences, and premium accommodations. Expert recommendations for luxury travelers.`,
          keywords: `${destination} luxury travel, ${destination} 5 star hotels, luxury guide ${destination}, premium travel ${destination}, exclusive experiences`,
          structuredData: {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: destination,
            description: `Luxury travel destination guide for ${destination}`,
            touristType: "Luxury Travelers",
          },
        }

      default:
        return null
    }
  }

  const seoContent = generateSEOContent()
  if (!seoContent) return null

  return (
    <SEOHead
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      propertyType={property?.propertyType as any}
      location={destination || property?.location}
      priceRange={seoContent.priceRange}
      starRating={property?.starRating}
      structuredData={seoContent.structuredData}
    />
  )
}
