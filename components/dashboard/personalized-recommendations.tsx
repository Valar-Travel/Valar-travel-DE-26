"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MapPin, Users, Bath, ChevronRight, Heart, Loader2 } from "lucide-react"

interface Recommendation {
  id: string
  name: string
  location: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  image: string
  matchScore: number
  matchReasons: string[]
}

interface PreferencesSummary {
  travelStyle: string
  groupSize: string
  timing: string
  destinations: string[]
}

interface PersonalizedRecommendationsProps {
  userId: string
  userName?: string
}

const travelStyleLabels: Record<string, string> = {
  romantic: "Romantic Retreat",
  family: "Family Gathering",
  celebration: "Special Celebration",
  wellness: "Wellness & Serenity",
}

const groupSizeLabels: Record<string, string> = {
  couple: "Just the two of you",
  small: "Small group (3-6)",
  medium: "Medium group (7-12)",
  large: "Grand gathering (12+)",
}

export function PersonalizedRecommendations({ userId, userName }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [preferences, setPreferences] = useState<PreferencesSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(`/api/user/recommendations?userId=${userId}&limit=6`)
        const data = await res.json()
        
        if (data.recommendations) {
          setRecommendations(data.recommendations)
          setPreferences(data.preferences)
        }
        if (data.error) {
          setError(data.error)
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e)
        setError("Failed to load recommendations")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRecommendations()
    }
  }, [userId])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-emerald-700">Curating your perfect villas...</span>
        </div>
      </div>
    )
  }

  if (!preferences || recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Personalized For You</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Complete your preferences to get personalized villa recommendations tailored just for you.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        >
          Set Your Preferences
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const firstName = userName?.split(" ")[0] || "there"

  return (
    <div className="space-y-6">
      {/* Header with preferences summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Curated For You{userName ? `, ${firstName}` : ""}
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Based on your preferences: <span className="font-medium text-emerald-700">{travelStyleLabels[preferences.travelStyle] || preferences.travelStyle}</span> 
          {preferences.groupSize && (
            <> for <span className="font-medium text-emerald-700">{groupSizeLabels[preferences.groupSize] || preferences.groupSize}</span></>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {preferences.destinations && preferences.destinations.map((dest: string) => (
            <span 
              key={dest} 
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
            >
              {dest === "all" ? "All Islands" : dest.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {recommendations.map((villa, index) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={villa.image}
                  alt={villa.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Match score badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {villa.matchScore}% Match
                </div>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(villa.id)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      favorites.has(villa.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-600"
                    }`} 
                  />
                </button>

                {/* Price overlay */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white rounded-lg">
                  <span className="font-semibold">{formatPrice(villa.price, villa.currency)}</span>
                  <span className="text-white/80 text-sm"> /night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {villa.name}
                </h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {villa.location}
                </div>

                {/* Property details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {villa.bedrooms} beds
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {villa.bathrooms} baths
                  </div>
                </div>

                {/* Match reasons */}
                <div className="space-y-1 mb-4">
                  {villa.matchReasons.slice(0, 2).map((reason, i) => (
                    <p key={i} className="text-xs text-emerald-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                      {reason}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/villas/${villa.id}`}
                  className="block w-full text-center py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  View Villa
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View all link */}
      <div className="text-center">
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Browse all villas
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
