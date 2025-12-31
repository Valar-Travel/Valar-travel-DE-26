"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface PropertyFormData {
  property_name: string
  property_type: string
  city: string
  country: string
  area: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  price_per_night: number
  description: string
  main_image_url: string
  images: string[]
  amenities: string[]
  source_url: string
}

export function AddPropertyDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageInput, setImageInput] = useState("")
  const [amenityInput, setAmenityInput] = useState("")

  const [formData, setFormData] = useState<PropertyFormData>({
    property_name: "",
    property_type: "villa",
    city: "Barbados",
    country: "Barbados",
    area: "",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    price_per_night: 0,
    description: "",
    main_image_url: "",
    images: [],
    amenities: [],
    source_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source_site: "manual",
          is_active: true,
          is_published: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create property")
      }

      toast.success("Property created successfully!")
      setOpen(false)

      // Reset form
      setFormData({
        property_name: "",
        property_type: "villa",
        city: "Barbados",
        country: "Barbados",
        area: "",
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
        price_per_night: 0,
        description: "",
        main_image_url: "",
        images: [],
        amenities: [],
        source_url: "",
      })

      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to create property")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
        main_image_url: prev.main_image_url || imageInput.trim(),
      }))
      setImageInput("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }))
      setAmenityInput("")
    }
  }

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>Manually add a new luxury property to Barbados listings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="property_name">Property Name *</Label>
              <Input
                id="property_name"
                value={formData.property_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, property_name: e.target.value }))}
                placeholder="e.g., Sunset Beach Villa"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Property Type</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, property_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., West Coast"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bedrooms: Number.parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bathrooms: Number.parseInt(e.target.value) || 1 }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_guests">Max Guests *</Label>
                <Input
                  id="max_guests"
                  type="number"
                  min="1"
                  value={formData.max_guests}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, max_guests: Number.parseInt(e.target.value) || 1 }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="price_per_night">Price per Night (USD) *</Label>
              <Input
                id="price_per_night"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_night}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price_per_night: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="500"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the property, its features, and what makes it special..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="source_url">Website URL (optional)</Label>
              <Input
                id="source_url"
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, source_url: e.target.value }))}
                placeholder="https://example.com/property"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL and click Add"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} variant="secondary">
                <Upload className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Property ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., Pool, WiFi, Air Conditioning"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} variant="secondary">
                Add
              </Button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(idx)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
