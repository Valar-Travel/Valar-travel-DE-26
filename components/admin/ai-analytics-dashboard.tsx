"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Users, 
  Eye, 
  MousePointer, 
  ShoppingCart,
  TrendingUp,
  Mail,
  Shield,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface AnalyticsData {
  period: { days: number; from: string; to: string }
  recommendations: {
    total: number
    shown: number
    clicked: number
    booked: number
    ctr: number
    conversionRate: number
  }
  consent: {
    basic: number
    ai: number
    marketing: number
    social: number
    total: number
  }
  profiles: {
    total: number
    highConfidence: number
    confidence_rate: number
  }
  signals: {
    total: number
    byType: Record<string, number>
  }
  followups: {
    total: number
    byStatus: Record<string, number>
  }
  topPerformers: {
    property_id: string
    match_score: number
    was_clicked: boolean
    was_booked: boolean
    scraped_properties: { name: string; location: string }
  }[]
}

export function AIAnalyticsDashboard() {
  const [days, setDays] = useState(30)
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(
    `/api/admin/ai-analytics?days=${days}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-neutral-500">
        Failed to load analytics
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            AI Personalization Analytics
          </h2>
          <p className="text-sm text-neutral-500">
            Track recommendation performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Eye}
          label="Recommendations Shown"
          value={data.recommendations.shown}
          subtext={`${data.recommendations.total} generated`}
        />
        <MetricCard
          icon={MousePointer}
          label="Click-Through Rate"
          value={`${data.recommendations.ctr}%`}
          subtext={`${data.recommendations.clicked} clicks`}
          highlight={data.recommendations.ctr > 5}
        />
        <MetricCard
          icon={ShoppingCart}
          label="Conversion Rate"
          value={`${data.recommendations.conversionRate}%`}
          subtext={`${data.recommendations.booked} bookings`}
          highlight={data.recommendations.conversionRate > 2}
        />
        <MetricCard
          icon={Users}
          label="AI Profiles"
          value={data.profiles.total}
          subtext={`${data.profiles.confidence_rate}% high confidence`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consent Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Consent Distribution
            </CardTitle>
            <CardDescription>User opt-in rates by consent type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ConsentBar label="Basic Personalization" value={data.consent.basic} total={data.consent.total} />
              <ConsentBar label="AI Recommendations" value={data.consent.ai} total={data.consent.total} />
              <ConsentBar label="Marketing Emails" value={data.consent.marketing} total={data.consent.total} />
              <ConsentBar label="Social Analysis" value={data.consent.social} total={data.consent.total} />
            </div>
          </CardContent>
        </Card>

        {/* Signal Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              User Signals Collected
            </CardTitle>
            <CardDescription>{data.signals.total.toLocaleString()} signals in period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.signals.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                  <span className="text-sm font-medium">{count.toLocaleString()}</span>
                </div>
              ))}
              {Object.keys(data.signals.byType).length === 0 && (
                <p className="text-sm text-neutral-400">No signals collected yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-ups and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follow-up Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Automated Follow-ups
            </CardTitle>
            <CardDescription>{data.followups.total} emails scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.followups.byStatus).map(([status, count]) => (
                <div key={status} className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-2xl font-semibold">{count}</p>
                  <p className="text-xs text-neutral-500 capitalize">{status}</p>
                </div>
              ))}
              {Object.keys(data.followups.byStatus).length === 0 && (
                <p className="text-sm text-neutral-400 col-span-2">No follow-ups scheduled yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Recommendations</CardTitle>
            <CardDescription>Properties with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPerformers.slice(0, 5).map((item, idx) => (
                <div key={item.property_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {item.scraped_properties?.name || "Unknown Property"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.scraped_properties?.location || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Math.round(item.match_score)}% match</p>
                    {item.was_booked && (
                      <span className="text-xs text-emerald-600">Converted</span>
                    )}
                  </div>
                </div>
              ))}
              {data.topPerformers.length === 0 && (
                <p className="text-sm text-neutral-400">No recommendation data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  subtext: string
  highlight?: boolean
}

function MetricCard({ icon: Icon, label, value, subtext, highlight }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500">{label}</p>
            <p className={cn(
              "text-3xl font-semibold mt-1",
              highlight && "text-emerald-600"
            )}>
              {value}
            </p>
            <p className="text-xs text-neutral-400 mt-1">{subtext}</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            highlight ? "bg-emerald-100" : "bg-neutral-100"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              highlight ? "text-emerald-600" : "text-neutral-500"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ConsentBarProps {
  label: string
  value: number
  total: number
}

function ConsentBar({ label, value, total }: ConsentBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
