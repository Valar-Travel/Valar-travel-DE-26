"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

type DynamicImageProps = {
  src: string | string[]
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  fallbackSrc?: string
  propertyType?: string
  enableGallery?: boolean
  transformations?: {
    quality?: number
    format?: string
    crop?: string
    gravity?: string
  }
  onImageError?: (url: string) => void
}

function getFallbackImage(propertyType?: string): string {
  const type = propertyType?.toLowerCase() || ""
  if (type.includes("villa")) {
    return "/images/fallback-luxury-villa.jpg"
  }
  if (type.includes("hotel")) {
    return "/images/fallback-luxury-hotel.jpg"
  }
  if (type.includes("apartment")) {
    return "/images/fallback-luxury-apartment.jpg"
  }
  if (type.includes("resort")) {
    return "/images/fallback-luxury-resort.jpg"
  }
  return "/images/fallback-luxury-property.jpg"
}

function normalizeImageUrl(url: string): string {
  if (!url || url === "undefined" || url === "null") return ""

  // Handle relative URLs
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url
  }

  // Handle protocol-relative URLs
  if (url.startsWith("//")) {
    return `https:${url}`
  }

  // Handle URLs without protocol
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    return `https://${url}`
  }

  return url
}

function isValidImageUrl(url: string): boolean {
  if (!url || url.trim() === "") return false
  if (url === "undefined" || url === "null") return false
  if (url.includes("favicon.ico")) return false
  if (url.includes("spinner") && url.includes(".gif")) return false

  // Accept any URL that starts with http, https, or / (relative)
  const normalized = normalizeImageUrl(url)
  return normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/")
}

export function DynamicImage({
  src,
  alt = "",
  width = 600,
  height = 400,
  fill = false,
  sizes,
  className = "",
  priority = false,
  fallbackSrc,
  propertyType,
  enableGallery = false,
  transformations,
  onImageError,
}: DynamicImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Normalize src to array
  const imageArray = Array.isArray(src)
    ? src
        .filter((img) => img && typeof img === "string")
        .map(normalizeImageUrl)
        .filter(isValidImageUrl)
    : src
      ? [normalizeImageUrl(src)].filter(isValidImageUrl)
      : []

  const fallback = fallbackSrc || getFallbackImage(propertyType)

  // Get current image or fallback
  const currentImage = imageArray.length > 0 ? imageArray[currentIndex] : fallback

  const effectiveWidth = fill ? 1200 : width
  const effectiveHeight = fill ? 800 : height

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false)
    setCurrentIndex(0)
    setLoadedImages(new Set())
  }, [src])

  const handleError = () => {
    if (onImageError && currentImage) {
      onImageError(currentImage)
    }

    // Try next image in array
    if (currentIndex < imageArray.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setLoadedImages((prev) => new Set([...prev, currentIndex]))
  }

  const nextImage = () => {
    if (imageArray.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % imageArray.length)
    }
  }

  const prevImage = () => {
    if (imageArray.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length)
    }
  }

  const displaySrc = hasError || imageArray.length === 0 ? fallback : currentImage

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={displaySrc || "/placeholder.svg"}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className={`object-cover ${className}`}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
          quality={85}
        />

        {/* Gallery navigation */}
        {enableGallery && imageArray.length > 1 && !hasError && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
              aria-label="Next image"
            >
              →
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imageArray.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
              {imageArray.length > 5 && <span className="text-white text-xs ml-1">+{imageArray.length - 5}</span>}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        src={displaySrc || "/placeholder.svg"}
        alt={alt}
        width={effectiveWidth}
        height={effectiveHeight}
        className={`object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        quality={85}
      />

      {/* Gallery navigation for non-fill mode */}
      {enableGallery && imageArray.length > 1 && !hasError && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            →
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imageArray.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DynamicImage
