"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Grid3X3, Share2, Heart, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface VillaImageGalleryProps {
  images: string[]
  villaName: string
  location?: string // Add location prop for better alt text
}

function filterValidImageUrls(images: string[]): string[] {
  if (!images || !Array.isArray(images)) return []

  return images.filter((img) => {
    if (!img || typeof img !== "string") return false
    if (img.trim() === "") return false
    if (img === "undefined" || img === "null") return false
    if (img.includes("favicon")) return false
    if (img.includes("logo") && img.length < 50) return false
    if (img.includes("icon") && !img.includes("iconography")) return false
    if (img.includes("spinner") || img.includes("loading")) return false

    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]
    const hasValidExtension = validExtensions.some((ext) => img.toLowerCase().includes(ext))

    return hasValidExtension || img.startsWith("/") || img.startsWith("http")
  })
}

export function VillaImageGallery({ images, villaName, location = "Caribbean" }: VillaImageGalleryProps) {
  const [showGalleryPopup, setShowGalleryPopup] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showLightbox, setShowLightbox] = useState(false)

  const filteredImages = filterValidImageUrls(images)
  const validatedImages = filteredImages.filter((img) => !failedImages.has(img))
  const displayImages = validatedImages.length > 0 ? validatedImages : ["/luxury-villa.png"]

  const handleImageError = (src: string) => {
    setFailedImages((prev) => new Set([...prev, src]))
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (selectedImage !== null) {
      if (isLeftSwipe) {
        setSelectedImage((prev) => (prev! + 1) % displayImages.length)
      } else if (isRightSwipe) {
        setSelectedImage((prev) => (prev! - 1 + displayImages.length) % displayImages.length)
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === "Escape") setSelectedImage(null)
        if (e.key === "ArrowRight") setSelectedImage((prev) => (prev! + 1) % displayImages.length)
        if (e.key === "ArrowLeft") setSelectedImage((prev) => (prev! - 1 + displayImages.length) % displayImages.length)
      } else if (showGalleryPopup && e.key === "Escape") {
        setShowGalleryPopup(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, showGalleryPopup, displayImages.length])

  const heroImages = displayImages.slice(0, 5)
  const hasMoreImages = displayImages.length > 5

  const createImageGroups = () => {
    const groups: { type: "full" | "pair"; images: { src: string; index: number }[] }[] = []
    let i = 0
    while (i < displayImages.length) {
      if (i < displayImages.length) {
        groups.push({ type: "full", images: [{ src: displayImages[i], index: i }] })
        i++
      }
      if (i < displayImages.length) {
        const pair: { src: string; index: number }[] = [{ src: displayImages[i], index: i }]
        i++
        if (i < displayImages.length) {
          pair.push({ src: displayImages[i], index: i })
          i++
        }
        groups.push({ type: "pair", images: pair })
      }
    }
    return groups
  }

  const imageGroups = createImageGroups()

  const getImageAlt = (index: number, context?: string) => {
    const contexts = [
      `${villaName} exterior view showing luxury architecture in ${location}`,
      `${villaName} interior living space with premium furnishings`,
      `${villaName} bedroom suite with elegant decor`,
      `${villaName} pool and outdoor entertainment area`,
      `${villaName} dining area with Caribbean views`,
      `${villaName} kitchen with modern amenities`,
      `${villaName} bathroom with luxury finishes`,
      `${villaName} terrace overlooking ${location} landscape`,
      `${villaName} garden and tropical surroundings`,
      `${villaName} sunset view from private balcony`,
    ]
    return context || contexts[index % contexts.length] || `${villaName} photo ${index + 1} in ${location}`
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setShowLightbox(true)
  }

  return (
    <div className="w-full">
      {/* Hero Gallery Grid - Improved mobile layout */}
      <div className="relative group">
        {/* Mobile: Single image with swipe indicator */}
        <div className="block md:hidden">
          <div
            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedImage(0)
              setShowLightbox(true)
            }}
          >
            <Image
              src={heroImages[0] || "/placeholder.svg"}
              alt={getImageAlt(0, `${villaName} main exterior view - luxury villa in ${location}`)}
              fill
              className="object-cover"
              priority
              onError={() => handleImageError(heroImages[0])}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Mobile photo count */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
              1 / {displayImages.length}
            </div>

            {/* Mobile show all button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm rounded-full text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setShowGalleryPopup(true)
              }}
            >
              <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
              View all
            </Button>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">
          {/* Main Large Image */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => {
              setSelectedImage(0)
              setShowLightbox(true)
            }}
          >
            <Image
              src={heroImages[0] || "/luxury-villa.png"}
              alt={getImageAlt(0, `${villaName} main exterior view - luxury villa in ${location}`)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              onError={() => handleImageError(0)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <ZoomIn className="w-6 h-6 text-foreground" />
              </div>
            </div>
          </div>

          {/* Right Side Images */}
          {heroImages.slice(1, 5).map((image, idx) => (
            <div
              key={idx}
              className={cn("relative cursor-pointer group", idx === 3 && hasMoreImages && "relative")}
              onClick={() => {
                setSelectedImage(idx + 1)
                setShowLightbox(true)
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={getImageAlt(idx + 1)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={() => handleImageError(idx + 1)}
              />
              {idx === 3 && hasMoreImages ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                  <div className="text-center text-white">
                    <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-lg font-semibold">+{displayImages.length - 5} more</span>
                    <p className="text-sm opacity-80">Show all photos</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <ZoomIn className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons - Better mobile positioning */}
        <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm h-9 px-3 md:h-9 md:px-4"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: villaName, url: window.location.href })
              }
            }}
          >
            <Share2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full shadow-lg backdrop-blur-sm transition-colors h-9 w-9",
              isLiked ? "bg-red-50 hover:bg-red-100 text-red-500" : "bg-white/95 hover:bg-white",
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Desktop photo count & show all */}
        <div className="hidden md:block absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
          {displayImages.length} photos
        </div>

        {hasMoreImages && (
          <Button
            variant="secondary"
            size="sm"
            className="hidden md:flex absolute bottom-4 right-4 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm rounded-full"
            onClick={() => setShowGalleryPopup(true)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Show all photos
          </Button>
        )}
      </div>

      {/* Gallery Popup - Better mobile experience */}
      <Dialog open={showGalleryPopup} onOpenChange={setShowGalleryPopup}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-white border-0 rounded-none [&>button]:hidden">
          <div className="h-screen flex flex-col overflow-hidden">
            {/* Header - Mobile-optimized header */}
            <div className="flex-shrink-0 bg-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b safe-area-inset-top">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-muted -ml-2 h-10 w-10"
                onClick={() => setShowGalleryPopup(false)}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-lg hover:bg-muted h-9 px-2 md:px-3"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: villaName, url: window.location.href })
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Share</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn("rounded-lg hover:bg-muted h-9 px-2 md:px-3", isLiked && "text-red-500")}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={cn("w-4 h-4 md:mr-2", isLiked && "fill-current")} />
                  <span className="hidden md:inline">Save</span>
                </Button>
              </div>
            </div>

            {/* Scrollable content - Mobile padding adjustments */}
            <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
              <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-12 py-4 md:py-8">
                <button
                  onClick={() => setShowGalleryPopup(false)}
                  className="mb-4 md:mb-8 flex items-center gap-1 text-foreground hover:underline"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </button>

                {/* Image groups - Single column on mobile */}
                <div className="space-y-2 md:space-y-3">
                  {imageGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className={group.type === "full" ? "" : "grid grid-cols-2 gap-3"}>
                      {group.type === "full" ? (
                        <div
                          className="relative w-full aspect-[16/10] rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => openLightbox(group.images[0].index)}
                        >
                          <Image
                            src={group.images[0].src || "/placeholder.svg"}
                            alt={getImageAlt(group.images[0].index)}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1024px"
                            loading="lazy"
                            onError={() => handleImageError(group.images[0].index)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                      ) : (
                        group.images.map((img) => (
                          <div
                            key={img.index}
                            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(img.index)}
                          >
                            <Image
                              src={img.src || "/placeholder.svg"}
                              alt={getImageAlt(img.index)}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              loading="lazy"
                              onError={() => handleImageError(img.index)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-8 md:h-12" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox - Mobile swipe support */}
      <Dialog open={showLightbox} onOpenChange={(open) => !open && setShowLightbox(false)}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-black/95 border-0">
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 md:top-4 right-3 md:right-4 z-50 text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => setShowLightbox(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image counter */}
            <div className="absolute top-3 md:top-4 left-3 md:left-4 z-50 text-white">
              <p className="text-sm font-medium">
                {(selectedImage ?? 0) + 1} / {displayImages.length}
              </p>
            </div>

            {/* Navigation arrows - Larger touch targets on mobile */}
            <button
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all flex items-center justify-center"
              onClick={() => setSelectedImage((prev) => (prev! - 1 + displayImages.length) % displayImages.length)}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all flex items-center justify-center"
              onClick={() => setSelectedImage((prev) => (prev! + 1) % displayImages.length)}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Main Image */}
            {selectedImage !== null && (
              <div className="relative w-full h-full max-w-6xl max-h-[80vh] md:max-h-[85vh] p-4 md:p-8">
                <Image
                  src={displayImages[selectedImage] || "/placeholder.svg"}
                  alt={getImageAlt(
                    selectedImage,
                    `${villaName} - Full size image ${selectedImage + 1} of ${displayImages.length}`,
                  )}
                  fill
                  className="object-contain"
                  priority
                  onError={() => handleImageError(selectedImage)}
                />
              </div>
            )}

            {/* Thumbnail strip - Hidden on mobile for cleaner experience */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex gap-2 justify-center overflow-x-auto max-w-5xl mx-auto pb-2">
                {displayImages.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                      selectedImage === idx
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black/50 opacity-100 scale-110"
                        : "opacity-50 hover:opacity-80",
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${villaName} thumbnail ${idx + 1} - click to view full size`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      onError={() => handleImageError(idx)}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile swipe indicator */}
            <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    selectedImage === idx ? "bg-white" : "bg-white/40",
                  )}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
