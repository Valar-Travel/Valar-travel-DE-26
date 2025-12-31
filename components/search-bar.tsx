"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (city: string, checkIn: Date | undefined, checkOut: Date | undefined) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  const handleSearch = () => {
    onSearch(city, checkIn, checkOut)
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 bg-card rounded-lg border shadow-sm">
      <div className="flex-1">
        <Input
          placeholder="Where do you want to go?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-11 sm:h-12 text-black placeholder:text-gray-500 text-sm sm:text-base"
        />
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
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
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
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleSearch} className="h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  )
}
