"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"

interface GoogleMapsProps {
  address: string
  city: string
  lat?: number
  lng?: number
  zoom?: number
  className?: string
}

export function GoogleMaps({ address, city, lat, lng, zoom = 15, className = "" }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState({ lat: lat || 48.8566, lng: lng || 2.3522 })

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!lat || !lng) {
        try {
          const response = await fetch(`/api/geocode?address=${encodeURIComponent(`${address}, ${city}`)}`)
          if (response.ok) {
            const data = await response.json()
            if (data.lat && data.lng) {
              setCoordinates({ lat: data.lat, lng: data.lng })
            }
          }
        } catch (error) {
          console.warn("Failed to fetch coordinates, using defaults")
        }
      }
    }

    fetchCoordinates()
  }, [address, city, lat, lng])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <div>
          <h4 className="font-medium">Location</h4>
          <p className="text-sm text-gray-600">
            {address}, {city}
          </p>
        </div>
      </div>

      <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{city}</h3>
            <p className="text-sm text-gray-600">{address}</p>
            {coordinates.lat && coordinates.lng && (
              <p className="text-xs text-gray-500 mt-1">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
            <Navigation className="w-4 h-4" />
            Premium location in {city}
          </div>
        </div>

        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-6 left-6 w-6 h-6 bg-green-200 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-4 w-4 h-4 bg-blue-300 rounded-full opacity-30"></div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">Exact location details available during booking process</p>
      </div>
    </div>
  )
}
