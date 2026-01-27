"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, MapPin } from "lucide-react"
import { format } from "@/lib/date-utils"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  deal: {
    id: string
    name: string
    city: string
    price: number
    image_url: string
    guest_capacity: number
  }
}

export function BookingModal({ isOpen, onClose, deal }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleBooking = async () => {
    const supabase = createClient()
    setLoading(true)
    setMessage("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("Please sign in to make a booking")
        setLoading(false)
        return
      }

      // Create saved trip entry
      const { error } = await supabase.from("saved_trips").insert({
        user_id: user.id,
        trip_name: `${deal.name} - ${deal.city}`,
        destination: deal.city,
        start_date: checkIn,
        end_date: checkOut,
        guest_count: guests,
        saved_deals: [deal.id],
        notes: `Booking for ${deal.name}`,
      })

      if (error) throw error

      // Track booking interaction
      await supabase.from("deal_interactions").insert({
        deal_id: deal.id,
        interaction_type: "booking_initiated",
        session_id: user.id,
      })

      setMessage("Booking saved! Check your dashboard for details.")
      setTimeout(() => {
        onClose()
        setMessage("")
      }, 2000)
    } catch (error) {
      setMessage("Error creating booking. Please try again.")
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={deal.image_url || "/placeholder.svg"}
              alt={deal.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <h4 className="font-medium">{deal.name}</h4>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {deal.city}
              </p>
            </div>
          </div>

          {/* Check-in Date */}
          <div>
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div>
            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <Label>Number of Guests</Label>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <Input
                type="number"
                min="1"
                max={deal.guest_capacity}
                value={guests}
                onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">max {deal.guest_capacity}</span>
            </div>
          </div>

          {/* Price Summary */}
          {checkIn && checkOut && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price</span>
                <span className="text-lg font-bold text-blue-600">
                  ${deal.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                ${deal.price}/night × {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                nights
              </p>
            </div>
          )}

          {message && (
            <p className={`text-sm text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}

          <Button onClick={handleBooking} disabled={!checkIn || !checkOut || loading} className="w-full">
            {loading ? "Saving Booking..." : "Save Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
