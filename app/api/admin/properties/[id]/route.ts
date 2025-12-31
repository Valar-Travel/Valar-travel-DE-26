import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminAuth = request.headers.get("x-admin-auth")
    if (adminAuth !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const supabase = createClient()

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }

    if (body.name !== undefined) updates.name = body.name
    if (body.location !== undefined) updates.location = body.location
    if (body.description !== undefined) updates.description = body.description
    if (body.price_per_night !== undefined) updates.price_per_night = body.price_per_night
    if (body.images !== undefined) updates.images = body.images
    if (body.amenities !== undefined) updates.amenities = body.amenities
    if (body.rating !== undefined) updates.rating = body.rating

    const { data, error } = await supabase
      .from("scraped_luxury_properties")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating property:", error)
      return NextResponse.json({ error: "Failed to update property", details: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in property update API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminAuth = request.headers.get("x-admin-auth")
    if (adminAuth !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const supabase = createClient()

    const { error } = await supabase.from("scraped_luxury_properties").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting property:", error)
      return NextResponse.json({ error: "Failed to delete property", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in property delete API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
