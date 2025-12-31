"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DynamicImage } from "./dynamic-image"

interface PropertyCarouselProps {
  images: string[]
  propertyName: string
}

export function PropertyCarousel({ images, propertyName }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const imageArray = Array.isArray(images)
    ? images
    : images
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img.length > 0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1))
  }

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (imageArray.length <= 1) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [currentIndex, imageArray.length])

  if (!imageArray.length) {
    return (
      <div className="relative w-full h-48 bg-slate-200 rounded-t-xl flex items-center justify-center">
        <span className="text-slate-500">No images available</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
      <DynamicImage
        src={imageArray[currentIndex]}
        alt={`${propertyName} - Image ${currentIndex + 1}`}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
        key={`${propertyName}-${currentIndex}-${imageArray[currentIndex]}`}
      />

      {imageArray.length > 1 && (
        <>
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next button */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imageArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
