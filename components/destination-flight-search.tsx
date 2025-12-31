"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Plane, CalendarIcon, Users, ArrowRight } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface DestinationFlightSearchProps {
  destination: string
  destinationCode?: string
}

export default function DestinationFlightSearch({
  destination,
  destinationCode = "CDG",
}: DestinationFlightSearchProps) {
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState("2")
  const [flightClass, setFlightClass] = useState("economy")
  const [origin, setOrigin] = useState("")

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      from: origin,
      to: destinationCode,
      departure: departureDate ? format(departureDate, "yyyy-MM-dd") : "",
      return: returnDate ? format(returnDate, "yyyy-MM-dd") : "",
      passengers,
      class: flightClass,
    })

    window.open(`/flights/results?${searchParams.toString()}`, "_blank")
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-ocean-900">
          <Plane className="h-7 w-7 text-coral-600" />
          Flights to {destination}
          <Badge variant="outline" className="bg-coral-50 text-coral-700 border-coral-200">
            Best Prices
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-ocean-700 font-medium">
              From
            </Label>
            <Input
              id="origin"
              placeholder="Enter departure city"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="border-ocean-200 focus:border-coral-500"
            />
          </div>

          {/* Destination (pre-filled) */}
          <div className="space-y-2">
            <Label className="text-ocean-700 font-medium">To</Label>
            <div className="flex items-center gap-2 p-3 bg-coral-50 rounded-md border border-coral-200">
              <span className="font-medium text-coral-800">{destination}</span>
              <Badge variant="secondary" className="text-xs bg-coral-100 text-coral-700">
                {destinationCode}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="text-ocean-700 font-medium">Departure</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-ocean-200",
                    !departureDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <Label className="text-ocean-700 font-medium">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-ocean-200",
                    !returnDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < new Date() || (departureDate && date <= departureDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Passengers */}
          <div className="space-y-2">
            <Label className="text-ocean-700 font-medium">Passengers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="border-ocean-200">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Passenger" : "Passengers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div className="space-y-2">
            <Label className="text-ocean-700 font-medium">Class</Label>
            <Select value={flightClass} onValueChange={setFlightClass}>
              <SelectTrigger className="border-ocean-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className="w-full bg-coral-500 hover:bg-coral-600 text-white text-lg py-6"
          disabled={!origin || !departureDate}
        >
          Search Flights to {destination}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="text-center text-sm text-ocean-600">
          <p>✈️ Compare prices from multiple airlines</p>
          <p>💰 Best deals guaranteed with affiliate partnerships</p>
        </div>
      </CardContent>
    </Card>
  )
}
