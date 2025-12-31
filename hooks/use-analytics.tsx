"use client"

import { useCallback } from "react"

export function useAnalytics() {
  const track = useCallback(async (eventName: string, properties?: Record<string, any>) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          properties,
          sessionId: crypto.randomUUID(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.warn("Analytics tracking failed:", error.message)
      }
    }
  }, [])

  const trackGtag = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, properties)
      }
    } catch (error) {
      console.warn("Google Analytics tracking failed:", error)
    }
  }, [])

  return { track, trackGtag }
}
