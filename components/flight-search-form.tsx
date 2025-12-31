"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Plane, Users, ArrowLeftRight } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface FlightSearchFormProps {
  onSearch: (searchData: FlightSearchData) => void
  className?: string
}

export interface FlightSearchData {
  tripType: "one-way" | "round-trip" | "multi-city"
  from: string
  to: string
  departDate: Date | undefined
  returnDate?: Date | undefined
  passengers: number
  class: "economy" | "premium" | "business" | "first"
}

export function FlightSearchForm({ onSearch, className }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("round-trip")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState(1)
  const [flightClass, setFlightClass] = useState<"economy" | "premium" | "business" | "first">("economy")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!from || !to || !departDate) {
      return
    }

    onSearch({
      tripType,
      from,
      to,
      departDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      class: flightClass,
    })
  }

  const swapAirports = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto bg-white shadow-lg", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
          <Plane className="w-5 h-5 text-green-700" />
          Search Flights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type Selection */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: "round-trip", label: "Round Trip" },
              { value: "one-way", label: "One Way" },
              { value: "multi-city", label: "Multi City" },
            ].map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={tripType === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTripType(option.value as any)}
                className={cn(
                  "text-sm",
                  tripType === option.value
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "text-slate-900 border-slate-300 hover:bg-slate-50",
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* From/To Airports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-slate-900 font-medium">
                From
              </Label>
              <Input
                id="from"
                placeholder="Departure city or airport"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="text-base text-slate-900"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={swapAirports}
              className="absolute left-1/2 top-8 -translate-x-1/2 z-10 bg-white border border-slate-300 shadow-sm hover:shadow-md hover:bg-slate-50 md:relative md:left-auto md:top-auto md:translate-x-0 md:w-auto md:h-auto md:p-2"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-900" />
              <span className="sr-only">Swap airports</span>
            </Button>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-slate-900 font-medium">
                To
              </Label>
              <Input
                id="to"
                placeholder="Destination city or airport"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="text-base text-slate-900"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-900 font-medium">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-slate-300",
                      !departDate && "text-slate-700",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departDate ? format(departDate) : "Select departure date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departDate}
                    onSelect={setDepartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {tripType === "round-trip" && (
              <div className="space-y-2">
                <Label className="text-slate-900 font-medium">Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-slate-300",
                        !returnDate && "text-slate-700",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate) : "Select return date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => date < (departDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-slate-900 font-medium">
                Passengers
              </Label>
              <Select value={passengers.toString()} onValueChange={(value) => setPassengers(Number.parseInt(value))}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue>
                    <div className="flex items-center gap-2 text-slate-900">
                      <Users className="w-4 h-4" />
                      {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="text-slate-900 font-medium">
                Class
              </Label>
              <Select value={flightClass} onValueChange={(value: any) => setFlightClass(value)}>
                <SelectTrigger className="border-slate-300">
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

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto md:px-8 bg-green-700 hover:bg-green-800 text-white"
          >
            <Plane className="w-4 h-4 mr-2" />
            Search Flights
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
