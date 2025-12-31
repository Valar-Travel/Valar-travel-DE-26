import { createClient } from "@/lib/supabase/server"
import { getUserFeatures } from "@/lib/subscription-utils"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

export async function checkRateLimit(userId: string, endpoint: string): Promise<RateLimitResult> {
  const supabase = createClient()
  const features = await getUserFeatures(userId)

  // Get rate limit based on subscription
  const hourlyLimit = features.maxApiCalls === -1 ? 10000 : Math.floor(features.maxApiCalls / 24)

  const now = new Date()
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
  const resetTime = new Date(hourStart.getTime() + 60 * 60 * 1000).getTime()

  // Check current usage
  const { data: usage } = await supabase
    .from("api_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .gte("created_at", hourStart.toISOString())
    .single()

  const currentUsage = usage?.count || 0
  const remaining = Math.max(0, hourlyLimit - currentUsage)
  const success = currentUsage < hourlyLimit

  if (success) {
    // Increment usage
    await supabase.from("api_usage").upsert({
      user_id: userId,
      endpoint,
      count: currentUsage + 1,
      created_at: now.toISOString(),
    })
  }

  return {
    success,
    limit: hourlyLimit,
    remaining: remaining - (success ? 1 : 0),
    resetTime,
  }
}
