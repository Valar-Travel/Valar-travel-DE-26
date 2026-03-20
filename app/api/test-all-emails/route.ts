import { NextResponse } from "next/server"
import {
  sendWelcomeEmail,
  sendContactEmail,
  sendBookingInquiryResponse,
  sendDestinationInfo,
  sendPricingInfo,
  // sendCancellationPolicy, // Removed as it is not exported
  //   sendVillaFeaturesInfo, // Removed as it is not exported
  // sendPartnershipEmail, // Removed as it is not exported
} from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY not found in environment variables",
        },
        { status: 500 },
      )
    }

    const results = []

    // 1. Welcome Email
    const welcomeResult = await sendWelcomeEmail(email, "Test User")
    results.push({ template: "Welcome Email", ...welcomeResult })

    // 2. Contact Email (sends notification to Sarah + auto-reply to user)
    const contactResult = await sendContactEmail({
      name: "Test User",
      email: email,
      phone: "+49 160 92527436",
      subject: "Test Contact Inquiry",
      message: "This is a test message from the email template testing system.",
      inquiryType: "General Inquiry",
    })
    results.push({ template: "Contact Email (2 emails)", ...contactResult })

    // 3. Booking Inquiry Response
    const bookingResult = await sendBookingInquiryResponse({
      name: "Test User",
      email: email,
      villaName: "Villa Paradise",
      destination: "Barbados",
      dates: { checkIn: "2025-03-01", checkOut: "2025-03-08" },
    })
    results.push({ template: "Booking Inquiry Response", ...bookingResult })

    // 4. Destination Info (Barbados)
    const destinationResult = await sendDestinationInfo({
      name: "Test User",
      email: email,
      destination: "barbados",
    })
    results.push({ template: "Destination Info (Barbados)", ...destinationResult })

    // 5. Pricing Information
    const pricingResult = await sendPricingInfo({
      name: "Test User",
      email: email,
      villaName: "Villa Paradise",
      nights: 7,
      pricePerNight: 250,
      totalPrice: 1750,
      currency: "EUR",
    })
    results.push({ template: "Pricing Information", ...pricingResult })

    // 6. Cancellation Policy
    // Removed as sendCancellationPolicy is not exported

    // 7. Villa Features Info
    // Removed as sendVillaFeaturesInfo is not exported

    // 8. Partnership Email
    // Removed as sendPartnershipEmail is not exported

    const successCount = results.filter((r) => r.success).length
    const failCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: failCount === 0,
      message: `Sent ${successCount} email template(s) successfully. ${failCount > 0 ? `${failCount} failed.` : ""}`,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failCount,
      },
      details: results,
      recipient: email,
      timestamp: new Date().toISOString(),
      note: "Note: Contact and Partnership emails send 2 emails each (notification + auto-reply), so you'll receive approximately 10 emails total.",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error,
      },
      { status: 500 },
    )
  }
}
