"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ videoId, title = "Video", className = "" }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div className={`relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer group" onClick={handleLoad}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="relative z-10 bg-red-600 hover:bg-red-700 transition-colors rounded-full p-4 group-hover:scale-110 transform duration-200">
            <Play className="h-8 w-8 text-white fill-current ml-1" />
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}
