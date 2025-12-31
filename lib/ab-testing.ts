export interface ABTest {
  id: string
  name: string
  description: string
  variants: ABVariant[]
  status: "draft" | "running" | "paused" | "completed"
  startDate: Date
  endDate?: Date
  targetMetric: string
  trafficSplit: number // percentage of users to include in test
}

export interface ABVariant {
  id: string
  name: string
  weight: number // percentage of test traffic
  config: Record<string, any>
}

export interface ABTestResult {
  testId: string
  variantId: string
  userId: string
  sessionId: string
  event: string
  timestamp: Date
  metadata?: Record<string, any>
}

class ABTestingManager {
  private static instance: ABTestingManager
  private activeTests: Map<string, ABTest> = new Map()

  static getInstance(): ABTestingManager {
    if (!ABTestingManager.instance) {
      ABTestingManager.instance = new ABTestingManager()
    }
    return ABTestingManager.instance
  }

  // Get user's variant for a specific test
  getUserVariant(testId: string, userId: string): string | null {
    const test = this.activeTests.get(testId)
    if (!test || test.status !== "running") return null

    // Use consistent hashing to assign users to variants
    const hash = this.hashString(`${testId}-${userId}`)
    const normalizedHash = hash % 100

    // Check if user should be included in test
    if (normalizedHash >= test.trafficSplit) return null

    // Assign to variant based on weights
    let cumulativeWeight = 0
    const testHash = hash % test.trafficSplit

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight
      if (testHash < (cumulativeWeight * test.trafficSplit) / 100) {
        return variant.id
      }
    }

    return test.variants[0]?.id || null
  }

  // Track conversion events
  async trackEvent(testId: string, variantId: string, userId: string, event: string, metadata?: Record<string, any>) {
    const result: ABTestResult = {
      testId,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      event,
      timestamp: new Date(),
      metadata,
    }

    // Store in database or analytics service
    await this.storeResult(result)
  }

  // Register a new test
  registerTest(test: ABTest) {
    this.activeTests.set(test.id, test)
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private getSessionId(): string {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("ab-session-id")
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15)
        sessionStorage.setItem("ab-session-id", sessionId)
      }
      return sessionId
    }
    return "server-session"
  }

  private async storeResult(result: ABTestResult) {
    try {
      await fetch("/api/ab-testing/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      })
    } catch (error) {
      console.error("Failed to track A/B test result:", error)
    }
  }
}

export const abTesting = ABTestingManager.getInstance()

// Predefined tests
export const LAYOUT_TESTS = {
  HOMEPAGE_HERO: {
    id: "homepage-hero-v1",
    name: "Homepage Hero Layout",
    description: "Test different hero section layouts for conversion",
    variants: [
      { id: "control", name: "Current Layout", weight: 50, config: { layout: "current" } },
      { id: "minimal", name: "Minimal Layout", weight: 25, config: { layout: "minimal" } },
      { id: "video", name: "Video Background", weight: 25, config: { layout: "video" } },
    ],
    status: "running" as const,
    startDate: new Date(),
    targetMetric: "search_initiated",
    trafficSplit: 80,
  },
  PROPERTY_CARDS: {
    id: "property-cards-v1",
    name: "Property Card Design",
    description: "Test different property card layouts for engagement",
    variants: [
      { id: "control", name: "Current Cards", weight: 50, config: { cardStyle: "current" } },
      { id: "compact", name: "Compact Cards", weight: 50, config: { cardStyle: "compact" } },
    ],
    status: "running" as const,
    startDate: new Date(),
    targetMetric: "property_click",
    trafficSplit: 60,
  },
}
