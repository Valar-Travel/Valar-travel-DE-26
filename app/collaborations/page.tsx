"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Wine, Camera, Plane, Heart, Users, ArrowRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function CollaborationsPage() {
  const [formData, setFormData] = useState({
    brandName: "",
    contactName: "",
    email: "",
    phone: "",
    collaborationType: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Collaboration request:", formData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-white text-green-700 mb-4">Brand Partnerships</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Collaborations & Luxury Experiences</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8 text-pretty">
            Partner with Valar Travel to create unforgettable luxury experiences for discerning travelers
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
            Explore Partnership Opportunities
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Featured Collaborations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Brand Collaborations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive partnerships that elevate the luxury travel experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
                description:
                  "Professional photography workshops in stunning Caribbean locations with world-class instructors.",
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
                description:
                  "In-villa spa treatments and wellness programs featuring premium La Mer products and therapists.",
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
                description:
                  "Exclusive trunk shows and private viewings of haute joaillerie collections at luxury villas.",
                image: "/luxury-jewelry-event-villa.jpg",
              },
            ].map((collab, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
                  <Image
                    src={collab.image || "/placeholder.svg"}
                    alt={collab.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <collab.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3">{collab.brand}</Badge>
                  <h3 className="text-xl font-bold mb-2">{collab.title}</h3>
                  <p className="text-muted-foreground">{collab.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted By Leading Luxury Brands</h2>
            <p className="text-xl text-muted-foreground">
              Collaborating with the world's most prestigious names in luxury
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[
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
            ].map((brand, index) => (
              <div
                key={index}
                className="aspect-square bg-white rounded-lg flex items-center justify-center p-6 hover:shadow-md transition-shadow"
              >
                <span className="text-lg font-semibold text-gray-400">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              How our collaborations create unforgettable experiences
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wine className="w-8 h-8 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Champagne & Villas Summer Series</h3>
                    <p className="text-muted-foreground mb-4">
                      Our partnership with Dom Pérignon brought exclusive champagne experiences to 12 luxury villas
                      across Barbados and St. Barthélemy. Over 200 guests enjoyed sunset tastings with champagne
                      sommeliers, creating memorable moments that elevated the villa experience.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-bold text-green-700">200+</span>
                        <p className="text-muted-foreground">Guests</p>
                      </div>
                      <div>
                        <span className="font-bold text-green-700">12</span>
                        <p className="text-muted-foreground">Villas</p>
                      </div>
                      <div>
                        <span className="font-bold text-green-700">98%</span>
                        <p className="text-muted-foreground">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Michelin Chef Residency Program</h3>
                    <p className="text-muted-foreground mb-4">
                      Three Michelin-starred chefs spent a month creating bespoke dining experiences at our St. Lucia
                      properties. The program resulted in a 45% increase in bookings and established Valar Travel as a
                      culinary destination.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-bold text-green-700">3</span>
                        <p className="text-muted-foreground">Michelin Chefs</p>
                      </div>
                      <div>
                        <span className="font-bold text-green-700">45%</span>
                        <p className="text-muted-foreground">Booking Increase</p>
                      </div>
                      <div>
                        <span className="font-bold text-green-700">150+</span>
                        <p className="text-muted-foreground">Dinners Served</p>
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Partner With Valar Travel</h2>
              <p className="text-xl text-muted-foreground">Let's create extraordinary experiences together</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Brand Name *</label>
                      <Input
                        required
                        value={formData.brandName}
                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                        placeholder="Your Brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Name *</label>
                      <Input
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@brand.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Collaboration Type *</label>
                    <Input
                      required
                      value={formData.collaborationType}
                      onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                      placeholder="e.g., Product Launch, Brand Experience, Event Series"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tell us about your vision</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your ideas for a collaboration with Valar Travel..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-green-700 hover:bg-green-800">
                    Submit Partnership Inquiry
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
