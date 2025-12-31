"use client"

import Image from "next/image"

type DynamicImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  fallbackSrc?: string
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
}: DynamicImageProps) {
  const effectiveWidth = fill ? 1200 : width
  const effectiveHeight = fill ? 800 : height

  const normalizedSrc = src || fallbackSrc || "/placeholder.svg"

  if (fill) {
    return (
      <Image
        src={normalizedSrc || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={normalizedSrc || "/placeholder.svg"}
      alt={alt}
      width={effectiveWidth}
      height={effectiveHeight}
      className={className}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
    />
  )
}

export default DynamicImage
