"use client"

import { useCallback, useRef } from "react"

type SignalType = "property_view" | "search" | "favorite" | "booking" | "filter_used"

interface SignalMetadata {
  destination?: string
  amenities?: string[]
  property_type?: string
  price?: number
  bedrooms?: number
  search_query?: string
  filters_used?: Record<string, unknown>
  dwell_time_seconds?: number
  scroll_depth?: number
  [key: string]: unknown
}

export function useSignalTracker() {
  const sessionId = useRef<string>(
    typeof window !== "undefined" 
      ? sessionStorage.getItem("valar_session_id") || generateSessionId()
      : ""
  )

  // Track a user signal
  const trackSignal = useCallback(async (
    signalType: SignalType,
    propertyId?: string,
    metadata?: SignalMetadata
  ) => {
    try {
      await fetch("/api/ai/track-signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signal_type: signalType,
          property_id: propertyId,
          metadata,
          session_id: sessionId.current,
          page_url: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      })
    } catch {
      // Silently fail - tracking shouldn't break the app
    }
  }, [])

  // Track property view
  const trackPropertyView = useCallback((
    propertyId: string,
    propertyData: {
      destination?: string
      price?: number
      bedrooms?: number
      amenities?: string[]
      property_type?: string
    }
  ) => {
    trackSignal("property_view", propertyId, propertyData)
  }, [trackSignal])

  // Track search
  const trackSearch = useCallback((
    searchQuery: string,
    filters?: Record<string, unknown>
  ) => {
    trackSignal("search", undefined, {
      search_query: searchQuery,
      filters_used: filters,
    })
  }, [trackSignal])

  // Track favorite action
  const trackFavorite = useCallback((
    propertyId: string,
    propertyData?: SignalMetadata
  ) => {
    trackSignal("favorite", propertyId, propertyData)
  }, [trackSignal])

  // Track booking
  const trackBooking = useCallback((
    propertyId: string,
    bookingData: {
      price?: number
      nights?: number
      guests?: number
    }
  ) => {
    trackSignal("booking", propertyId, bookingData)
  }, [trackSignal])

  // Track filter usage
  const trackFilterUsed = useCallback((
    filters: Record<string, unknown>
  ) => {
    trackSignal("filter_used", undefined, { filters_used: filters })
  }, [trackSignal])

  return {
    trackSignal,
    trackPropertyView,
    trackSearch,
    trackFavorite,
    trackBooking,
    trackFilterUsed,
  }
}

function generateSessionId(): string {
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  if (typeof window !== "undefined") {
    sessionStorage.setItem("valar_session_id", id)
  }
  return id
}
