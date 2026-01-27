import { NextResponse } from "next/server"
import { sendPartnershipEmail } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { brandName, contactName, email, phone, collaborationType, message } = body

    // Validate required fields
    if (!brandName || !contactName || !email || !collaborationType || !message) {
      return NextResponse.json(
        { error: "Brand name, contact name, email, collaboration type, and message are required" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Partnerships] RESEND_API_KEY not configured")
      return NextResponse.json(
        { error: "Email service not configured. Please contact us directly at hello@valartravel.de" },
        { status: 500 },
      )
    }

    // Send partnership emails via Resend
    const result = await sendPartnershipEmail({
      brandName,
      contactName,
      email,
      phone,
      collaborationType,
      message,
    })

    if (!result.success) {
      console.error("[Partnerships] Failed to send email:", result.error)
      return NextResponse.json(
        { error: "Failed to send inquiry. Please try again or contact us directly." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your partnership inquiry has been submitted! We'll get back to you within 48 hours.",
    })
  } catch (error) {
    console.error("[Partnerships] Error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
