"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  quality?: number
  fallbackSrc?: string
  aspectRatio?: string
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  fallbackSrc,
  aspectRatio,
  onLoad,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)

  const containerStyle = aspectRatio ? { aspectRatio } : {}

  const imageSrc =
    hasError && fallbackSrc
      ? fallbackSrc
      : src || fallbackSrc || `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt)}`

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyle}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ objectFit: "cover" }}
        onError={() => setHasError(true)}
        onLoad={onLoad}
      />
    </div>
  )
}
