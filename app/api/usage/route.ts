import { createClient } from "@/lib/supabase/server"
import { getUserFeatures } from "@/lib/subscription-utils"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        features: { maxProjects: 0, maxApiCalls: 0, hasAdvancedFeatures: false },
        usage: { projects: 0, apiCalls: 0, storage: 0 },
      })
    }

    // Get user's subscription features
    const features = await getUserFeatures(user.id)

    // Get current usage statistics
    const { data: savedTrips } = await supabase.from("saved_trips").select("id").eq("user_id", user.id)

    const { data: apiUsage } = await supabase
      .from("api_usage")
      .select("count")
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const totalApiCalls = apiUsage?.reduce((sum, usage) => sum + usage.count, 0) || 0

    return NextResponse.json({
      features,
      usage: {
        projects: savedTrips?.length || 0,
        apiCalls: totalApiCalls,
        storage: 0,
      },
    })
  } catch (error: any) {
    console.error("Error fetching usage:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
