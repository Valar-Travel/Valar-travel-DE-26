"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Wine, Camera, Plane, Heart, Users, ArrowRight, CheckCircle, Star, Globe } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function CollaborationsClientPage() {
  const [formData, setFormData] = useState({
    brandName: "",
    contactName: "",
    email: "",
    phone: "",
    collaborationType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: formData.brandName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          collaborationType: formData.collaborationType,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Inquiry Submitted",
          description:
            "Thank you! Check your email for confirmation. Our partnerships team will be in touch within 48 hours.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send inquiry. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  const collaborations = [
    {
      icon: Wine,
      title: "Champagne & Villas Summer Series",
      brand: "Dom Pérignon",
      description:
        "Exclusive champagne tastings and sunset celebrations at select Caribbean villas throughout summer season.",
      image: "/luxury-champagne-tasting-at-villa.jpg",
    },
    {
      icon: Camera,
      title: "Luxury Photography Retreats",
      brand: "Leica Camera",
      description: "Professional photography workshops in stunning Caribbean locations with world-class instructors.",
      image: "/luxury-photography-retreat-caribbean.jpg",
    },
    {
      icon: Plane,
      title: "Private Aviation Partnership",
      brand: "NetJets",
      description: "Seamless private jet transfers to your Caribbean villa with exclusive member benefits.",
      image: "/private-jet-caribbean-luxury.jpg",
    },
    {
      icon: Heart,
      title: "Wellness & Spa Experiences",
      brand: "La Mer Spa",
      description: "In-villa spa treatments and wellness programs featuring premium La Mer products and therapists.",
      image: "/luxury-spa-treatment-villa.jpg",
    },
    {
      icon: Users,
      title: "Culinary Excellence Program",
      brand: "Michelin Star Chefs",
      description:
        "Private chef experiences with Michelin-starred culinary artists creating bespoke Caribbean fusion menus.",
      image: "/michelin-chef-private-dining.jpg",
    },
    {
      icon: Sparkles,
      title: "Jewelry & Fashion Events",
      brand: "Cartier",
      description: "Exclusive trunk shows and private viewings of haute joaillerie collections at luxury villas.",
      image: "/luxury-jewelry-event-villa.jpg",
    },
  ]

  const partnerBrands = [
    "Dom Pérignon",
    "Leica",
    "NetJets",
    "La Mer",
    "Cartier",
    "Rolls-Royce",
    "Four Seasons",
    "Hermès",
    "Bulgari",
    "Aston Martin",
    "Patek Philippe",
    "Louis Vuitton",
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <Card className="max-w-lg mx-4">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-light tracking-tight mb-2">Partnership Inquiry Received</h2>
            <p className="text-muted-foreground mb-6 font-light">
              Thank you for your interest in collaborating with Valar Travel. Our partnerships team will review your
              proposal and respond within 48 hours.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  brandName: "",
                  contactName: "",
                  email: "",
                  phone: "",
                  collaborationType: "",
                  message: "",
                })
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-none tracking-wider"
            >
              Submit Another Inquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <Image
          src="/luxury-champagne-tasting-at-villa.jpg"
          alt="Luxury brand collaboration at Caribbean villa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-800/70 to-emerald-950/85" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Luxury badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-medium tracking-widest uppercase text-amber-100">Brand Partnerships</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light mb-6 text-balance tracking-tight text-white">
            Collaborations &<span className="block font-semibold italic text-amber-200">Luxury Experiences</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Partner with Valar Travel to create unforgettable luxury experiences for discerning travelers across the
            Caribbean.
          </p>

          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-none px-8 py-6 font-semibold tracking-wider shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById("partnership-form")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Partnership Opportunities
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-emerald-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "VIP Guests Annually" },
              { value: "50+", label: "Exclusive Properties" },
              { value: "12", label: "Brand Partners" },
              { value: "98%", label: "Guest Satisfaction" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-light text-amber-400 mb-1">{stat.value}</p>
                <p className="text-sm tracking-widest uppercase text-emerald-200/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collaborations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-emerald-700">
                Current Collaborations
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Our Brand <span className="font-semibold italic text-emerald-700">Collaborations</span>
            </h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Exclusive partnerships that elevate the luxury travel experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collaborations.map((collab, index) => (
              <Card
                key={index}
                className="overflow-hidden group border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600">
                  <Image
                    src={collab.image || "/placeholder.svg?height=300&width=400&query=luxury+caribbean+experience"}
                    alt={collab.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <collab.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-amber-500 text-emerald-950 text-xs font-semibold tracking-wider uppercase rounded-none">
                      {collab.brand}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium tracking-tight mb-2">{collab.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{collab.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 mb-6">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium tracking-widest uppercase text-stone-600">Trusted Partners</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Leading <span className="font-semibold italic text-emerald-700">Luxury Brands</span>
            </h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground font-light">
              Collaborating with the world's most prestigious names in luxury
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {partnerBrands.map((brand, index) => (
              <div
                key={index}
                className="aspect-square bg-white border border-stone-200 flex items-center justify-center p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                <span className="text-base font-medium text-stone-400 tracking-wide">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium tracking-widest uppercase text-emerald-700">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              How We Create <span className="font-semibold italic text-emerald-700">Unforgettable Experiences</span>
            </h2>
            <div className="w-16 h-px bg-amber-400 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Wine className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-amber-200 font-medium tracking-wider uppercase text-sm">Dom Pérignon</p>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-light tracking-tight mb-4">Champagne & Villas Summer Series</h3>
                    <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                      Our partnership with Dom Pérignon brought exclusive champagne experiences to 12 luxury villas
                      across Barbados and St. Barthélemy. Over 200 guests enjoyed sunset tastings with champagne
                      sommeliers, creating memorable moments that elevated the villa experience.
                    </p>
                    <div className="flex gap-8">
                      <div>
                        <span className="text-2xl font-light text-emerald-700">200+</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Guests</p>
                      </div>
                      <div>
                        <span className="text-2xl font-light text-emerald-700">12</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Villas</p>
                      </div>
                      <div>
                        <span className="text-2xl font-light text-emerald-700">98%</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-amber-200 font-medium tracking-wider uppercase text-sm">Michelin Chefs</p>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-2xl font-light tracking-tight mb-4">Culinary Excellence Program</h3>
                    <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                      Three Michelin-starred chefs spent a month creating bespoke dining experiences at our St. Lucia
                      properties. The program resulted in a 45% increase in bookings and established Valar Travel as a
                      culinary destination.
                    </p>
                    <div className="flex gap-8">
                      <div>
                        <span className="text-2xl font-light text-emerald-700">3</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Michelin Chefs</p>
                      </div>
                      <div>
                        <span className="text-2xl font-light text-emerald-700">45%</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Booking Increase</p>
                      </div>
                      <div>
                        <span className="text-2xl font-light text-emerald-700">150+</span>
                        <p className="text-sm text-muted-foreground tracking-wider uppercase">Dinners Served</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section
        id="partnership-form"
        className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium tracking-widest uppercase text-amber-100">Partner With Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">
                Create Extraordinary <span className="font-semibold italic text-amber-200">Experiences Together</span>
              </h2>
              <div className="w-16 h-px bg-amber-400 mx-auto mb-6" />
              <p className="text-lg text-emerald-100/80 font-light">
                Tell us about your brand and vision for collaboration
              </p>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brandName" className="text-sm tracking-wider uppercase text-muted-foreground">
                        Brand Name *
                      </Label>
                      <Input
                        id="brandName"
                        required
                        value={formData.brandName}
                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                        placeholder="Your Brand"
                        className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-sm tracking-wider uppercase text-muted-foreground">
                        Contact Name *
                      </Label>
                      <Input
                        id="contactName"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="John Doe"
                        className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm tracking-wider uppercase text-muted-foreground">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@brand.com"
                        className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm tracking-wider uppercase text-muted-foreground">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="collaborationType"
                      className="text-sm tracking-wider uppercase text-muted-foreground"
                    >
                      Collaboration Type *
                    </Label>
                    <Input
                      id="collaborationType"
                      required
                      value={formData.collaborationType}
                      onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                      placeholder="e.g., Product Launch, Brand Experience, Event Series"
                      className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm tracking-wider uppercase text-muted-foreground">
                      Tell us about your vision
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your ideas for a collaboration with Valar Travel..."
                      rows={5}
                      className="border-stone-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-none py-6 font-semibold tracking-wider transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Partnership Inquiry"}
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
