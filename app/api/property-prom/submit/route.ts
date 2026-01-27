import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to submit a property" }, { status: 401 })
    }

    const body = await request.json()

    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      propertyName,
      propertyType,
      country,
      location,
      address,
      bedrooms,
      bathrooms,
      maxGuests,
      pricePerNight,
      description,
      amenities,
      images,
    } = body

    // Validation
    if (!ownerName || !propertyName || !country || !location) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    // Insert submission
    const { data, error } = await supabase
      .from("property_prom_submissions")
      .insert({
        user_id: user.id,
        owner_name: ownerName,
        owner_email: ownerEmail || user.email,
        owner_phone: ownerPhone || null,
        property_name: propertyName,
        property_type: propertyType || "villa",
        country,
        location,
        address: address || null,
        bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
        bathrooms: bathrooms ? Number.parseInt(bathrooms) : null,
        max_guests: maxGuests ? Number.parseInt(maxGuests) : null,
        price_per_night: pricePerNight ? Number.parseFloat(pricePerNight) : null,
        description: description || null,
        amenities: amenities || [],
        images: images || [],
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error inserting property submission:", error)
      return NextResponse.json({ error: "Failed to submit property. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Property submitted successfully! Our team will review it within 48 hours.",
      data,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
