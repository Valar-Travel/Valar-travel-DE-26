import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generatePropertyDescription, batchGenerateDescriptions } from "@/lib/ai-description-generator"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { propertyId, batchUpdate } = await request.json()

    const supabase = await createClient()

    // Single property update
    if (propertyId && !batchUpdate) {
      const { data: property, error: fetchError } = await supabase
        .from("scraped_luxury_properties")
        .select("*")
        .eq("id", propertyId)
        .single()

      if (fetchError || !property) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 })
      }

      const enhancedDescription = await generatePropertyDescription({
        name: property.name,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        amenities: property.amenities,
        price_per_night: property.price_per_night,
        existing_description: property.description,
      })

      const { error: updateError } = await supabase
        .from("scraped_luxury_properties")
        .update({ description: enhancedDescription })
        .eq("id", propertyId)

      if (updateError) {
        return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        description: enhancedDescription,
      })
    }

    // Batch update for all properties with missing/short descriptions
    if (batchUpdate) {
      const { data: properties, error: fetchError } = await supabase
        .from("scraped_luxury_properties")
        .select("*")
        .or("description.is.null,description.eq.")
        .limit(50)

      if (fetchError) {
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
      }

      if (!properties || properties.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No properties need description updates",
          updated: 0,
        })
      }

      const descriptions = await batchGenerateDescriptions(properties)

      // Update all properties
      const updates = Array.from(descriptions.entries()).map(([id, description]) =>
        supabase.from("scraped_luxury_properties").update({ description }).eq("id", id),
      )

      await Promise.all(updates)

      return NextResponse.json({
        success: true,
        message: `Updated ${descriptions.size} property descriptions`,
        updated: descriptions.size,
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error enhancing descriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to check how many properties need descriptions
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { count, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*", { count: "exact", head: true })
      .or("description.is.null,description.eq.")

    if (error) {
      return NextResponse.json({ error: "Failed to count properties" }, { status: 500 })
    }

    return NextResponse.json({
      propertiesNeedingDescriptions: count || 0,
    })
  } catch (error) {
    console.error("[v0] Error checking descriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
