import { Metadata } from "next"
import { AIAnalyticsDashboard } from "@/components/admin/ai-analytics-dashboard"

export const metadata: Metadata = {
  title: "AI Analytics | Valar Travel Admin",
  description: "Track AI personalization performance and user engagement",
}

export default function AIAnalyticsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AIAnalyticsDashboard />
      </div>
    </div>
  )
}
