"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createVillaBookingSession } from "@/app/actions/villa-booking"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Users, MapPin, CreditCard, Check } from "lucide-react"
import { format } from "date-fns"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface VillaCheckoutProps {
  isOpen: boolean
  onClose: () => void
  villa: {
    id: string
    name: string
    location: string
    pricePerNight: number
    currency: string
    maxGuests: number
    image?: string
  }
}

export function VillaCheckout({ isOpen, onClose, villa }: VillaCheckoutProps) {
  const [step, setStep] = useState<"dates" | "checkout" | "success">("dates")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const totalPrice = villa.pricePerNight * nights

  const currencySymbol = villa.currency === "USD" ? "$" : villa.currency === "EUR" ? "€" : villa.currency === "GBP" ? "£" : "$"

  const startCheckout = useCallback(async () => {
    if (!checkIn || !checkOut) return null
    
    return createVillaBookingSession({
      villaId: villa.id,
      villaName: villa.name,
      location: villa.location,
      checkIn: checkIn.toISOString().split("T")[0],
      checkOut: checkOut.toISOString().split("T")[0],
      guests,
      pricePerNight: villa.pricePerNight,
      currency: villa.currency,
    })
  }, [villa, checkIn, checkOut, guests])

  const handleProceedToCheckout = () => {
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }
    if (nights < 1) {
      setError("Check-out must be after check-in")
      return
    }
    setError("")
    setStep("checkout")
  }

  const handleClose = () => {
    setStep("dates")
    setCheckIn(undefined)
    setCheckOut(undefined)
    setGuests(2)
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={step === "checkout" ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            {step === "dates" && "Book Your Stay"}
            {step === "checkout" && "Complete Payment"}
            {step === "success" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "dates" && (
          <div className="space-y-4">
            {/* Property Info */}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              {villa.image && (
                <img
                  src={villa.image}
                  alt={villa.name}
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <div>
                <h4 className="font-medium">{villa.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {villa.location}
                </p>
                <p className="text-sm font-semibold text-emerald-600">
                  {currencySymbol}{villa.pricePerNight.toLocaleString()}/night
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
                    {checkIn ? format(checkIn, "PPP") : "Select date"}
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
                    {checkOut ? format(checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div>
              <Label>Number of Guests</Label>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  max={villa.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Math.min(Number(e.target.value), villa.maxGuests))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">max {villa.maxGuests}</span>
              </div>
            </div>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {currencySymbol}{villa.pricePerNight.toLocaleString()} x {nights} night{nights > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">{currencySymbol}{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-emerald-700">
                    {currencySymbol}{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button 
              onClick={handleProceedToCheckout} 
              disabled={!checkIn || !checkOut || nights < 1}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        )}

        {step === "checkout" && (
          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="font-medium">{villa.name}</p>
              <p className="text-muted-foreground">
                {checkIn && format(checkIn, "MMM d")} - {checkOut && format(checkOut, "MMM d, yyyy")} | {nights} night{nights > 1 ? "s" : ""} | {guests} guest{guests > 1 ? "s" : ""}
              </p>
              <p className="font-semibold text-emerald-700 mt-1">
                Total: {currencySymbol}{totalPrice.toLocaleString()}
              </p>
            </div>
            
            {/* Stripe Embedded Checkout */}
            <div id="checkout">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ 
                  fetchClientSecret: startCheckout,
                  onComplete: () => setStep("success")
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
            
            <Button variant="ghost" onClick={() => setStep("dates")} className="w-full">
              Back to Dates
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
              <p className="text-muted-foreground mt-2">
                Your booking for {villa.name} has been confirmed. You will receive a confirmation email shortly.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-left">
              <p><strong>Property:</strong> {villa.name}</p>
              <p><strong>Location:</strong> {villa.location}</p>
              <p><strong>Check-in:</strong> {checkIn && format(checkIn, "PPP")}</p>
              <p><strong>Check-out:</strong> {checkOut && format(checkOut, "PPP")}</p>
              <p><strong>Guests:</strong> {guests}</p>
              <p><strong>Total:</strong> {currencySymbol}{totalPrice.toLocaleString()}</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
