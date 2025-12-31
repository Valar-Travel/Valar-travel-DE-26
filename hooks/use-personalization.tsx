"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserPreferences {
  destinations: string[]
  budget_range: string
  accommodation_type: string
  travel_style: string
}

interface UserLocation {
  city: string
  country: string
}

interface UserSession {
  id: string
  preferences: UserPreferences
  location: UserLocation
  search_history: string[]
}

interface Deal {
  id: string
  name: string
  city: string
  price: number
  normal_price: number
  discount_type: string
  affiliate_link: string
  image_url?: string
  star_rating?: number
  review_score?: number
  review_count?: number
}

interface PersonalizationContextType {
  session: UserSession | null
  isLoading: boolean
  getPersonalizedDeals: () => Promise<Deal[]>
  updatePreferences: (preferences: Partial<UserPreferences>) => void
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined)

const mockDeals: Deal[] = [
  {
    id: "1",
    name: "Luxury Beachfront Villa",
    city: "Barbados",
    price: 299,
    normal_price: 499,
    discount_type: "Early Bird",
    affiliate_link: "https://example.com/deal1",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    star_rating: 5,
    review_score: 9.2,
    review_count: 1247,
  },
  {
    id: "2",
    name: "Pitons View Resort",
    city: "St. Lucia",
    price: 189,
    normal_price: 289,
    discount_type: "Last Minute",
    affiliate_link: "https://example.com/deal2",
    image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    star_rating: 4,
    review_score: 8.8,
    review_count: 892,
  },
  {
    id: "3",
    name: "Montego Bay Resort",
    city: "Jamaica",
    price: 149,
    normal_price: 229,
    discount_type: "Member Only",
    affiliate_link: "https://example.com/deal3",
    image_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    star_rating: 4,
    review_score: 8.5,
    review_count: 2156,
  },
]

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockSession: UserSession = {
        id: "user-123",
        preferences: {
          destinations: ["Barbados", "St. Lucia", "Jamaica"],
          budget_range: "mid-range",
          accommodation_type: "villa",
          travel_style: "luxury",
        },
        location: {
          city: "Bridgetown",
          country: "Barbados",
        },
        search_history: ["Barbados villas", "St. Lucia resorts", "Jamaica beaches"],
      }

      setSession(mockSession)
      setIsLoading(false)
    }

    loadSession()
  }, [])

  const getPersonalizedDeals = async (): Promise<Deal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDeals
  }

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (session) {
      setSession({
        ...session,
        preferences: { ...session.preferences, ...preferences },
      })
    }
  }

  const value: PersonalizationContextType = {
    session,
    isLoading,
    getPersonalizedDeals,
    updatePreferences,
  }

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext)
  if (context === undefined) {
    throw new Error("usePersonalization must be used within a PersonalizationProvider")
  }
  return context
}
