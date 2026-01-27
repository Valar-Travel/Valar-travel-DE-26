import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "4")

    const crmEnabled = await checkCRMTablesExist()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let recommendations: any[] = []

    // Only attempt personalized recommendations if CRM is enabled
    if (crmEnabled && user?.email) {
      const { data: customer } = await supabase
        .from("customer_profiles")
        .select("preferred_destinations, preferred_property_types, budget_range")
        .eq("email", user.email)
        .single()

      if (customer?.preferred_destinations?.length > 0) {
        const { data: matchedProperties } = await supabase
          .from("scraped_luxury_properties")
          .select("*")
          .in("destination", customer.preferred_destinations)
          .limit(limit)

        if (matchedProperties) {
          recommendations = matchedProperties.map((p) => ({
            ...p,
            match_reason: "Your favorite destination",
          }))
        }
      }
    }

    // If no personalized recommendations, get popular properties
    if (recommendations.length === 0) {
      const { data: popularProperties } = await supabase
        .from("scraped_luxury_properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      recommendations =
        popularProperties?.map((p) => ({
          ...p,
          match_reason: "Popular choice",
        })) || []
    }

    return NextResponse.json({ recommendations, crm_enabled: crmEnabled })
  } catch (error: any) {
    console.warn("Recommendations API error:", error?.message)
    return NextResponse.json({ recommendations: [], crm_enabled: false })
  }
}
