"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Clock, Building2, Users, Briefcase, CheckCircle } from "lucide-react"

const CONTACT_EMAIL = "hello@valartravel.de"
const CONTACT_PHONE = "+49 160 92527436"
const WHATSAPP_LINK = "https://wa.me/4916092527436"

export default function ContactClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formType: "guest" | "owner" | "partner") => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    // Extract common fields
    const { firstName, lastName, name: singleName, email, phone, message, ...additionalData } = data
    const name = singleName || `${firstName || ""} ${lastName || ""}`.trim()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          formType,
          additionalData,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Message sent!",
          description: result.message,
        })
        ;(e.target as HTMLFormElement).reset()

        // Reset submitted state after 10 seconds
        setTimeout(() => setSubmitted(false), 10000)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again or contact us directly.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-10 pb-10 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  <strong>Need immediate assistance?</strong>
                  <br />
                  Contact Sarah directly via WhatsApp for faster response.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    WhatsApp Us
                  </a>
                </Button>
                <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Whether you're planning your Caribbean escape, interested in listing your property, or exploring partnership
            opportunities, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>Choose your inquiry type and fill out the form below</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="guest" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="guest">
                      <Users className="w-4 h-4 mr-2" />
                      For Guests
                    </TabsTrigger>
                    <TabsTrigger value="owner">
                      <Building2 className="w-4 h-4 mr-2" />
                      Property Owners
                    </TabsTrigger>
                    <TabsTrigger value="partner">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Brand Partners
                    </TabsTrigger>
                  </TabsList>

                  {/* Guest Inquiry Form */}
                  <TabsContent value="guest">
                    <form onSubmit={(e) => handleSubmit(e, "guest")} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-firstName">First Name</Label>
                          <Input id="guest-firstName" name="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest-lastName">Last Name</Label>
                          <Input id="guest-lastName" name="lastName" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guest-email">Email</Label>
                        <Input id="guest-email" name="email" type="email" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guest-phone">Phone</Label>
                        <Input id="guest-phone" name="phone" type="tel" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guest-destination">Preferred Destination</Label>
                        <Input
                          id="guest-destination"
                          name="Preferred Destination"
                          placeholder="Barbados, St. Lucia, Jamaica, or St. Barthélemy"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-checkin">Check-in Date</Label>
                          <Input id="guest-checkin" name="Check-in Date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest-checkout">Check-out Date</Label>
                          <Input id="guest-checkout" name="Check-out Date" type="date" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guest-message">Message</Label>
                        <Textarea
                          id="guest-message"
                          name="message"
                          rows={4}
                          placeholder="Tell us about your ideal Caribbean villa experience..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Property Owner Form */}
                  <TabsContent value="owner">
                    <form onSubmit={(e) => handleSubmit(e, "owner")} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="owner-name">Full Name</Label>
                          <Input id="owner-name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="owner-email">Email</Label>
                          <Input id="owner-email" name="email" type="email" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="owner-phone">Phone</Label>
                        <Input id="owner-phone" name="phone" type="tel" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="owner-property">Property Name</Label>
                        <Input id="owner-property" name="Property Name" placeholder="Your villa or property name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="owner-location">Property Location</Label>
                        <Input
                          id="owner-location"
                          name="Property Location"
                          placeholder="Which Caribbean island?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="owner-message">Tell Us About Your Property</Label>
                        <Textarea
                          id="owner-message"
                          name="message"
                          rows={4}
                          placeholder="Property type, number of bedrooms, unique features..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Request Property Evaluation"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Brand Partner Form */}
                  <TabsContent value="partner">
                    <form onSubmit={(e) => handleSubmit(e, "partner")} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="partner-name">Contact Name</Label>
                          <Input id="partner-name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="partner-email">Email</Label>
                          <Input id="partner-email" name="email" type="email" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner-company">Company Name</Label>
                        <Input id="partner-company" name="Company Name" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner-website">Company Website</Label>
                        <Input id="partner-website" name="Company Website" type="url" placeholder="https://" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner-type">Partnership Type</Label>
                        <Input
                          id="partner-type"
                          name="Partnership Type"
                          placeholder="e.g., Luxury Brand, Experience Provider, Service Partner"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner-message">Partnership Proposal</Label>
                        <Textarea
                          id="partner-message"
                          name="message"
                          rows={4}
                          placeholder="Tell us about your brand and how we can collaborate..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Submit Partnership Inquiry"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phone & WhatsApp</p>
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                    >
                      {CONTACT_PHONE}
                    </a>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 mt-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.025-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Message on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">
                      Sarah Kuhmichel
                      <br />
                      Luxury Travel Specialist
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Concierge Hours</p>
                    <p className="text-sm text-muted-foreground">
                      24/7 Guest Support
                      <br />
                      Office: Mon-Fri 9AM-6PM CET
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">Direct Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Planning Your Stay?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our concierge team can help you find the perfect villa and plan unforgettable experiences.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Property Owners</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how Valar Travel can elevate your property's presence and attract discerning guests.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Brand Partnerships</h4>
                  <p className="text-sm text-muted-foreground">
                    Collaborate with us to create exclusive luxury experiences for our private guest network.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
