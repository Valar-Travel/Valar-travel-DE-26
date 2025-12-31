import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const adminAuth = request.headers.get("x-admin-auth")
    if (adminAuth !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const search = searchParams.get("search") || ""

    console.log("[v0] Properties GET - filter:", filter)
    console.log("[v0] Properties GET - search:", search)

    let query = supabase.from("scraped_luxury_properties").select("*").order("created_at", { ascending: false })

    // Only apply search filter if it's a real search term (not a URL from scraper)
    if (search && !search.startsWith("http")) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching properties:", error)
      return NextResponse.json({ error: "Failed to fetch properties", details: error.message }, { status: 500 })
    }

    console.log("[v0] Properties GET - returned count:", data?.length || 0)

    if (data && data.length > 0) {
      console.log("[v0] Properties GET - first property:", {
        id: data[0].id,
        name: data[0].name,
        images: data[0].images?.length || 0,
        location: data[0].location,
      })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error in properties API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminAuth = request.headers.get("x-admin-auth")
    if (adminAuth !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()

    if (!body.name || !body.location || !body.rating) {
      return NextResponse.json({ error: "Missing required fields (name, location, rating)" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .insert({
        name: body.name || body.property_name,
        location: body.location || body.city || "Barbados",
        rating: body.rating || 4.5,
        price_per_night: body.price_per_night || 0,
        currency: body.currency || "USD",
        description: body.description || "",
        amenities: body.amenities || [],
        images: body.images || [],
        affiliate_links: body.affiliate_links || {},
        source_url: body.source_url || "",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating property:", error)
      return NextResponse.json({ error: "Failed to create property", details: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully created property:", data.name)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in property creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminAuth = request.headers.get("x-admin-auth")
    if (adminAuth !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Delete all properties from the table
    const { error } = await supabase
      .from("scraped_luxury_properties")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // This trick deletes all rows

    if (error) {
      console.error("[v0] Error deleting all properties:", error)
      return NextResponse.json({ error: "Failed to delete properties", details: error.message }, { status: 500 })
    }

    console.log("[v0] Successfully deleted all properties")
    return NextResponse.json({ message: "All properties deleted successfully" })
  } catch (error) {
    console.error("[v0] Error in delete all:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
