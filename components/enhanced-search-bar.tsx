"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Search, MapPin, Loader2 } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchBarProps {
  onSearch: (city: string, checkIn: Date | undefined, checkOut: Date | undefined) => void
  className?: string
  placeholder?: string
  showSuggestions?: boolean
}

const popularDestinations = [
  "Barbados",
  "St. Lucia",
  "Jamaica",
  "St. Barthélemy",
  "Turks and Caicos",
  "Antigua and Barbuda",
  "Cayman Islands",
  "Grenada",
]

export function EnhancedSearchBar({
  onSearch,
  className,
  placeholder = "Where do you want to go?",
  showSuggestions = true,
}: SearchBarProps) {
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [showDestinations, setShowDestinations] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const debouncedCity = useDebounce(city, 300)

  const filteredDestinations = useMemo(() => {
    if (!debouncedCity || debouncedCity.length < 2) return []
    return popularDestinations.filter((dest) => dest.toLowerCase().includes(debouncedCity.toLowerCase())).slice(0, 5)
  }, [debouncedCity])

  const handleSearch = useCallback(async () => {
    if (!city.trim()) return

    setIsSearching(true)
    try {
      await onSearch(city, checkIn, checkOut)
    } finally {
      setIsSearching(false)
      setShowDestinations(false)
    }
  }, [city, checkIn, checkOut, onSearch])

  const handleDestinationSelect = (destination: string) => {
    setCity(destination)
    setShowDestinations(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 bg-card rounded-lg border shadow-sm", className)}>
      <div className="relative flex-1">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setShowDestinations(showSuggestions && e.target.value.length > 0)
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowDestinations(showSuggestions && city.length > 0)}
            className="h-11 sm:h-12 pl-10 text-black placeholder:text-gray-500 text-sm sm:text-base"
          />
        </div>

        {showDestinations && filteredDestinations.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
            {filteredDestinations.map((destination, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b last:border-b-0 flex items-center gap-2"
                onClick={() => handleDestinationSelect(destination)}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {destination}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex gap-2 flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 sm:w-[140px] justify-start text-left font-normal h-11 sm:h-12 text-black text-sm sm:text-base",
                  !checkIn && "text-slate-700",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{checkIn ? format(checkIn, "MMM dd") : "Check in"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 sm:w-[140px] justify-start text-left font-normal h-11 sm:h-12 text-black text-sm sm:text-base",
                  !checkOut && "text-slate-700",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{checkOut ? format(checkOut, "MMM dd") : "Check out"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!city.trim() || isSearching}
          className="h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
        >
          {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {!city && (
        <div className="flex flex-wrap gap-2 sm:hidden">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {popularDestinations.slice(0, 3).map((dest) => (
            <Badge
              key={dest}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
              onClick={() => handleDestinationSelect(dest)}
            >
              {dest.split(",")[0]}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
