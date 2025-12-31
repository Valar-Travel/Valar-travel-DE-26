"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

interface Property {
  name: string
  url: string
  price: string
  description: string
  rating: string
  reviews: string
  images: string
  coordinates?: { lat: number; lng: number }
  city?: string
}

interface PropertiesMapProps {
  properties: Property[]
  onPropertySelect?: (property: Property) => void
}

export function PropertiesMap({ properties, onPropertySelect }: PropertiesMapProps) {
  const [mounted, setMounted] = useState(false)
  const [defaultIcon, setDefaultIcon] = useState<Icon | null>(null)

  useEffect(() => {
    const icon = new Icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
    setDefaultIcon(icon)
    setMounted(true)
  }, [])

  if (!mounted || !defaultIcon) {
    return (
      <div className="w-full h-96 bg-slate-200 rounded-lg flex items-center justify-center">
        <span className="text-slate-500">Loading map...</span>
      </div>
    )
  }

  const defaultCenter: [number, number] = [35.6762, 139.6503]

  const propertiesWithCoords = properties.filter(
    (p) => p.coordinates && typeof p.coordinates.lat === "number" && typeof p.coordinates.lng === "number",
  )

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-200">
      <MapContainer center={defaultCenter} zoom={10} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {propertiesWithCoords.map((property, index) => (
          <Marker
            key={index}
            position={[property.coordinates!.lat, property.coordinates!.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onPropertySelect?.(property),
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <h4 className="font-semibold text-sm mb-1">{property.name}</h4>
                <p className="text-xs text-slate-700 mb-2 line-clamp-2">{property.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">€{property.price}</span>
                  {Number.parseFloat(property.rating) > 0 && (
                    <span className="text-xs text-yellow-600">⭐ {Number.parseFloat(property.rating).toFixed(1)}</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
