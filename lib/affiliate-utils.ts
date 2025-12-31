export interface AffiliateConfig {
  partnerId?: string
  campaignId?: string
  source: string
  medium?: string
  content?: string
}

export function generateAffiliateUrl(
  baseUrl: string,
  config: AffiliateConfig,
  additionalParams?: Record<string, string>,
): string {
  try {
    if (!baseUrl || typeof baseUrl !== "string" || baseUrl.trim() === "") {
      console.warn("Invalid or empty URL provided:", baseUrl)
      return baseUrl || ""
    }

    // Clean and validate the URL
    const cleanUrl = baseUrl.trim()

    // Check if URL starts with http/https, if not, assume it's malformed
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      console.warn("URL does not start with http/https:", cleanUrl)
      return cleanUrl
    }

    const url = new URL(cleanUrl)

    // Add UTM parameters for tracking
    url.searchParams.set("utm_source", config.source)
    url.searchParams.set("utm_medium", config.medium || "affiliate")
    url.searchParams.set("utm_campaign", config.campaignId || "valar-travel")

    if (config.content) {
      url.searchParams.set("utm_content", config.content)
    }

    if (config.partnerId) {
      url.searchParams.set("partner_id", config.partnerId)
    }

    // Add any additional parameters
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    return url.toString()
  } catch (error) {
    console.error("Error generating affiliate URL:", error)
    console.error("Original URL:", baseUrl)
    return baseUrl || ""
  }
}

export function trackAffiliateClick(affiliateLink: string, propertyName: string, additionalData?: Record<string, any>) {
  // Track with Google Analytics if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "affiliate_click", {
      event_category: "affiliate",
      event_label: propertyName,
      custom_parameter_1: affiliateLink,
      ...additionalData,
    })
  }

  // Track with our internal API
  fetch("/api/tracking/affiliate-click", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      affiliateLink,
      propertyName,
      source: "valar-travel",
      sessionId: generateSessionId(),
      ...additionalData,
    }),
  }).catch((error) => {
    console.error("Failed to track affiliate click:", error)
  })
}

export function generateSessionId(): string {
  if (typeof window !== "undefined") {
    let sessionId = sessionStorage.getItem("valar-session-id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("valar-session-id", sessionId)
    }
    return sessionId
  }
  return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const AFFILIATE_PARTNERS = {
  BOOKING: {
    name: "Booking.com",
    partnerId: undefined,
    baseUrl: "https://www.booking.com",
  },
  EXPEDIA: {
    name: "Expedia",
    partnerId: "1110111837",
    baseUrl: "https://www.expedia.com",
  },
  HOTELS: {
    name: "Hotels.com",
    partnerId: undefined,
    baseUrl: "https://www.hotels.com",
  },
} as const

export function generateAffiliateLink(partner: keyof typeof AFFILIATE_PARTNERS, originalUrl: string): string {
  const partnerConfig = AFFILIATE_PARTNERS[partner]

  if (!partnerConfig) {
    console.warn(`Unknown affiliate partner: ${partner}`)
    return originalUrl
  }

  if (!originalUrl || typeof originalUrl !== "string" || originalUrl.trim() === "") {
    console.warn("Invalid URL provided to generateAffiliateLink:", originalUrl)
    return originalUrl || ""
  }

  const config: AffiliateConfig = {
    partnerId: partnerConfig.partnerId,
    source: "valar-travel",
    medium: "affiliate",
    campaignId: `${partner.toLowerCase()}-properties`,
    content: "tokyo-properties",
  }

  return generateAffiliateUrl(originalUrl, config)
}
