"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"
import { DynamicImage } from "@/components/dynamic-image"
import { useRouter } from "next/navigation"

interface CityCardProps {
  city: {
    id: string
    name: string
    starting_price: number
    image_url: string
  }
  onSelect?: (cityName: string) => void
}

export function CityCard({ city, onSelect }: CityCardProps) {
  const router = useRouter()

  const handleCitySelect = () => {
    const cityRoutes: { [key: string]: string } = {
      Barbados: "/destinations/barbados",
      "St. Lucia": "/destinations/st-lucia",
      Jamaica: "/destinations/jamaica",
      "St. Barthélemy": "/destinations/st-barthelemy",
      Antigua: "/destinations/antigua",
      "Turks and Caicos": "/destinations/turks-and-caicos",
      Bahamas: "/destinations/bahamas",
      "Cayman Islands": "/destinations/cayman-islands",
    }

    const route = cityRoutes[city.name]
    if (route) {
      router.push(route)
    }

    if (onSelect) {
      onSelect(city.name)
    }
  }

  const getFallbackImage = (cityName: string) => {
    const cityImages: { [key: string]: string } = {
      Barbados: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "St. Lucia": "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=300&fit=crop",
      Jamaica: "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400&h=300&fit=crop",
      "St. Barthélemy": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&h=300&fit=crop",
      Antigua: "https://images.unsplash.com/photo-1580541631950-7282082b03fe?w=400&h=300&fit=crop",
      "Turks and Caicos": "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=400&h=300&fit=crop",
      Bahamas: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&h=300&fit=crop",
      "Cayman Islands": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
    }
    return cityImages[cityName] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative h-56 w-full">
        <DynamicImage
          src={city.image_url || getFallbackImage(city.name)}
          alt={`${city.name} travel destination`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          fallbackSrc={getFallbackImage(city.name)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
            <h3 className="text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{city.name}</h3>
            <p className="text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">From ${city.starting_price}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <Button
          onClick={handleCitySelect}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
        >
          <Plane className="w-4 h-4" />
          View Deals
        </Button>
      </CardContent>
    </Card>
  )
}
