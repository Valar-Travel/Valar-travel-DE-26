"use client"

import { useCallback, useEffect, useState } from "react"
import { LuxuryAnalyticsTracker } from "@/lib/luxury-analytics"

export function useLuxuryAnalytics(userId?: string) {
  const [tracker, setTracker] = useState<LuxuryAnalyticsTracker | null>(null)

  useEffect(() => {
    setTracker(new LuxuryAnalyticsTracker(userId))
  }, [userId])

  const trackPropertyView = useCallback(
    (property: any) => {
      if (tracker) {
        tracker.trackLuxuryPropertyView(property)
      }
    },
    [tracker],
  )

  const trackAffiliateClick = useCallback(
    async (property: any, partner: string) => {
      if (tracker) {
        return await tracker.trackAffiliateClick(property, partner)
      }
    },
    [tracker],
  )

  const trackSearch = useCallback(
    (searchParams: any) => {
      if (tracker) {
        tracker.trackLuxurySearch(searchParams)
      }
    },
    [tracker],
  )

  const trackConversion = useCallback(
    (property: any, partner: string, bookingValue: number) => {
      if (tracker) {
        tracker.trackConversion(property, partner, bookingValue)
      }
    },
    [tracker],
  )

  return {
    trackPropertyView,
    trackAffiliateClick,
    trackSearch,
    trackConversion,
  }
}
