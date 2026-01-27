"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  CalendarIcon,
  Users,
  MapPin,
  CreditCard,
  Check,
  ArrowLeft,
  Bed,
  Bath,
  Shield,
  Clock,
  Star,
  Percent,
  CircleDollarSign,
  CalendarCheck,
  Wifi,
  Waves,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react"
import { format } from "date-fns"
import { createCheckoutSession } from "./actions"
import { cn } from "@/lib/utils"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface VillaData {
  id: string
  name: string
  location: string
  description: string
  pricePerNight: number
  currency: string
  maxGuests: number
  bedrooms: number | null
  bathrooms: number | null
  amenities: string[]
  images: string[]
  rating: number | null
}

interface CheckoutClientProps {
  villa: VillaData
}

type PaymentTier = "30" | "50" | "70"
type Step = "dates" | "payment-tier" | "checkout" | "success"

const PAYMENT_TIERS: {
  id: PaymentTier
  label: string
  percentage: number
  description: string
  badge?: string
  features: string[]
}[] = [
  {
    id: "30",
    label: "Reserve Your Dates",
    percentage: 30,
    description: "Secure your booking with a 30% deposit",
    features: [
      "Lock in current pricing",
      "Free cancellation up to 60 days",
      "Pay remaining 70% 30 days before arrival",
    ],
  },
  {
    id: "50",
    label: "Standard Payment",
    percentage: 50,
    description: "Pay half now, half later",
    badge: "Most Popular",
    features: [
      "Balanced payment approach",
      "Free cancellation up to 45 days",
      "Pay remaining 50% 14 days before arrival",
    ],
  },
  {
    id: "70",
    label: "Premium Commitment",
    percentage: 70,
    description: "Larger deposit for extra perks",
    badge: "Best Value",
    features: ["Priority room assignment", "Early check-in (subject to availability)", "Final 30% due on arrival"],
  },
]

export function CheckoutClient({ villa }: CheckoutClientProps) {
  const [step, setStep] = useState<Step>("dates")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)
  const [paymentTier, setPaymentTier] = useState<PaymentTier>("50")
  const [error, setError] = useState("")

  const nights =
    checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = villa.pricePerNight * nights
  const selectedTier = PAYMENT_TIERS.find((t) => t.id === paymentTier)!
  const depositAmount = Math.round((totalPrice * selectedTier.percentage) / 100)
  const remainingAmount = totalPrice - depositAmount

  const currencySymbol =
    villa.currency === "USD" ? "$" : villa.currency === "EUR" ? "€" : villa.currency === "GBP" ? "£" : "$"

  const startCheckout = useCallback(async () => {
    if (!checkIn || !checkOut) return null

    return createCheckoutSession({
      villaId: villa.id,
      villaName: villa.name,
      location: villa.location,
      checkIn: checkIn.toISOString().split("T")[0],
      checkOut: checkOut.toISOString().split("T")[0],
      guests,
      pricePerNight: villa.pricePerNight,
      currency: villa.currency,
      paymentTierPercentage: selectedTier.percentage,
      depositAmount,
      totalAmount: totalPrice,
    })
  }, [villa, checkIn, checkOut, guests, selectedTier, depositAmount, totalPrice])

  const handleProceedToPaymentTier = () => {
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }
    if (nights < 1) {
      setError("Check-out must be after check-in")
      return
    }
    setError("")
    setStep("payment-tier")
  }

  const handleProceedToCheckout = () => {
    setStep("checkout")
  }

  const primaryImage =
    villa.images && villa.images.length > 0
      ? villa.images[0]
      : `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(villa.name + " luxury villa")}`

  const amenityIcons: Record<string, any> = {
    "High-Speed WiFi": Wifi,
    WiFi: Wifi,
    "Private Pool": Waves,
    Pool: Waves,
    "Private Chef Available": UtensilsCrossed,
    "Daily Housekeeping": Sparkles,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/villas/${villa.id}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {villa.name}
            </Link>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {["dates", "payment-tier", "checkout"].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step === s || (step === "success" && s === "checkout")
                        ? "bg-emerald-600 text-white"
                        : ["dates", "payment-tier", "checkout"].indexOf(step) > idx || step === "success"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {["dates", "payment-tier", "checkout"].indexOf(step) > idx || step === "success" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 2 && <div className="w-12 h-0.5 bg-slate-200 mx-2" />}
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">Secure Checkout</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Dates */}
            {step === "dates" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-emerald-600" />
                    Select Your Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Check-in Date */}
                    <div>
                      <Label className="text-sm font-medium">Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start mt-1.5 h-12 bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                            {checkIn ? format(checkIn, "PPP") : "Select date"}
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

                    {/* Check-out Date */}
                    <div>
                      <Label className="text-sm font-medium">Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start mt-1.5 h-12 bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                            {checkOut ? format(checkOut, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Label className="text-sm font-medium">Number of Guests</Label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-2 flex-1">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <Input
                          type="number"
                          min="1"
                          max={villa.maxGuests}
                          value={guests}
                          onChange={(e) => setGuests(Math.min(Number(e.target.value), villa.maxGuests))}
                          className="h-12"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">max {villa.maxGuests}</span>
                    </div>
                  </div>

                  {/* Price Preview */}
                  {nights > 0 && (
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          {currencySymbol}
                          {villa.pricePerNight.toLocaleString()} x {nights} night{nights > 1 ? "s" : ""}
                        </span>
                        <span className="font-medium">
                          {currencySymbol}
                          {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-emerald-700">
                          {currencySymbol}
                          {totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  <Button
                    onClick={handleProceedToPaymentTier}
                    disabled={!checkIn || !checkOut || nights < 1}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Continue to Payment Options
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Tier Selection */}
            {step === "payment-tier" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-600" />
                    Choose Your Payment Plan
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select how much you'd like to pay now. The remaining balance will be due closer to your arrival.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentTier}
                    onValueChange={(value) => setPaymentTier(value as PaymentTier)}
                    className="space-y-4"
                  >
                    {PAYMENT_TIERS.map((tier) => {
                      const tierDeposit = Math.round((totalPrice * tier.percentage) / 100)
                      const tierRemaining = totalPrice - tierDeposit

                      return (
                        <div key={tier.id}>
                          <label
                            htmlFor={tier.id}
                            className={cn(
                              "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                              paymentTier === tier.id
                                ? "border-emerald-600 bg-emerald-50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value={tier.id} id={tier.id} className="mt-1" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg">{tier.percentage}% Deposit</span>
                                    {tier.badge && (
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "text-xs",
                                          tier.badge === "Most Popular"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                        )}
                                      >
                                        {tier.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium mt-0.5">{tier.label}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-700">
                                  {currencySymbol}
                                  {tierDeposit.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">due today</p>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <ul className="space-y-2">
                                {tier.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                                <li className="flex items-center gap-2 text-sm font-medium">
                                  <CircleDollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  {currencySymbol}
                                  {tierRemaining.toLocaleString()} remaining after deposit
                                </li>
                              </ul>
                            </div>
                          </label>
                        </div>
                      )
                    })}
                  </RadioGroup>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep("dates")} className="flex-1 h-12 bg-transparent">
                      Back
                    </Button>
                    <Button
                      onClick={handleProceedToCheckout}
                      className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay {currencySymbol}
                      {depositAmount.toLocaleString()} Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Stripe Checkout */}
            {step === "checkout" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    Complete Payment
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're paying a {selectedTier.percentage}% deposit of {currencySymbol}
                    {depositAmount.toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Booking Summary */}
                  <div className="p-4 bg-slate-50 rounded-lg mb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={primaryImage}
                        alt={villa.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{villa.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {villa.location}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {checkIn && format(checkIn, "MMM d")} - {checkOut && format(checkOut, "MMM d, yyyy")} |{" "}
                          {nights} night{nights > 1 ? "s" : ""} | {guests} guest{guests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total booking</span>
                        <span>
                          {currencySymbol}
                          {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Due today ({selectedTier.percentage}%)</span>
                        <span>
                          {currencySymbol}
                          {depositAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Due later</span>
                        <span>
                          {currencySymbol}
                          {remainingAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Embedded Checkout */}
                  <div id="checkout">
                    {stripePromise ? (
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{
                          fetchClientSecret: startCheckout,
                          onComplete: () => setStep("success"),
                        }}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Payment processing is not configured.</p>
                        <p className="text-sm">Please contact us to complete your booking.</p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setStep("payment-tier")}
                    className="w-full mt-4"
                  >
                    Back to Payment Options
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Your reservation for {villa.name} has been confirmed. You will receive a confirmation email
                        shortly with all the details.
                      </p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-xl text-left max-w-md mx-auto">
                      <h3 className="font-semibold mb-4">Booking Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Property</span>
                          <span className="font-medium">{villa.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span>{villa.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in</span>
                          <span>{checkIn && format(checkIn, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-out</span>
                          <span>{checkOut && format(checkOut, "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests</span>
                          <span>{guests}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Paid Today</span>
                          <span className="text-emerald-700">
                            {currencySymbol}
                            {depositAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining Balance</span>
                          <span>
                            {currencySymbol}
                            {remainingAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/dashboard">View My Bookings</Link>
                      </Button>
                      <Button variant="outline" asChild className="bg-transparent">
                        <Link href="/villas">Browse More Villas</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Property Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={primaryImage}
                    alt={villa.name}
                    className="w-full h-full object-cover"
                  />
                  {villa.rating && (
                    <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
                      <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                      {villa.rating}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg">{villa.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {villa.location}
                  </p>

                  {/* Property Stats */}
                  {(villa.bedrooms || villa.bathrooms || villa.maxGuests) && (
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      {villa.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {villa.bedrooms} BR
                        </span>
                      )}
                      {villa.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {villa.bathrooms} BA
                        </span>
                      )}
                      {villa.maxGuests && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {villa.maxGuests}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Key Amenities */}
                  {villa.amenities && villa.amenities.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Key Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {villa.amenities.slice(0, 4).map((amenity, idx) => {
                          const Icon = amenityIcons[amenity] || Sparkles
                          return (
                            <Badge key={idx} variant="secondary" className="text-xs gap-1">
                              <Icon className="w-3 h-3" />
                              {amenity}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price per night</span>
                      <span className="font-semibold">
                        {currencySymbol}
                        {villa.pricePerNight.toLocaleString()}
                      </span>
                    </div>

                    {nights > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {nights} night{nights > 1 ? "s" : ""}
                          </span>
                          <span className="font-semibold">
                            {currencySymbol}
                            {totalPrice.toLocaleString()}
                          </span>
                        </div>

                        {step !== "dates" && (
                          <div className="pt-2 border-t mt-2">
                            <div className="flex justify-between items-center text-emerald-700">
                              <span className="text-sm font-medium">
                                Due today ({selectedTier.percentage}%)
                              </span>
                              <span className="text-lg font-bold">
                                {currencySymbol}
                                {depositAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Secure payment via Stripe</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-4 h-4 text-emerald-600" />
                      <span>Verified luxury properties</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
