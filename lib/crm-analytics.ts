// Enhanced CRM Analytics Library for ValarTravel
// Handles user journey tracking, segmentation, and personalization

import { createClient } from "@/lib/supabase/client"

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// ============================================
// Types
// ============================================

export interface CustomerProfile {
  id: string
  user_id?: string
  email: string
  first_name?: string
  last_name?: string
  engagement_score: number
  lifetime_value: number
  lead_score: number
  customer_segment: CustomerSegment
  acquisition_source?: string
  preferred_destinations: string[]
  preferred_property_types: string[]
  budget_range?: BudgetRange
  travel_frequency?: TravelFrequency
  total_sessions: number
  total_page_views: number
  total_searches: number
  total_property_views: number
  total_bookings: number
  last_seen_at: string
  email_subscribed: boolean
  tags: string[]
}

export type CustomerSegment = "prospect" | "engaged" | "loyal" | "vip" | "dormant"
export type BudgetRange = "budget" | "mid-range" | "luxury" | "ultra-luxury"
export type TravelFrequency = "occasional" | "regular" | "frequent"

export interface JourneyEvent {
  event_name: string
  event_category?: string
  event_action?: string
  event_label?: string
  event_value?: number
  page_url?: string
  page_title?: string
  page_type?: string
  property_id?: string
  property_name?: string
  property_destination?: string
  property_price?: number
  search_query?: string
  search_filters?: Record<string, any>
  search_results_count?: number
  metadata?: Record<string, any>
}

export interface SessionData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  referrer?: string
  landing_page?: string
  device_type?: string
  browser?: string
  os?: string
}

export interface AudienceSegment {
  id: string
  name: string
  description?: string
  rules: SegmentRule[]
  member_count: number
  is_active: boolean
}

export interface SegmentRule {
  field: string
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains"
  value: any
}

// ============================================
// CRM Analytics Class
// ============================================

export class CRMAnalytics {
  private sessionId: string
  private customerId: string | null = null
  private eventQueue: JourneyEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private sessionData: SessionData = {}
  
  // Lazy getter for supabase client to avoid creating multiple instances
  private get supabase() {
    return createClient()
  }

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.initializeSession()
    this.startEventQueue()
  }

  // ============================================
  // Session Management
  // ============================================

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") return crypto.randomUUID()

    let sessionId = sessionStorage.getItem("valar_session_id")
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem("valar_session_id", sessionId)
    }
    return sessionId
  }

  private async initializeSession() {
    if (typeof window === "undefined") return

    // Parse UTM parameters
    const params = new URLSearchParams(window.location.search)
    this.sessionData = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_content: params.get("utm_content") || undefined,
      utm_term: params.get("utm_term") || undefined,
      referrer: document.referrer || undefined,
      landing_page: window.location.pathname,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
    }

    // Create or update session in database
    try {
      await fetch("/api/crm/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: this.sessionId,
          ...this.sessionData,
        }),
      })
    } catch (error) {
      // Analytics will still work via Google Analytics
    }
  }

  private getDeviceType(): string {
    if (typeof window === "undefined") return "unknown"
    const ua = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet"
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile"
    return "desktop"
  }

  private getBrowser(): string {
    if (typeof window === "undefined") return "unknown"
    const ua = navigator.userAgent
    if (ua.includes("Chrome")) return "Chrome"
    if (ua.includes("Firefox")) return "Firefox"
    if (ua.includes("Safari")) return "Safari"
    if (ua.includes("Edge")) return "Edge"
    return "Other"
  }

  private getOS(): string {
    if (typeof window === "undefined") return "unknown"
    const ua = navigator.userAgent
    if (ua.includes("Windows")) return "Windows"
    if (ua.includes("Mac")) return "macOS"
    if (ua.includes("Linux")) return "Linux"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("iOS")) return "iOS"
    return "Other"
  }

  // ============================================
  // Event Tracking
  // ============================================

  track(event: JourneyEvent) {
    // Add to queue for batching
    this.eventQueue.push({
      ...event,
      page_url: typeof window !== "undefined" ? window.location.href : undefined,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    })

    // Also send to Google Analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event.event_name, {
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.event_value,
        ...event.metadata,
      })
    }
  }

  // Convenience methods for common events
  trackPageView(pageType?: string) {
    this.track({
      event_name: "page_view",
      event_category: "navigation",
      page_type: pageType,
    })
  }

  trackSearch(query: string, filters?: Record<string, any>, resultsCount?: number) {
    this.track({
      event_name: "search",
      event_category: "search",
      search_query: query,
      search_filters: filters,
      search_results_count: resultsCount,
    })
  }

  trackPropertyView(property: {
    id: string
    name: string
    destination?: string
    price?: number
    type?: string
  }) {
    this.track({
      event_name: "property_view",
      event_category: "property",
      event_action: "view",
      property_id: property.id,
      property_name: property.name,
      property_destination: property.destination,
      property_price: property.price,
      metadata: { property_type: property.type },
    })
  }

  trackPropertyClick(property: {
    id: string
    name: string
    destination?: string
    price?: number
    source?: string
  }) {
    this.track({
      event_name: "property_click",
      event_category: "property",
      event_action: "click",
      property_id: property.id,
      property_name: property.name,
      property_destination: property.destination,
      property_price: property.price,
      metadata: { click_source: property.source },
    })
  }

  trackBookingStart(property: { id: string; name: string; price?: number }) {
    this.track({
      event_name: "booking_start",
      event_category: "conversion",
      event_action: "start",
      property_id: property.id,
      property_name: property.name,
      property_price: property.price,
    })
  }

  trackBookingComplete(booking: {
    propertyId: string
    propertyName: string
    value: number
    transactionId: string
  }) {
    this.track({
      event_name: "booking_complete",
      event_category: "conversion",
      event_action: "complete",
      event_value: booking.value,
      property_id: booking.propertyId,
      property_name: booking.propertyName,
      metadata: { transaction_id: booking.transactionId },
    })
  }

  trackNewsletterSignup(source?: string) {
    this.track({
      event_name: "newsletter_signup",
      event_category: "engagement",
      event_action: "signup",
      metadata: { source },
    })
  }

  trackInquiry(propertyId?: string, type?: string) {
    this.track({
      event_name: "inquiry",
      event_category: "engagement",
      event_action: "submit",
      property_id: propertyId,
      metadata: { inquiry_type: type },
    })
  }

  // ============================================
  // Event Queue Management
  // ============================================

  private startEventQueue() {
    // Flush events every 5 seconds
    this.flushInterval = setInterval(() => this.flushEvents(), 5000)

    // Also flush on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.flushEvents(true))
    }
  }

  private async flushEvents(sync = false) {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    const payload = {
      session_id: this.sessionId,
      customer_id: this.customerId,
      events,
    }

    if (sync && typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/crm/events", JSON.stringify(payload))
    } else {
      try {
        await fetch("/api/crm/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } catch {
        // Silently fail - analytics events are non-critical
      }
    }
  }

  // ============================================
  // Customer Identification
  // ============================================

  async identify(email: string, attributes?: Partial<CustomerProfile>) {
    try {
      const response = await fetch("/api/crm/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: this.sessionId,
          email,
          ...attributes,
        }),
      })

      const data = await response.json()
      if (data.customer_id) {
        this.customerId = data.customer_id
        localStorage.setItem("valar_customer_id", data.customer_id)
      }

      return data
    } catch {
      // Silently fail - identification is non-critical
      return null
    }
  }

  // ============================================
  // Cleanup
  // ============================================

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushEvents(true)
  }
}

// ============================================
// Singleton Instance
// ============================================

let analyticsInstance: CRMAnalytics | null = null

export function getCRMAnalytics(): CRMAnalytics {
  if (typeof window === "undefined") {
    // Return a mock for server-side
    return {
      track: () => {},
      trackPageView: () => {},
      trackSearch: () => {},
      trackPropertyView: () => {},
      trackPropertyClick: () => {},
      trackBookingStart: () => {},
      trackBookingComplete: () => {},
      trackNewsletterSignup: () => {},
      trackInquiry: () => {},
      identify: async () => null,
      destroy: () => {},
    } as unknown as CRMAnalytics
  }

  if (!analyticsInstance) {
    analyticsInstance = new CRMAnalytics()
  }
  return analyticsInstance
}

// ============================================
// Server-side Analytics Functions
// ============================================

export async function getCustomerProfile(email: string): Promise<CustomerProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("customer_profiles").select("*").eq("email", email).single()

  if (error) return null
  return data
}

export async function getAudienceSegments(): Promise<AudienceSegment[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("audience_segments").select("*").eq("is_active", true)

  if (error) return []
  return data || []
}

export async function getSegmentMembers(segmentId: string): Promise<CustomerProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("segment_memberships")
    .select("customer_id, customer_profiles(*)")
    .eq("segment_id", segmentId)
    .eq("is_active", true)

  if (error) return []
  return data?.map((d: any) => d.customer_profiles).filter(Boolean) || []
}

export async function updateCustomerSegment(customerId: string): Promise<void> {
  const supabase = createClient()

  // Get customer profile
  const { data: customer } = await supabase.from("customer_profiles").select("*").eq("id", customerId).single()

  if (!customer) return

  // Calculate new segment based on behavior
  let newSegment: CustomerSegment = "prospect"

  if (customer.total_bookings >= 3 || customer.lifetime_value >= 10000) {
    newSegment = "vip"
  } else if (customer.total_bookings >= 2) {
    newSegment = "loyal"
  } else if (customer.engagement_score >= 30) {
    newSegment = "engaged"
  } else if (
    customer.last_seen_at &&
    new Date(customer.last_seen_at) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  ) {
    newSegment = "dormant"
  }

  // Update profile
  await supabase
    .from("customer_profiles")
    .update({ customer_segment: newSegment, updated_at: new Date().toISOString() })
    .eq("id", customerId)
}
