import { createClient } from "@/lib/supabase/server"

export interface SubscriptionFeatures {
  maxProjects: number
  maxApiCalls: number
  maxStorage: number // in GB
  hasAdvancedAnalytics: boolean
  hasPrioritySupport: boolean
  hasCustomIntegrations: boolean
}

export const PLAN_FEATURES: Record<string, SubscriptionFeatures> = {
  starter: {
    maxProjects: 5,
    maxApiCalls: 1000,
    maxStorage: 1,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
  },
  pro: {
    maxProjects: 50,
    maxApiCalls: 10000,
    maxStorage: 10,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: false,
  },
  enterprise: {
    maxProjects: -1, // unlimited
    maxApiCalls: -1, // unlimited
    maxStorage: -1, // unlimited
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: true,
  },
}

export async function getUserSubscription(userId: string) {
  const supabase = createClient()

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*, subscription_plans(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  return subscription
}

export async function getUserFeatures(userId: string): Promise<SubscriptionFeatures> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    // Free tier features
    return {
      maxProjects: 1,
      maxApiCalls: 100,
      maxStorage: 0.1,
      hasAdvancedAnalytics: false,
      hasPrioritySupport: false,
      hasCustomIntegrations: false,
    }
  }

  const planName = subscription.subscription_plans?.name?.toLowerCase() || "starter"
  return PLAN_FEATURES[planName] || PLAN_FEATURES.starter
}

export async function checkFeatureAccess(userId: string, feature: keyof SubscriptionFeatures): Promise<boolean> {
  const features = await getUserFeatures(userId)
  return Boolean(features[feature])
}

export async function checkUsageLimit(
  userId: string,
  limitType: "projects" | "apiCalls" | "storage",
  currentUsage: number,
): Promise<boolean> {
  const features = await getUserFeatures(userId)

  switch (limitType) {
    case "projects":
      return features.maxProjects === -1 || currentUsage < features.maxProjects
    case "apiCalls":
      return features.maxApiCalls === -1 || currentUsage < features.maxApiCalls
    case "storage":
      return features.maxStorage === -1 || currentUsage < features.maxStorage
    default:
      return false
  }
}
