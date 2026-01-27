import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Fetch user's favorites
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ favorites: [] }, { status: 200 })
    }

    // Fetch user's favorites with property details
    const { data: favorites, error } = await supabase
      .from("user_favorites")
      .select(
        `
        id,
        property_id,
        created_at,
        scraped_luxury_properties (
          id,
          name,
          location,
          rating,
          price_per_night,
          original_price,
          currency,
          images,
          property_type,
          star_rating,
          luxury_score,
          is_luxury
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching favorites:", error)
      return NextResponse.json({ favorites: [] }, { status: 200 })
    }

    return NextResponse.json({
      favorites: favorites || [],
      userId: user.id,
    })
  } catch (error) {
    console.error("[v0] Favorites GET error:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

// POST - Add a property to favorites
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", propertyId)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Already in favorites", favoriteId: existing.id })
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: user.id,
        property_id: propertyId,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding favorite:", error)
      return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
    }

    return NextResponse.json({ success: true, favorite })
  } catch (error) {
    console.error("[v0] Favorites POST error:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

// DELETE - Remove a property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    // Remove from favorites
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId)

    if (error) {
      console.error("[v0] Error removing favorite:", error)
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Favorites DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}
