"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionFormProps {
  cities: Array<{ name: string }>
}

export function SubscriptionForm({ cities }: SubscriptionFormProps) {
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city: city || null }),
      })

      if (response.ok) {
        toast({
          title: "Subscribed successfully!",
          description: "You'll receive the best travel deals in your inbox.",
        })
        setEmail("")
        setCity("all")
      } else {
        throw new Error("Subscription failed")
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Mail className="w-5 h-5" />
          Never Miss a Deal
        </CardTitle>
        <p className="text-primary-foreground/80 text-sm sm:text-base">
          Get exclusive travel deals delivered to your inbox
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-primary-foreground text-foreground h-11 sm:h-12"
          />

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="bg-primary-foreground text-foreground h-11 sm:h-12">
              <SelectValue placeholder="Select a city (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((cityItem) => (
                <SelectItem key={cityItem.name} value={cityItem.name}>
                  {cityItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-11 sm:h-12 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
