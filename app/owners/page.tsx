"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  TrendingUp,
  Users,
  Shield,
  Star,
  DollarSign,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react"
import { useState } from "react"

export default function OwnersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyLocation: "",
    propertyType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/owners/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Thank you for your inquiry! We will contact you within 24 hours.",
        })
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          propertyLocation: "",
          propertyType: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to submit inquiry. Please try again.",
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/luxury-villa-partnership.jpg"
            alt="Luxury Caribbean Villa"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white text-green-700 mb-4">For Property Owners</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Join Valar Travel: Where Island Luxury Meets the World
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8 text-pretty">
            Connect your extraordinary Caribbean villa with discerning travelers worldwide. Boutique care meets global
            reach.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
            Request Free Property Evaluation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Journal Article CTA Section */}
      <section className="py-12 bg-green-50">
        <div className="container mx-auto px-4">
          <Card className="border-green-200 bg-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Read the Full Story</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover more about partnering with Valar Travel and explore our collection of Caribbean luxury travel
                stories in our journal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/journal/join-valar-travel-property-owners">
                  <Button size="lg" className="bg-green-700 hover:bg-green-800">
                    Read Full Article
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-700 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    View All Articles
                    <BookOpen className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="/luxury-villa-ocean-view.jpg"
                alt="Luxury villa with ocean view"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Global Reach, Island Soul</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Valar Travel bridges the gap between Caribbean paradise and international prestige. Your property is
                promoted across Europe, North America, and the Middle East to travelers who value authenticity, privacy,
                and luxury island experiences.
              </p>
              <p className="text-lg text-muted-foreground">
                Every villa in our collection is presented with care — from professional photography and cinematic video
                tours to immersive storytelling that highlights your island's culture, scenery, and charm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Approach</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Boutique care with global reach - the perfect balance for luxury property management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Private Guest Network</h3>
                <p className="text-muted-foreground">
                  Access to our curated network of high-net-worth travelers seeking authentic luxury experiences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Luxury Brand Collaborations</h3>
                <p className="text-muted-foreground">
                  Partner with premium brands for exclusive experiences that elevate your property's prestige
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personal Owner Support</h3>
                <p className="text-muted-foreground">
                  Dedicated account manager providing white-glove service and transparent communication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Owner Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Owner Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to maximize your property's potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Premium Pricing",
                description: "Competitive rates that reflect your property's true luxury value",
              },
              {
                icon: Calendar,
                title: "Smart Booking",
                description: "Advanced calendar management and dynamic pricing optimization",
              },
              {
                icon: Shield,
                title: "Full Protection",
                description: "Comprehensive insurance and guest vetting for peace of mind",
              },
              {
                icon: TrendingUp,
                title: "Revenue Growth",
                description: "Data-driven strategies to maximize your occupancy and income",
              },
              {
                icon: Home,
                title: "Property Care",
                description: "Regular maintenance and quality inspections between bookings",
              },
              {
                icon: Star,
                title: "Premium Marketing",
                description: "Professional photography and targeted luxury travel marketing",
              },
              {
                icon: Users,
                title: "Guest Services",
                description: "24/7 concierge support for your guests' every need",
              },
              {
                icon: CheckCircle2,
                title: "Easy Management",
                description: "Owner dashboard with real-time insights and reporting",
              },
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="w-10 h-10 text-green-700 mb-4" />
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Your Property's Best */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcase Your Property's Best</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional photography and marketing that captures the essence of your luxury villa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/infinity-pool-ocean-view.png"
                alt="Infinity pool with ocean view"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">Stunning Pool Views</p>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/modern-luxury-bedroom-caribbean.jpg"
                alt="Luxury bedroom interior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">Elegant Interiors</p>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="/gourmet-caribbean-dining.jpg"
                alt="Gourmet dining experience"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold">Culinary Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to join the Valar Travel network
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Request Evaluation",
                  description:
                    "Submit your property details and we'll schedule a complimentary consultation to assess your villa's potential.",
                },
                {
                  step: "02",
                  title: "Property Onboarding",
                  description:
                    "Our team conducts a professional photo shoot and creates your luxury listing with compelling descriptions.",
                },
                {
                  step: "03",
                  title: "Launch & Market",
                  description:
                    "Your property goes live on our platform and is promoted to our exclusive network of luxury travelers.",
                },
                {
                  step: "04",
                  title: "Manage & Earn",
                  description:
                    "Track bookings, revenue, and guest feedback through your owner dashboard while we handle everything else.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Request a Free Property Evaluation</h2>
              <p className="text-xl text-muted-foreground">
                Let's discuss how Valar Travel can help maximize your property's potential
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitStatus.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      <p className="font-medium">{submitStatus.message}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Location *</label>
                      <Input
                        required
                        value={formData.propertyLocation}
                        onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                        placeholder="Barbados"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <Input
                      required
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      placeholder="Beachfront Villa"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tell us about your property</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share details about your property, amenities, and what makes it special..."
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
