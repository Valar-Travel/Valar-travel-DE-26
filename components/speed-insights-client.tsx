"use client"

import dynamic from "next/dynamic"

const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights), {
  ssr: false,
})

export function SpeedInsightsClient() {
  // Only load in production or when VERCEL env is present
  if (typeof window === "undefined") return null

  const isVercel =
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("valartravel.de") ||
    document.querySelector('meta[name="vercel-deployment-id"]')

  if (!isVercel) return null

  return <SpeedInsights />
}
