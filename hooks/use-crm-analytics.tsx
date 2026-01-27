"use client"

import { useEffect, useRef } from "react"
import { getCRMAnalytics, type CRMAnalytics, type JourneyEvent } from "@/lib/crm-analytics"

export function useCRMAnalytics() {
  const analyticsRef = useRef<CRMAnalytics | null>(null)

  useEffect(() => {
    analyticsRef.current = getCRMAnalytics()

    return () => {
      // Don't destroy on unmount, singleton persists
    }
  }, [])

  const track = (event: JourneyEvent) => {
    analyticsRef.current?.track(event)
  }

  const trackPageView = (pageType?: string) => {
    analyticsRef.current?.trackPageView(pageType)
  }

  const trackSearch = (query: string, filters?: Record<string, any>, resultsCount?: number) => {
    analyticsRef.current?.trackSearch(query, filters, resultsCount)
  }

  const trackPropertyView = (property: {
    id: string
    name: string
    destination?: string
    price?: number
    type?: string
  }) => {
    analyticsRef.current?.trackPropertyView(property)
  }

  const trackPropertyClick = (property: {
    id: string
    name: string
    destination?: string
    price?: number
    source?: string
  }) => {
    analyticsRef.current?.trackPropertyClick(property)
  }

  const trackBookingStart = (property: { id: string; name: string; price?: number }) => {
    analyticsRef.current?.trackBookingStart(property)
  }

  const trackBookingComplete = (booking: {
    propertyId: string
    propertyName: string
    value: number
    transactionId: string
  }) => {
    analyticsRef.current?.trackBookingComplete(booking)
  }

  const trackNewsletterSignup = (source?: string) => {
    analyticsRef.current?.trackNewsletterSignup(source)
  }

  const trackInquiry = (propertyId?: string, type?: string) => {
    analyticsRef.current?.trackInquiry(propertyId, type)
  }

  const identify = async (email: string, attributes?: Record<string, any>) => {
    return analyticsRef.current?.identify(email, attributes)
  }

  return {
    track,
    trackPageView,
    trackSearch,
    trackPropertyView,
    trackPropertyClick,
    trackBookingStart,
    trackBookingComplete,
    trackNewsletterSignup,
    trackInquiry,
    identify,
  }
}
