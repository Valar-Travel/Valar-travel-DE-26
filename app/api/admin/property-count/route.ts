import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from("scraped_luxury_properties")
      .select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // Get count by location
    const { data: allProperties, error: allError } = await supabase
      .from("scraped_luxury_properties")
      .select("id, name, location, images, created_at")
      .order("created_at", { ascending: false })

    if (allError) {
      return NextResponse.json({ error: allError.message }, { status: 500 })
    }

    // Count by location
    const locationCounts: Record<string, number> = {}
    let withImages = 0
    let withoutImages = 0

    allProperties?.forEach((p) => {
      const loc = p.location || "Unknown"
      locationCounts[loc] = (locationCounts[loc] || 0) + 1

      if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        withImages++
      } else {
        withoutImages++
      }
    })

    // Get 5 most recent
    const recentProperties = allProperties?.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      imageCount: Array.isArray(p.images) ? p.images.length : 0,
      createdAt: p.created_at,
    }))

    return NextResponse.json({
      totalCount,
      locationCounts,
      withImages,
      withoutImages,
      recentProperties,
    })
  } catch (error) {
    console.error("Error counting properties:", error)
    return NextResponse.json({ error: "Failed to count properties" }, { status: 500 })
  }
}
