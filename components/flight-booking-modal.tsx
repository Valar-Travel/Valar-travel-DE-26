"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Shield, CreditCard, Clock, Plane } from "lucide-react"

interface Flight {
  id: string
  price: number
  originalPrice?: number
  currency: string
  totalDuration: string
  stops: number
  affiliateLink: string
  bookingClass: string
  refundable: boolean
  changeable: boolean
  outbound: any[]
  return?: any[]
}

interface FlightBookingModalProps {
  flight: Flight
  tripType: "one-way" | "round-trip"
  passengers: number
  children?: React.ReactNode
}

export function FlightBookingModal({ flight, tripType, passengers, children }: FlightBookingModalProps) {
  const [isTracking, setIsTracking] = useState(false)

  const totalPrice = flight.price * passengers
  const savings =
    flight.originalPrice && flight.originalPrice > flight.price ? (flight.originalPrice - flight.price) * passengers : 0

  const handleBookingClick = async () => {
    setIsTracking(true)

    // Track affiliate click
    try {
      await fetch("/api/tracking/affiliate-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: flight.id,
          price: totalPrice,
          passengers,
          tripType,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Tracking failed:", error)
    }

    // Add UTM parameters for better tracking
    const trackingParams = new URLSearchParams({
      utm_source: "valar_travel",
      utm_medium: "flight_search",
      utm_campaign: "flight_booking",
      utm_content: flight.id,
      passengers: passengers.toString(),
      trip_type: tripType,
    })

    const trackedLink = `${flight.affiliateLink}${flight.affiliateLink.includes("?") ? "&" : "?"}${trackingParams.toString()}`

    // Open in new tab with proper security
    window.open(trackedLink, "_blank", "noopener,noreferrer")

    setTimeout(() => setIsTracking(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-coral-600" />
            Complete Your Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flight Summary */}
          <Card className="bg-ocean-50/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-ocean-900">Flight Summary</h3>
                  <p className="text-sm text-ocean-600">
                    {tripType === "round-trip" ? "Round-trip" : "One-way"} • {passengers} passenger
                    {passengers > 1 ? "s" : ""}
                  </p>
                </div>
                <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
                  {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-ocean-600">Duration:</span>
                  <span className="ml-2 font-medium">{flight.totalDuration}</span>
                </div>
                <div>
                  <span className="text-ocean-600">Class:</span>
                  <span className="ml-2 font-medium">{flight.bookingClass}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-ocean-900 mb-4">Price Breakdown</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    Base fare ({passengers} passenger{passengers > 1 ? "s" : ""})
                  </span>
                  <span>
                    {flight.currency}
                    {flight.price} × {passengers}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>
                      -{flight.currency}
                      {savings}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-coral-600">
                    {flight.currency}
                    {totalPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure booking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Multiple payment options</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>24/7 customer support</span>
            </div>
          </div>

          {/* Booking Policies */}
          <div className="flex gap-2 justify-center">
            {flight.refundable && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Refundable
              </Badge>
            )}
            {flight.changeable && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Changeable
              </Badge>
            )}
          </div>

          {/* Book Button */}
          <Button
            className="w-full bg-coral-500 hover:bg-coral-600 text-white py-6 text-lg"
            onClick={handleBookingClick}
            disabled={isTracking}
          >
            {isTracking ? (
              "Redirecting..."
            ) : (
              <>
                <ExternalLink className="w-5 h-5 mr-2" />
                Book Now for {flight.currency}
                {totalPrice}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You'll be redirected to our trusted partner to complete your booking securely. Prices may vary based on
            availability.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
