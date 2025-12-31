"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { abTesting } from "@/lib/ab-testing"

interface ABTestWrapperProps {
  testId: string
  userId?: string
  children: React.ReactNode
  variants: Record<string, React.ReactNode>
  fallback?: React.ReactNode
}

export function ABTestWrapper({ testId, userId, children, variants, fallback }: ABTestWrapperProps) {
  const [variant, setVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const effectiveUserId = userId || generateAnonymousId()
    const assignedVariant = abTesting.getUserVariant(testId, effectiveUserId)
    setVariant(assignedVariant)
    setIsLoading(false)

    // Track test exposure
    if (assignedVariant) {
      abTesting.trackEvent(testId, assignedVariant, effectiveUserId, "test_exposure")
    }
  }, [testId, userId])

  if (isLoading) {
    return fallback || children
  }

  if (!variant || !variants[variant]) {
    return children // Return control/default
  }

  return <>{variants[variant]}</>
}

function generateAnonymousId(): string {
  if (typeof window !== "undefined") {
    let anonymousId = localStorage.getItem("anonymous-user-id")
    if (!anonymousId) {
      anonymousId = "anon_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("anonymous-user-id", anonymousId)
    }
    return anonymousId
  }
  return "server-user"
}
