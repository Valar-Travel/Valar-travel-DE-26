"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { checkFeatureAccess } from "@/lib/subscription-utils"

interface FeatureGateProps {
  feature: string
  userId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, userId, children, fallback }: FeatureGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAccess() {
      try {
        const access = await checkFeatureAccess(userId, feature as any)
        setHasAccess(access)
      } catch (error) {
        console.error("Error checking feature access:", error)
        setHasAccess(false)
      }
    }

    checkAccess()
  }, [feature, userId])

  if (hasAccess === null) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">This feature requires a higher subscription plan.</p>
        </div>
      )
    )
  }

  return <>{children}</>
}
