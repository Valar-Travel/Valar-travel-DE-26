"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlightBookingModal } from "@/components/flight-booking-modal"
import { Plane, Clock, ExternalLink, Wifi, Utensils, Luggage } from "lucide-react"

interface FlightSegment {
  airline: string
  airlineCode: string
  flightNumber: string
  departure: {
    airport: string
    airportCode: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    airportCode: string
    city: string
    time: string
    date: string
  }
  duration: string
  aircraft: string
}

interface Flight {
  id: string
  price: number
  originalPrice?: number
  currency: string
  outbound: FlightSegment[]
  return?: FlightSegment[]
  totalDuration: string
  stops: number
  baggage: {
    carry: string
    checked: string
  }
  amenities: string[]
  affiliateLink: string
  bookingClass: string
  refundable: boolean
  changeable: boolean
}

interface FlightCardProps {
  flight: Flight
  tripType: "one-way" | "round-trip"
  passengers?: number
}

export function FlightCard({ flight, tripType, passengers = 1 }: FlightCardProps) {
  const savings = flight.originalPrice && flight.originalPrice > flight.price ? flight.originalPrice - flight.price : 0

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
      case "wi-fi":
        return <Wifi className="w-4 h-4" />
      case "meals":
      case "meal":
        return <Utensils className="w-4 h-4" />
      case "baggage":
      case "checked bag":
        return <Luggage className="w-4 h-4" />
      default:
        return <Plane className="w-4 h-4" />
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const FlightSegmentDisplay = ({ segments, label }: { segments: FlightSegment[]; label: string }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">{label}</h4>
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{segment.airlineCode}</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{segment.airline}</div>
              <div className="text-muted-foreground">{segment.flightNumber}</div>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <div className="font-bold">{formatTime(segment.departure.time)}</div>
              <div className="text-sm text-muted-foreground">{segment.departure.airportCode}</div>
              <div className="text-xs text-muted-foreground">{segment.departure.city}</div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="h-px bg-border flex-1"></div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {segment.duration}
              </div>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="text-center">
              <div className="font-bold">{formatTime(segment.arrival.time)}</div>
              <div className="text-sm text-muted-foreground">{segment.arrival.airportCode}</div>
              <div className="text-xs text-muted-foreground">{segment.arrival.city}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
              {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {flight.bookingClass}
            </Badge>
            {savings > 0 && <Badge className="bg-green-100 text-green-800">Save ${savings}</Badge>}
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {flight.currency}
              {flight.price}
            </div>
            {flight.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {flight.currency}
                {flight.originalPrice}
              </div>
            )}
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>

        <div className="space-y-6">
          <FlightSegmentDisplay segments={flight.outbound} label="Outbound" />

          {tripType === "round-trip" && flight.return && (
            <FlightSegmentDisplay segments={flight.return} label="Return" />
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Total: {flight.totalDuration}
              </div>
              <div className="flex items-center gap-1">
                <Luggage className="w-4 h-4" />
                {flight.baggage.carry} carry-on
              </div>
            </div>

            <div className="flex gap-2">
              {flight.refundable && (
                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                  Refundable
                </Badge>
              )}
              {flight.changeable && (
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                  Changeable
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {flight.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                {amenity}
              </div>
            ))}
            {flight.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{flight.amenities.length - 3} more
              </Badge>
            )}
          </div>

          <FlightBookingModal flight={flight} tripType={tripType} passengers={passengers}>
            <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Book Flight
            </Button>
          </FlightBookingModal>
        </div>
      </CardContent>
    </Card>
  )
}
