"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PricingCardProps {
  plan: {
    id: string
    name: string
    description: string
    price: number
    interval: string
    stripe_price_id: string
    features: string[]
  }
  isPopular?: boolean
}

export function PricingCard({ plan, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
        }),
      })

      const { sessionId } = await response.json()

      const publishableKey = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : null

      if (!publishableKey) {
        console.error("Stripe publishable key not found")
        return
      }

      // Redirect to Stripe Checkout
      const stripe = (await import("@stripe/stripe-js")).loadStripe(publishableKey)
      const stripeInstance = await stripe
      await stripeInstance?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative ${isPopular ? "border-blue-500 shadow-lg" : ""}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-gray-600">/{plan.interval}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={loading}
          variant={isPopular ? "default" : "outline"}
        >
          {loading ? "Processing..." : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  )
}
