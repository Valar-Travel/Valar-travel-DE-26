import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, formType, additionalData } = body

    // Validate required fields
    if (!name || !email || !message || !formType) {
      return NextResponse.json({ error: "Name, email, message, and form type are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Validate form type
    if (!["guest", "owner", "partner"].includes(formType)) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Contact] RESEND_API_KEY not configured")
      return NextResponse.json(
        { error: "Email service not configured. Please contact us directly at sarah@valartravel.de" },
        { status: 500 },
      )
    }

    // Send email via Resend
    const result = await sendContactEmail({
      name,
      email,
      phone,
      message,
      formType,
      additionalData,
    })

    if (!result.success) {
      console.error("[Contact] Failed to send email:", result.error)
      return NextResponse.json(
        { error: "Failed to send message. Please try again or contact us directly." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent! We'll get back to you within 24 hours.",
    })
  } catch (error) {
    console.error("[Contact] Error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
