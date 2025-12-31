"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar } from "lucide-react"
import { abTesting } from "@/lib/ab-testing"

interface HeroVariantProps {
  onSearchClick: () => void
  userId?: string
}

// Control - Current Layout
export function CurrentHeroLayout({ onSearchClick, userId }: HeroVariantProps) {
  const handleSearch = () => {
    abTesting.trackEvent("homepage-hero-v1", "control", userId || "anonymous", "search_initiated")
    onSearchClick()
  }

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Discover Your Perfect Getaway</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find exclusive deals on luxury hotels, flights, and experiences worldwide
        </p>
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-gray-400" size={20} />
              <Input placeholder="Where to?" className="border-0 text-gray-900" />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={20} />
              <Input placeholder="Check-in" type="date" className="border-0 text-gray-900" />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={20} />
              <Input placeholder="Check-out" type="date" className="border-0 text-gray-900" />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2" size={20} />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Variant A - Minimal Layout
export function MinimalHeroLayout({ onSearchClick, userId }: HeroVariantProps) {
  const handleSearch = () => {
    abTesting.trackEvent("homepage-hero-v1", "minimal", userId || "anonymous", "search_initiated")
    onSearchClick()
  }

  return (
    <section className="relative bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Better</h1>
        <p className="text-lg text-gray-600 mb-8">Premium destinations, unbeatable prices</p>
        <div className="max-w-md mx-auto">
          <div className="flex rounded-full border-2 border-gray-200 overflow-hidden">
            <Input placeholder="Search destinations..." className="border-0 flex-1 px-6 py-3 text-lg" />
            <Button onClick={handleSearch} className="rounded-none px-8 bg-black hover:bg-gray-800">
              <Search size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Variant B - Video Background
export function VideoHeroLayout({ onSearchClick, userId }: HeroVariantProps) {
  const handleSearch = () => {
    abTesting.trackEvent("homepage-hero-v1", "video", userId || "anonymous", "search_initiated")
    onSearchClick()
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=luxury%20resort%20pool%20sunset)",
        }}
      ></div>
      <div className="relative z-20 h-full flex items-center justify-center text-white">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-6">Escape to Paradise</h1>
          <p className="text-2xl mb-12">Curated luxury experiences around the world</p>
          <Button onClick={handleSearch} size="lg" className="bg-white text-black hover:bg-gray-100 px-12 py-4 text-lg">
            Start Your Journey
          </Button>
        </div>
      </div>
    </section>
  )
}
