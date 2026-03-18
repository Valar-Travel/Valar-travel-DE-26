"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createVillaBookingSession } from "@/app/actions/villa-booking"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  Users,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Plane,
  Car,
  Ship,
  Utensils,
  Phone,
  MessageCircle,
  Mail,
  Sparkles,
  ShieldCheck,
  X,
  Clock,
} from "lucide-react"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface LuxuryBookingFormProps {
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

type Step = "dates" | "arrival" | "travel" | "personalization" | "checkout" | "success"

const steps: { id: Step; label: string; subtitle: string }[] = [
  { id: "dates", label: "Your Stay", subtitle: "When will you be joining us?" },
  { id: "arrival", label: "Arrival", subtitle: "Concierge & Logistics" },
  { id: "travel", label: "Journey", subtitle: "Ground & Air" },
  { id: "personalization", label: "Personal", subtitle: "The Luxe Touch" },
  { id: "checkout", label: "Confirm", subtitle: "Complete Your Booking" },
]

export function LuxuryBookingForm({ isOpen, onClose, villa }: LuxuryBookingFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>("dates")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)
  const [error, setError] = useState("")

  // Arrival preferences
  const [arrivalAssistance, setArrivalAssistance] = useState<string>("none")
  const [diningReservations, setDiningReservations] = useState(false)
  const [diningPreferences, setDiningPreferences] = useState("")

  // Travel preferences
  const [privateAviation, setPrivateAviation] = useState(false)
  const [tailNumber, setTailNumber] = useState("")
  const [chauffeurService, setChauffeurService] = useState<string>("none")
  const [islandHopping, setIslandHopping] = useState<string>("none")

  // Personalization
  const [mustHaves, setMustHaves] = useState("")
  const [contactMethod, setContactMethod] = useState<string>("whatsapp")

  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0
  const totalPrice = villa.pricePerNight * nights

  const currencySymbol =
    villa.currency === "USD" ? "$" : villa.currency === "EUR" ? "€" : villa.currency === "GBP" ? "£" : "$"

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

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
      // Additional concierge data
      metadata: {
        arrivalAssistance,
        diningReservations,
        diningPreferences,
        privateAviation,
        tailNumber,
        chauffeurService,
        islandHopping,
        mustHaves,
        contactMethod,
      },
    })
  }, [
    villa,
    checkIn,
    checkOut,
    guests,
    arrivalAssistance,
    diningReservations,
    diningPreferences,
    privateAviation,
    tailNumber,
    chauffeurService,
    islandHopping,
    mustHaves,
    contactMethod,
  ])

  const goToNextStep = () => {
    if (currentStep === "dates") {
      if (!checkIn || !checkOut) {
        setError("Please select check-in and check-out dates")
        return
      }
      if (nights < 1) {
        setError("Check-out must be after check-in")
        return
      }
      setError("")
      setCurrentStep("arrival")
    } else if (currentStep === "arrival") {
      setCurrentStep("travel")
    } else if (currentStep === "travel") {
      setCurrentStep("personalization")
    } else if (currentStep === "personalization") {
      setCurrentStep("checkout")
    }
  }

  const goToPrevStep = () => {
    if (currentStep === "arrival") setCurrentStep("dates")
    else if (currentStep === "travel") setCurrentStep("arrival")
    else if (currentStep === "personalization") setCurrentStep("travel")
    else if (currentStep === "checkout") setCurrentStep("personalization")
  }

  const handleClose = () => {
    setCurrentStep("dates")
    setCheckIn(undefined)
    setCheckOut(undefined)
    setGuests(2)
    setError("")
    setArrivalAssistance("none")
    setDiningReservations(false)
    setDiningPreferences("")
    setPrivateAviation(false)
    setTailNumber("")
    setChauffeurService("none")
    setIslandHopping("none")
    setMustHaves("")
    setContactMethod("whatsapp")
    onClose()
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header with Progress */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
                {steps.find((s) => s.id === currentStep)?.subtitle}
              </p>
              <h2 className="text-xl font-semibold tracking-tight mt-1">
                {steps.find((s) => s.id === currentStep)?.label}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  idx <= currentStepIndex ? "bg-emerald-600" : "bg-neutral-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait" custom={1}>
            {/* Step 1: Dates */}
            {currentStep === "dates" && (
              <motion.div
                key="dates"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5"
              >
                {/* Property Card */}
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                  {villa.image && (
                    <img
                      src={villa.image}
                      alt={villa.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{villa.name}</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {villa.location}
                    </p>
                    <p className="text-emerald-600 font-semibold mt-1">
                      {currencySymbol}
                      {villa.pricePerNight.toLocaleString()}/night
                    </p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                      Arrival
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12 bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                          {checkIn ? format(checkIn, "MMM d") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                      Departure
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12 bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                          {checkOut ? format(checkOut, "MMM d") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) =>
                            date < new Date() || (checkIn ? date <= checkIn : false)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <Label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
                    Traveling Party
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    <Users className="w-5 h-5 text-neutral-400" />
                    <Input
                      type="number"
                      min="1"
                      max={villa.maxGuests}
                      value={guests}
                      onChange={(e) =>
                        setGuests(Math.min(Number(e.target.value), villa.maxGuests))
                      }
                      className="flex-1 border-0 bg-transparent text-lg font-medium focus-visible:ring-0"
                    />
                    <span className="text-sm text-neutral-400">of {villa.maxGuests} max</span>
                  </div>
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">
                        {nights} night{nights > 1 ? "s" : ""}
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        {currencySymbol}
                        {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              </motion.div>
            )}

            {/* Step 2: Arrival */}
            {currentStep === "arrival" && (
              <motion.div
                key="arrival"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    May we assist with your arrival arrangements?
                  </Label>
                  <RadioGroup
                    value={arrivalAssistance}
                    onValueChange={setArrivalAssistance}
                    className="space-y-2"
                  >
                    {[
                      { value: "vip", label: "VIP Airport Fast-track", icon: Plane },
                      { value: "transfer", label: "Hotel Transfer", icon: Car },
                      { value: "none", label: "No assistance needed", icon: null },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          arrivalAssistance === option.value
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        {option.icon && <option.icon className="w-5 h-5 text-emerald-600" />}
                        <span className="flex-1 font-medium">{option.label}</span>
                        {arrivalAssistance === option.value && (
                          <Check className="w-5 h-5 text-emerald-600" />
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">
                      Shall we manage your dining and event reservations?
                    </Label>
                    <Switch
                      checked={diningReservations}
                      onCheckedChange={setDiningReservations}
                    />
                  </div>
                  <AnimatePresence>
                    {diningReservations && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Textarea
                          value={diningPreferences}
                          onChange={(e) => setDiningPreferences(e.target.value)}
                          placeholder="Any specific preferences or celebrations?"
                          className="mt-3 resize-none bg-neutral-50 border-neutral-200"
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Step 3: Travel */}
            {currentStep === "travel" && (
              <motion.div
                key="travel"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">
                      Will you be arriving via private aviation?
                    </Label>
                    <Switch checked={privateAviation} onCheckedChange={setPrivateAviation} />
                  </div>
                  <AnimatePresence>
                    {privateAviation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          value={tailNumber}
                          onChange={(e) => setTailNumber(e.target.value)}
                          placeholder="Tail Number / FBO Preference (Optional)"
                          className="mt-3 bg-neutral-50 border-neutral-200"
                        />
                        <Button variant="link" className="mt-2 p-0 h-auto text-emerald-600">
                          Request a Charter Quote
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Do you require chauffeur service throughout your stay?
                  </Label>
                  <RadioGroup
                    value={chauffeurService}
                    onValueChange={setChauffeurService}
                    className="space-y-2"
                  >
                    {[
                      { value: "fulltime", label: "Full-time dedicated driver" },
                      { value: "transfers", label: "Point-to-point transfers" },
                      { value: "none", label: "No chauffeur needed" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          chauffeurService === option.value
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <Car className="w-5 h-5 text-emerald-600" />
                        <span className="flex-1 font-medium">{option.label}</span>
                        {chauffeurService === option.value && (
                          <Check className="w-5 h-5 text-emerald-600" />
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Are you planning to explore the archipelago?
                  </Label>
                  <RadioGroup
                    value={islandHopping}
                    onValueChange={setIslandHopping}
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { value: "yacht", label: "Private Yacht", icon: Ship },
                      { value: "helicopter", label: "Helicopter", icon: Plane },
                      { value: "seaplane", label: "Seaplane", icon: Plane },
                      { value: "none", label: "Not planned", icon: null },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          islandHopping === option.value
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        {option.icon && <option.icon className="w-6 h-6 text-emerald-600" />}
                        <span className="text-sm font-medium text-center">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 4: Personalization */}
            {currentStep === "personalization" && (
              <motion.div
                key="personalization"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Are there any specific must-haves for your itinerary?
                  </Label>
                  <Textarea
                    value={mustHaves}
                    onChange={(e) => setMustHaves(e.target.value)}
                    placeholder="e.g., On-board massage, Specific vintage of Champagne, Childcare..."
                    className="resize-none bg-neutral-50 border-neutral-200"
                    rows={4}
                  />
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Preferred method of contact for your dedicated concierge?
                  </Label>
                  <RadioGroup
                    value={contactMethod}
                    onValueChange={setContactMethod}
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                      { value: "signal", label: "Signal", icon: Phone },
                      { value: "email", label: "Email", icon: Mail },
                      { value: "assistant", label: "Personal Assistant", icon: Users },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          contactMethod === option.value
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <option.icon className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Summary */}
                <div className="p-4 bg-neutral-50 rounded-xl space-y-2 text-sm">
                  <p className="font-semibold text-neutral-700">Your Booking Summary</p>
                  <div className="space-y-1 text-neutral-600">
                    <p>
                      {villa.name} - {villa.location}
                    </p>
                    <p>
                      {checkIn && format(checkIn, "MMM d")} -{" "}
                      {checkOut && format(checkOut, "MMM d, yyyy")}
                    </p>
                    <p>
                      {guests} guest{guests > 1 ? "s" : ""} - {nights} night{nights > 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-emerald-700 pt-2">
                    Total: {currencySymbol}
                    {totalPrice.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Checkout */}
            {currentStep === "checkout" && (
              <motion.div
                key="checkout"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {stripePromise ? (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{
                      fetchClientSecret: startCheckout,
                      onComplete: () => setCurrentStep("success"),
                    }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">Payment processing is not configured.</p>
                    <p className="text-sm text-neutral-400">
                      Please contact us to complete your booking.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Success */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Booking Confirmed</h3>
                  <p className="text-neutral-500 mt-2">
                    Your dedicated concierge will be in touch within 24 hours.
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {currentStep !== "success" && currentStep !== "checkout" && (
          <div className="px-6 pb-6 pt-2 border-t border-neutral-100">
            <div className="flex gap-3">
              {currentStep !== "dates" && (
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="flex-1 h-12 border-neutral-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={goToNextStep}
                disabled={currentStep === "dates" && (!checkIn || !checkOut || nights < 1)}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
              >
                {currentStep === "personalization" ? "Proceed to Payment" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Trust Signals */}
            {currentStep === "dates" && (
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  Free cancellation
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Instant confirm
                </span>
              </div>
            )}
          </div>
        )}

        {currentStep === "checkout" && (
          <div className="px-6 pb-6">
            <Button variant="ghost" onClick={goToPrevStep} className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Summary
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
