import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: properties } = await supabase.from("scraped_luxury_properties").select("id, name, location, source_url")

  const locationCounts: Record<string, number> = {}
  properties?.forEach((p) => {
    locationCounts[p.location || "Unknown"] = (locationCounts[p.location || "Unknown"] || 0) + 1
  })

  return NextResponse.json({
    message: "Property location overview",
    total: properties?.length || 0,
    byLocation: locationCounts,
    sample: properties?.slice(0, 10).map((p) => ({
      name: p.name,
      location: p.location,
      source: p.source_url ? new URL(p.source_url).hostname : "unknown",
    })),
  })
}

export async function POST(request: Request) {
  try {
    const { from, to } = await request.json()

    if (!from || !to) {
      return NextResponse.json({ error: "Provide 'from' and 'to' location names" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .update({ location: to, updated_at: new Date().toISOString() })
      .eq("location", from)
      .select("id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${data?.length || 0} properties from "${from}" to "${to}"`,
      count: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update locations" }, { status: 500 })
  }
}
