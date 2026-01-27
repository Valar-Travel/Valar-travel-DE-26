import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Update all properties to have location "Barbados"
    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .update({ location: "Barbados" })
      .neq("location", "Barbados")
      .select("id")

    if (error) {
      console.error("[v0] Error updating properties:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const updatedCount = data?.length || 0

    // Get total count
    const { count } = await supabase.from("scraped_luxury_properties").select("*", { count: "exact", head: true })

    // Get Barbados count to verify
    const { count: barbadosCount } = await supabase
      .from("scraped_luxury_properties")
      .select("*", { count: "exact", head: true })
      .ilike("location", "%Barbados%")

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} properties to Barbados`,
      totalProperties: count,
      barbadosProperties: barbadosCount,
    })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to update properties" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Get counts by location
    const { data: properties } = await supabase.from("scraped_luxury_properties").select("location")

    const locationCounts: Record<string, number> = {}
    properties?.forEach((p) => {
      const loc = p.location || "Unknown"
      locationCounts[loc] = (locationCounts[loc] || 0) + 1
    })

    return NextResponse.json({
      totalProperties: properties?.length || 0,
      locationBreakdown: locationCounts,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get counts" }, { status: 500 })
  }
}
