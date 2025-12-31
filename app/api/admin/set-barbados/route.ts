import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET request - just visit /api/admin/set-barbados in your browser
export async function GET() {
  try {
    const supabase = createClient()

    // Update ALL properties to Barbados
    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .update({ location: "Barbados" })
      .neq("location", "Barbados") // Only update those not already Barbados
      .select("id")

    if (error) {
      console.error("[v0] Error updating properties:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get total count
    const { count } = await supabase.from("scraped_luxury_properties").select("*", { count: "exact", head: true })

    return NextResponse.json({
      success: true,
      message: `Updated ${data?.length || 0} properties to Barbados`,
      totalProperties: count,
      allBarbados: true,
    })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to update properties" }, { status: 500 })
  }
}
