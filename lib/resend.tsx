import { Resend } from "resend"
import { emailWrapper, newsletterWrapper, EMAIL_CONFIG } from "./email-templates/base"
import {
  welcomeContent,
  contactNotificationContent,
  contactAutoReplyContent,
  bookingInquiryContent,
  destinationInfoContent,
  DESTINATION_INFO,
} from "./email-templates/generators"

const resend = new Resend(process.env.RESEND_API_KEY)
const { COMPANY_EMAIL, SITE_URL, SUPPORT_PHONE } = EMAIL_CONFIG

// Welcome email for newsletter subscribers
export async function sendWelcomeEmail(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: "Welcome to Valar Travel - Your Caribbean Adventure Awaits",
      html: newsletterWrapper(welcomeContent(name), email, "Welcome to exclusive Caribbean luxury villa experiences"),
      headers: {
        "List-Unsubscribe": `<${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Contact form email - sends to Sarah and auto-reply to user
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  inquiryType?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Send notification to Sarah
    await resend.emails.send({
      from: `Valar Travel Website <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      replyTo: data.email,
      subject: `[Contact Form] ${data.subject || data.inquiryType || "New Inquiry"} from ${data.name}`,
      html: emailWrapper(contactNotificationContent(data)),
    })

    // Send auto-reply to customer
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.email,
      replyTo: COMPANY_EMAIL,
      subject: "Thank you for your inquiry - Valar Travel",
      html: emailWrapper(contactAutoReplyContent(data), "We've received your message and will respond shortly"),
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Booking/Availability Inquiry Response
export async function sendBookingInquiryResponse(data: {
  name: string
  email: string
  villaName?: string
  destination?: string
  dates?: { checkIn?: string; checkOut?: string }
}): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.email,
      replyTo: COMPANY_EMAIL,
      subject: `Your Booking Inquiry${data.villaName ? ` - ${data.villaName}` : ""} | Valar Travel`,
      html: emailWrapper(bookingInquiryContent(data), "We're checking availability for your dream Caribbean villa"),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Destination Information
export async function sendDestinationInfo(data: {
  name: string
  email: string
  destination: "barbados" | "st-lucia" | "jamaica" | "st-barthelemy"
}): Promise<{ success: boolean; error?: string }> {
  try {
    const info = DESTINATION_INFO[data.destination]
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.email,
      replyTo: COMPANY_EMAIL,
      subject: `Discover ${info.name} - Your Luxury Villa Guide | Valar Travel`,
      html: emailWrapper(destinationInfoContent(data), `Everything you need to know about luxury villas in ${info.name}`),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Pricing & Payment Information
export async function sendPricingInfo(data: {
  name: string
  email: string
  villaName: string
  nights: number
  pricePerNight: number
  totalPrice: number
  currency?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const curr = data.currency || "EUR"
    const content = `<h2 style="color: #0c4a6e; font-size: 24px; margin-bottom: 20px;">Your Quote for ${data.villaName}, ${data.name}</h2><p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Thank you for your interest. Here's the pricing breakdown for your requested stay:</p><div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0;"><p style="margin: 0;"><strong>Property:</strong> ${data.villaName}</p><p style="margin: 8px 0 0 0;"><strong>Duration:</strong> ${data.nights} nights</p><p style="margin: 8px 0 0 0;"><strong>Rate:</strong> ${curr} ${data.pricePerNight.toLocaleString()}/night</p><p style="margin: 12px 0 0 0; font-size: 18px;"><strong>Total:</strong> ${curr} ${data.totalPrice.toLocaleString()}</p></div><p style="color: #374151; font-size: 16px; line-height: 1.6;">This quote is valid for 7 days. To proceed, reply to this email or contact me via WhatsApp.</p><p style="text-align: center; margin: 30px 0;"><a href="https://wa.me/4916092527436" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Book Now</a></p>`
    
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.email,
      replyTo: COMPANY_EMAIL,
      subject: `Your Quote for ${data.villaName} | Valar Travel`,
      html: emailWrapper(content, `Your personalized quote for ${data.villaName}`),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Generic email sender for custom emails
export async function sendCustomEmail(data: {
  to: string
  subject: string
  content: string
  preheader?: string
  replyTo?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.to,
      replyTo: data.replyTo || COMPANY_EMAIL,
      subject: data.subject,
      html: emailWrapper(data.content, data.preheader),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Booking confirmation email after successful payment
export async function sendBookingConfirmationEmail(data: {
  guestName: string
  guestEmail: string
  villaName: string
  location: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  depositAmount: number
  totalAmount: number
  remainingAmount: number
  depositPercentage: number
  currency: string
  bookingId?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const isDepositPayment = data.depositPercentage < 100
    const formattedCheckIn = new Date(data.checkIn).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const formattedCheckOut = new Date(data.checkOut).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

    const content = `
      <h2 style="color: #0c4a6e; font-size: 24px; margin-bottom: 20px;">Booking Confirmation</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Dear ${data.guestName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Thank you for your booking! ${isDepositPayment ? `Your ${data.depositPercentage}% deposit has been received.` : "Your payment has been confirmed."}
      </p>
      
      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #0c4a6e; margin: 0 0 16px 0;">Booking Details</h3>
        <p style="margin: 8px 0;"><strong>Property:</strong> ${data.villaName}</p>
        <p style="margin: 8px 0;"><strong>Location:</strong> ${data.location}</p>
        <p style="margin: 8px 0;"><strong>Check-in:</strong> ${formattedCheckIn}</p>
        <p style="margin: 8px 0;"><strong>Check-out:</strong> ${formattedCheckOut}</p>
        <p style="margin: 8px 0;"><strong>Duration:</strong> ${data.nights} night${data.nights > 1 ? "s" : ""}</p>
        <p style="margin: 8px 0;"><strong>Guests:</strong> ${data.guests}</p>
        ${data.bookingId ? `<p style="margin: 8px 0;"><strong>Booking ID:</strong> ${data.bookingId}</p>` : ""}
      </div>

      <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #854d0e; margin: 0 0 16px 0;">Payment Summary</h3>
        ${isDepositPayment ? `
          <p style="margin: 8px 0;"><strong>Deposit Paid (${data.depositPercentage}%):</strong> ${data.currency} ${data.depositAmount.toLocaleString()}</p>
          <p style="margin: 8px 0;"><strong>Total Amount:</strong> ${data.currency} ${data.totalAmount.toLocaleString()}</p>
          <p style="margin: 8px 0; color: #dc2626;"><strong>Remaining Balance:</strong> ${data.currency} ${data.remainingAmount.toLocaleString()}</p>
          <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">The remaining balance is due 30 days before check-in.</p>
        ` : `
          <p style="margin: 8px 0;"><strong>Total Paid:</strong> ${data.currency} ${data.totalAmount.toLocaleString()}</p>
        `}
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 24px 0;">
        I'll be in touch shortly with additional details about your stay, including check-in instructions and local recommendations.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        If you have any questions, feel free to reach out via email or WhatsApp.
      </p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/4916092527436" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Contact via WhatsApp</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.guestEmail,
      replyTo: COMPANY_EMAIL,
      subject: `Booking Confirmed: ${data.villaName} | Valar Travel`,
      html: emailWrapper(content, `Your booking for ${data.villaName} is confirmed`),
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Partnership inquiry email
export async function sendPartnershipEmail(data: {
  brandName: string
  contactName: string
  email: string
  phone?: string
  collaborationType: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Send notification to Sarah
    const notificationContent = `
      <h2 style="color: #0c4a6e; font-size: 24px; margin-bottom: 20px;">New Partnership Inquiry</h2>
      
      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 8px 0;"><strong>Brand:</strong> ${data.brandName}</p>
        <p style="margin: 8px 0;"><strong>Contact:</strong> ${data.contactName}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <p style="margin: 8px 0;"><strong>Collaboration Type:</strong> ${data.collaborationType}</p>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <h3 style="color: #374151; margin: 0 0 12px 0;">Message:</h3>
        <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
    `

    await resend.emails.send({
      from: `Valar Travel Website <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      replyTo: data.email,
      subject: `[Partnership] ${data.collaborationType} inquiry from ${data.brandName}`,
      html: emailWrapper(notificationContent),
    })

    // Send auto-reply to partner
    const autoReplyContent = `
      <h2 style="color: #0c4a6e; font-size: 24px; margin-bottom: 20px;">Thank You for Your Partnership Inquiry</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Dear ${data.contactName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Thank you for reaching out about a potential ${data.collaborationType.toLowerCase()} collaboration with Valar Travel. 
        I'm excited to learn more about ${data.brandName} and explore how we might work together.
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        I'll review your inquiry and get back to you within 48 hours with my thoughts and next steps.
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        In the meantime, feel free to explore our portfolio at <a href="${SITE_URL}" style="color: #0ea5e9;">valartravel.de</a>.
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: data.email,
      replyTo: COMPANY_EMAIL,
      subject: "Thank you for your partnership inquiry - Valar Travel",
      html: emailWrapper(autoReplyContent, "We've received your partnership inquiry"),
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Re-export config and utilities for external use
export { EMAIL_CONFIG, emailWrapper, newsletterWrapper, SUPPORT_PHONE }
export async function sendCancellationPolicy(email: string) {
  try {
    await resend.emails.send({
      from: `Your Company <${COMPANY_EMAIL}>`,
      to: email,
      subject: "Cancellation Policy",
      html: `<p>Your cancellation policy details...</p>`,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
