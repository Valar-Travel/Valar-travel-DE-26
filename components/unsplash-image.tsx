"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useUnsplash } from "@/hooks/use-unsplash"
import { getImageQueryForContext } from "@/lib/unsplash-image-mapper"

interface UnsplashImageProps {
  context: string
  section?: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallbackUrl?: string
}

export function UnsplashImage({
  context,
  section,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  fallbackUrl,
}: UnsplashImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(fallbackUrl || "")
  const [isLoading, setIsLoading] = useState(true)

  const query = getImageQueryForContext(context, section)

  const { data: searchResults, isLoading: isFetching } = useUnsplash(
    query ? { query, perPage: 1, orientation: "landscape" } : null,
  )

  useEffect(() => {
    if (searchResults?.results && searchResults.results.length > 0) {
      const photo = searchResults.results[0]
      const url = width > 1200 ? photo.urls.full : width > 800 ? photo.urls.regular : photo.urls.small
      setImageUrl(url)
      setIsLoading(false)
    } else if (!isFetching && fallbackUrl) {
      setImageUrl(fallbackUrl)
      setIsLoading(false)
    }
  }, [searchResults, isFetching, fallbackUrl, width])

  if (isLoading || !imageUrl) {
    return (
      <div className={`bg-muted animate-pulse ${className}`} style={{ width, height }}>
        <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        if (fallbackUrl) {
          setImageUrl(fallbackUrl)
        }
      }}
    />
  )
}
