"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, X, CheckCircle2, Loader2, Home, Users, BedDouble, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { User } from "@supabase/supabase-js"

interface Country {
  code: string
  name: string
}

interface SubmitPropertyClientProps {
  user: User
  countries: Country[]
}

const amenitiesList = [
  "Private Pool",
  "Ocean View",
  "Beachfront",
  "Hot Tub/Jacuzzi",
  "Chef Service",
  "Concierge",
  "Gym/Fitness",
  "Home Theater",
  "Wine Cellar",
  "Boat Dock",
  "Helipad",
  "Tennis Court",
  "Air Conditioning",
  "WiFi",
  "Private Beach",
  "Spa Services",
]

const propertyTypes = [
  "Villa",
  "Estate",
  "Beachfront Villa",
  "Oceanview Villa",
  "Hillside Villa",
  "Penthouse",
  "Private Island",
  "Plantation House",
]

export default function SubmitPropertyClient({ user, countries }: SubmitPropertyClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const [formData, setFormData] = useState({
    ownerName: "",
    ownerPhone: "",
    propertyName: "",
    propertyType: "",
    country: "",
    location: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    pricePerNight: "",
    description: "",
  })

  const handleAddImage = () => {
    if (newImageUrl && newImageUrl.startsWith("http")) {
      setImageUrls([...imageUrls, newImageUrl])
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/property-prom/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerEmail: user.email,
          amenities: selectedAmenities,
          images: imageUrls,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit property")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white mb-4">Submission Received!</h1>
          <p className="text-white/60 mb-8">
            Thank you for submitting your property to Property Prom. Our team will review your submission and contact
            you within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/property-prom">Back to Property Prom</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/property-prom" className="flex items-center gap-2 text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Property Prom</span>
            </Link>
            <Link href="/" className="text-white font-serif">
              Valar <span className="text-emerald-400">Travel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Property Prom Submission</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-3">Submit Your Property</h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Complete the form below to submit your luxury villa for consideration in our exclusive Property Prom
              showcase.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">{error}</div>}

            {/* Owner Information */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Owner Information
                </CardTitle>
                <CardDescription className="text-white/50">Your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Full Name *</Label>
                    <Input
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Email</Label>
                    <Input value={user.email || ""} disabled className="bg-white/5 border-white/10 text-white/50" />
                  </div>
                </div>
                <div>
                  <Label className="text-white/70">Phone Number</Label>
                  <Input
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-400" />
                  Property Details
                </CardTitle>
                <CardDescription className="text-white/50">Tell us about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Property Name *</Label>
                    <Input
                      required
                      value={formData.propertyName}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                      placeholder="Villa Serenity"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/70">Location/Area *</Label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="West Coast, near Holetown"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white/70">Full Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Beach Road, St. James"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-emerald-400" />
                  Property Features
                </CardTitle>
                <CardDescription className="text-white/50">Capacity and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white/70">Bedrooms</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder="4"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Bathrooms</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="4"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Max Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.maxGuests}
                      onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                      placeholder="8"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">$/Night</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                      placeholder="1500"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white/70 mb-3 block">Amenities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAmenities.includes(amenity)
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => toggleAmenity(amenity)}
                      >
                        <Checkbox
                          checked={selectedAmenities.includes(amenity)}
                          className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="text-xs text-white/70">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Property Description</CardTitle>
                <CardDescription className="text-white/50">Describe what makes your property special</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your property's unique features, views, history, and what guests can expect..."
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  Property Images
                </CardTitle>
                <CardDescription className="text-white/50">
                  Add image URLs for your property (hosted images only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1"
                  />
                  <Button type="button" onClick={handleAddImage} className="bg-emerald-600 hover:bg-emerald-700">
                    Add
                  </Button>
                </div>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/images/fallback-luxury-villa.jpg"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/property-prom">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 min-w-[200px]">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Property"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
