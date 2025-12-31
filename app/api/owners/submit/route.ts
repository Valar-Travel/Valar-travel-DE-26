import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, propertyLocation, propertyType, message } = body

    // Validate required fields
    if (!name || !email || !propertyLocation || !propertyType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Store the owner inquiry in the villa_owners table
    const { data, error } = await supabase
      .from("villa_owners")
      .insert({
        name,
        email,
        phone: phone || null,
        company_name: propertyLocation, // Using location as company name for now
        status: "pending",
        application_data: {
          propertyLocation,
          propertyType,
          message,
          submittedAt: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error submitting owner inquiry:", error)
      return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry! We will contact you within 24 hours.",
      data,
    })
  } catch (error) {
    console.error("[v0] Error in owners submit API:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
