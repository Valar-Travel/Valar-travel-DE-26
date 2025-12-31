type ApiSource = "expedia" | "booking" | "skyscanner" | "getyourguide" | "hotels.com" | "viator" | "default"

/**
 * Extracts and normalizes an image URL from different affiliate APIs
 */
export function getImageUrl(
  source: ApiSource,
  item: any, // raw API response object
): string | null {
  switch (source) {
    case "expedia":
      return item?.hotelImages?.[0]?.url || item?.images?.[0]?.url || item?.primaryImage || item?.image || null

    case "booking":
      return item?.photos?.[0]?.url_max || item?.main_photo_url || item?.images?.[0] || item?.photo_url || null

    case "skyscanner":
      return item?.imageUrl || item?.photoUrl || item?.image || null

    case "getyourguide":
      return item?.images?.[0]?.url || item?.cover_image_url || item?.image || null

    case "hotels.com":
      return item?.optimizedThumbUrls?.srpDesktop || item?.images?.[0]?.url || item?.image || null

    case "viator":
      return item?.images?.[0]?.variants?.[0]?.url || item?.primaryImage || item?.image || null

    default:
      return item?.image || item?.imageUrl || item?.photo || item?.images?.[0]?.url || item?.images?.[0] || null
  }
}

/**
 * Extracts multiple image URLs from API responses for galleries
 */
export function getImageUrls(source: ApiSource, item: any, maxImages = 5): string[] {
  const images: string[] = []

  switch (source) {
    case "expedia":
      const expediaImages = item?.hotelImages || item?.images || []
      images.push(
        ...expediaImages
          .slice(0, maxImages)
          .map((img: any) => img.url)
          .filter(Boolean),
      )
      break

    case "booking":
      const bookingImages = item?.photos || []
      images.push(
        ...bookingImages
          .slice(0, maxImages)
          .map((img: any) => img.url_max || img.url)
          .filter(Boolean),
      )
      break

    case "hotels.com":
      const hotelsImages = item?.images || []
      images.push(
        ...hotelsImages
          .slice(0, maxImages)
          .map((img: any) => img.url)
          .filter(Boolean),
      )
      break

    default:
      const primaryImage = getImageUrl(source, item)
      if (primaryImage) images.push(primaryImage)
      break
  }

  return images
}
