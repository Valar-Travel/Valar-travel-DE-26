"use client"

import { useEffect, useCallback, createContext, useContext, useState, type ReactNode, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface CRMContextType {
  sessionId: string | null
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  identifyUser: (email: string, attributes?: Record<string, any>) => void
}

const CRMContext = createContext<CRMContextType>({
  sessionId: null,
  trackEvent: () => {},
  identifyUser: () => {},
})

export const useCRM = () => useContext(CRMContext)

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
  utmKeys.forEach((key) => {
    const value = params.get(key)
    if (value) utm[key.replace("utm_", "")] = value
  })

  return utm
}

// Inner component that uses useSearchParams - must be wrapped in Suspense
function CRMAnalyticsInner({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize session
  useEffect(() => {
    let sid: string | null = null
    try {
      sid = sessionStorage.getItem("crm_session_id")
    } catch {
      // sessionStorage not available
    }

    if (!sid) {
      sid = generateSessionId()
      try {
        sessionStorage.setItem("crm_session_id", sid)
      } catch {
        // sessionStorage not available
      }

      // Create session in database
      const utm = getUTMParams()
      fetch("/api/crm/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sid,
          landing_page: typeof window !== "undefined" ? window.location.pathname : "/",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          ...utm,
          device_type:
            typeof navigator !== "undefined"
              ? /Mobile|Android|iPhone/i.test(navigator.userAgent)
                ? "mobile"
                : /Tablet|iPad/i.test(navigator.userAgent)
                  ? "tablet"
                  : "desktop"
              : "desktop",
          browser: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      }).catch(() => {
        // Silently fail - non-critical analytics
      })
    }

    setSessionId(sid)
  }, [])

  // Track page views
  useEffect(() => {
    if (!sessionId) return

    const pageType =
      pathname === "/"
        ? "home"
        : pathname.startsWith("/villas")
          ? "property"
          : pathname.startsWith("/destinations")
            ? "destination"
            : pathname.startsWith("/blog")
              ? "blog"
              : "other"

    fetch("/api/crm/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events: [
          {
            session_id: sessionId,
            event_name: "page_view",
            event_category: "navigation",
            page_url: pathname,
            page_title: typeof document !== "undefined" ? document.title : "",
            page_type: pageType,
          },
        ],
      }),
    }).catch(() => {
      // Silently fail - non-critical analytics
    })

    // Also send to Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "page_view", {
        page_path: pathname,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams, sessionId])

  const trackEvent = useCallback(
    (eventName: string, properties: Record<string, any> = {}) => {
      if (!sessionId) return

      fetch("/api/crm/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: [
            {
              session_id: sessionId,
              event_name: eventName,
              ...properties,
            },
          ],
        }),
      }).catch(() => {
        // Silently fail - non-critical analytics
      })

      // Also send to Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", eventName, properties)
      }
    },
    [sessionId],
  )

  const identifyUser = useCallback(
    (email: string, attributes: Record<string, any> = {}) => {
      if (!sessionId) return

      fetch("/api/crm/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          email,
          ...attributes,
        }),
      }).catch(() => {
        // Silently fail - non-critical analytics
      })
    },
    [sessionId],
  )

  return <CRMContext.Provider value={{ sessionId, trackEvent, identifyUser }}>{children}</CRMContext.Provider>
}

// Exported wrapper component with Suspense boundary
export function CRMAnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CRMContext.Provider value={{ sessionId: null, trackEvent: () => {}, identifyUser: () => {} }}>{children}</CRMContext.Provider>}>
      <CRMAnalyticsInner>{children}</CRMAnalyticsInner>
    </Suspense>
  )
}
