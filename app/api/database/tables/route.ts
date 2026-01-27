import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get list of tables from information schema
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_type", "BASE TABLE")

    if (error) {
      // Fallback: return known tables
      const knownTables = [
        "villas",
        "scraped_luxury_properties",
        "profiles",
        "bookings",
        "newsletter_subscribers",
        "contact_submissions",
        "blog_posts",
        "destinations",
        "amenities",
        "property_reviews",
        "user_journey_sessions",
        "user_journey_events",
        "crm_customer_profiles",
        "audience_segments",
      ]

      const tableInfo = []
      for (const tableName of knownTables) {
        try {
          const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

          if (count !== null) {
            tableInfo.push({ table_name: tableName, row_count: count })
          }
        } catch {
          // Table doesn't exist, skip
        }
      }

      return NextResponse.json({ tables: tableInfo })
    }

    return NextResponse.json({ tables: data })
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 })
  }
}
