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

// Re-export config and utilities for external use
export { EMAIL_CONFIG, emailWrapper, newsletterWrapper, SUPPORT_PHONE }
