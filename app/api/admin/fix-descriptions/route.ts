import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Find all properties with missing descriptions
    const { data: propertiesWithoutDescription, error: fetchError } = await supabase
      .from("scraped_luxury_properties")
      .select("id, name, location, bedrooms, bathrooms, sleeps")
      .or("description.is.null,description.eq.")

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!propertiesWithoutDescription || propertiesWithoutDescription.length === 0) {
      return NextResponse.json({ 
        message: "All properties already have descriptions",
        updated: 0 
      })
    }

    // Update each property with a generated description
    let updatedCount = 0
    const errors: string[] = []

    for (const property of propertiesWithoutDescription) {
      const description = generateDescription(property)
      
      const { error: updateError } = await supabase
        .from("scraped_luxury_properties")
        .update({ description })
        .eq("id", property.id)

      if (updateError) {
        errors.push(`Failed to update ${property.name}: ${updateError.message}`)
      } else {
        updatedCount++
      }
    }

    return NextResponse.json({
      message: `Updated ${updatedCount} properties with descriptions`,
      updated: updatedCount,
      total: propertiesWithoutDescription.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error("Error fixing descriptions:", error)
    return NextResponse.json(
      { error: "Failed to fix descriptions" },
      { status: 500 }
    )
  }
}

function generateDescription(property: {
  name: string
  location: string | null
  bedrooms: number | null
  bathrooms: number | null
  sleeps: number | null
}): string {
  const location = property.location || "the Caribbean"
  const bedrooms = property.bedrooms || 3
  const bathrooms = property.bathrooms || 2
  const sleeps = property.sleeps || 6

  return `Welcome to ${property.name}, an exceptional luxury retreat nestled in the heart of ${location}. This stunning property offers ${bedrooms} beautifully appointed bedrooms and ${bathrooms} elegantly designed bathrooms, comfortably accommodating up to ${sleeps} guests.

Experience the perfect blend of sophisticated Caribbean living and modern comfort. The villa features expansive living spaces with breathtaking views, allowing you to fully immerse yourself in the natural beauty of the surroundings.

Every detail has been carefully curated to ensure an unforgettable stay. From the premium finishes throughout to the thoughtfully designed outdoor areas, this property exemplifies the finest in Caribbean luxury living.

Whether you're seeking a romantic getaway, a family vacation, or a memorable gathering with friends, ${property.name} provides the ideal setting for creating lasting memories in paradise.`
}

// GET endpoint to check properties without descriptions
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error, count } = await supabase
      .from("scraped_luxury_properties")
      .select("id, name, location", { count: "exact" })
      .or("description.is.null,description.eq.")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      propertiesWithoutDescription: data?.length || 0,
      properties: data
    })

  } catch (error) {
    console.error("Error checking descriptions:", error)
    return NextResponse.json(
      { error: "Failed to check descriptions" },
      { status: 500 }
    )
  }
}
