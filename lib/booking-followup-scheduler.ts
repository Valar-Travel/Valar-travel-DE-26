import { createAdminClient } from "@/lib/supabase/admin"

// Follow-up types and their timing
const FOLLOWUP_SCHEDULE = {
  welcome: { delay: 0, name: "Welcome Email" },                    // Immediately after booking
  pre_arrival: { delay: -3, name: "Pre-Arrival Checklist" },       // 3 days before check-in
  itinerary: { delay: -1, name: "Personalized Itinerary" },        // 1 day before check-in
  during_stay: { delay: 2, name: "During Stay Check-in" },         // 2 days into stay
  review_request: { delay: 1, name: "Review Request" },            // 1 day after checkout
} as const

type FollowupType = keyof typeof FOLLOWUP_SCHEDULE

interface BookingData {
  id: string
  user_id: string
  villa_name: string
  villa_id: string
  check_in: string
  check_out: string
  guests: number
  total_amount: number
  currency: string
  guest_email: string
  guest_name: string
}

interface FollowupContent {
  subject: string
  previewText: string
  sections: {
    title: string
    content: string
    cta?: { text: string; url: string }
  }[]
}

// Schedule all follow-ups for a new booking
export async function scheduleBookingFollowups(booking: BookingData): Promise<void> {
  try {
    const supabase = await createAdminClient()
    
    // Check if user has consented to marketing communications
    const { data: consent } = await supabase
      .from("user_privacy_consent")
      .select("marketing_communications")
      .eq("user_id", booking.user_id)
      .single()

    const checkInDate = new Date(booking.check_in)
    const checkOutDate = new Date(booking.check_out)

    const followups: {
      booking_id: string
      user_id: string
      followup_type: string
      scheduled_for: string
      content_data: FollowupContent
    }[] = []

    // Always schedule welcome email (immediate)
    followups.push({
      booking_id: booking.id,
      user_id: booking.user_id,
      followup_type: "welcome",
      scheduled_for: new Date().toISOString(),
      content_data: generateWelcomeContent(booking),
    })

    // Only schedule marketing emails if consented
    if (consent?.marketing_communications) {
      // Pre-arrival (3 days before)
      const preArrivalDate = new Date(checkInDate)
      preArrivalDate.setDate(preArrivalDate.getDate() - 3)
      if (preArrivalDate > new Date()) {
        followups.push({
          booking_id: booking.id,
          user_id: booking.user_id,
          followup_type: "pre_arrival",
          scheduled_for: preArrivalDate.toISOString(),
          content_data: generatePreArrivalContent(booking),
        })
      }

      // Personalized itinerary (1 day before)
      const itineraryDate = new Date(checkInDate)
      itineraryDate.setDate(itineraryDate.getDate() - 1)
      if (itineraryDate > new Date()) {
        followups.push({
          booking_id: booking.id,
          user_id: booking.user_id,
          followup_type: "itinerary",
          scheduled_for: itineraryDate.toISOString(),
          content_data: generateItineraryContent(booking),
        })
      }

      // During stay check-in (2 days after check-in)
      const duringStayDate = new Date(checkInDate)
      duringStayDate.setDate(duringStayDate.getDate() + 2)
      if (duringStayDate < checkOutDate) {
        followups.push({
          booking_id: booking.id,
          user_id: booking.user_id,
          followup_type: "during_stay",
          scheduled_for: duringStayDate.toISOString(),
          content_data: generateDuringStayContent(booking),
        })
      }

      // Review request (1 day after checkout)
      const reviewDate = new Date(checkOutDate)
      reviewDate.setDate(reviewDate.getDate() + 1)
      followups.push({
        booking_id: booking.id,
        user_id: booking.user_id,
        followup_type: "review_request",
        scheduled_for: reviewDate.toISOString(),
        content_data: generateReviewRequestContent(booking),
      })
    }

    // Insert all follow-ups
    if (followups.length > 0) {
      await supabase.from("booking_followup_queue").insert(followups)
    }
  } catch {
    // Silent fail - follow-ups are best effort
  }
}

// Generate welcome email content
function generateWelcomeContent(booking: BookingData): FollowupContent {
  return {
    subject: `Your Caribbean Escape Awaits - ${booking.villa_name}`,
    previewText: "Your booking is confirmed. Here's what to expect...",
    sections: [
      {
        title: "Booking Confirmed",
        content: `Thank you for choosing ${booking.villa_name} for your Caribbean getaway, ${booking.guest_name}. We're honored to be part of your journey.`,
      },
      {
        title: "Your Stay Details",
        content: `
          Check-in: ${new Date(booking.check_in).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          Check-out: ${new Date(booking.check_out).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          Guests: ${booking.guests}
        `,
      },
      {
        title: "What's Next",
        content: "Our concierge team will reach out within 24 hours to discuss arrival arrangements and any special requests.",
        cta: { text: "View Your Booking", url: "/dashboard/bookings" },
      },
    ],
  }
}

// Generate pre-arrival checklist content
function generatePreArrivalContent(booking: BookingData): FollowupContent {
  return {
    subject: `3 Days Until Paradise - ${booking.villa_name}`,
    previewText: "Your pre-arrival checklist and what to pack...",
    sections: [
      {
        title: "Your Arrival is Almost Here",
        content: `Just 3 days until you arrive at ${booking.villa_name}. Here's everything you need to know.`,
      },
      {
        title: "Pre-Arrival Checklist",
        content: `
          - Passport and travel documents ready
          - Flight details confirmed
          - Transfer arrangements (contact concierge if needed)
          - Dietary preferences shared with staff
          - Special requests submitted
        `,
      },
      {
        title: "Packing Essentials",
        content: `
          - Lightweight, breathable clothing
          - Swimwear and beach cover-ups
          - Sun protection (SPF 30+, hat, sunglasses)
          - Comfortable walking shoes for exploration
          - Evening attire for fine dining
        `,
      },
      {
        title: "Need Anything?",
        content: "Our concierge can arrange pre-stocking of groceries, spa appointments, restaurant reservations, and more.",
        cta: { text: "Contact Concierge", url: "/contact" },
      },
    ],
  }
}

// Generate personalized itinerary content
function generateItineraryContent(booking: BookingData): FollowupContent {
  return {
    subject: `Your Personalized Itinerary - Arriving Tomorrow`,
    previewText: "Curated experiences just for you...",
    sections: [
      {
        title: "Tomorrow You Arrive in Paradise",
        content: `We've curated some experiences based on your preferences to make your stay at ${booking.villa_name} unforgettable.`,
      },
      {
        title: "Arrival Day",
        content: `
          - Private airport transfer awaits
          - Welcome refreshments at the villa
          - Villa orientation with your dedicated staff
          - Sunset cocktails on the terrace
        `,
      },
      {
        title: "Recommended Experiences",
        content: `
          - Private catamaran sailing excursion
          - Chef's table dinner at award-winning restaurants
          - Spa & wellness treatments
          - Hidden beach discoveries
          - Local cultural experiences
        `,
        cta: { text: "Explore All Experiences", url: "/experiences" },
      },
      {
        title: "Your Villa Contact",
        content: "Your villa manager will be available 24/7 during your stay. Their details are in your booking confirmation.",
      },
    ],
  }
}

// Generate during-stay check-in content
function generateDuringStayContent(booking: BookingData): FollowupContent {
  return {
    subject: `How's Your Stay at ${booking.villa_name}?`,
    previewText: "We hope you're enjoying paradise...",
    sections: [
      {
        title: "Checking In",
        content: "We hope you're settling in beautifully. Is there anything we can do to make your stay even more perfect?",
      },
      {
        title: "Exclusive Add-Ons",
        content: `
          - Private chef dinner experience
          - Couples' spa treatment at the villa
          - Sunset yacht cruise
          - Helicopter island tour
          - Photography session
        `,
        cta: { text: "Request an Experience", url: "/contact" },
      },
      {
        title: "Local Secrets",
        content: "Ask your villa staff about hidden gems - the best local rum shop, secret beaches, and sunset spots only locals know.",
      },
    ],
  }
}

// Generate review request content
function generateReviewRequestContent(booking: BookingData): FollowupContent {
  return {
    subject: `Share Your Experience at ${booking.villa_name}`,
    previewText: "Your feedback helps us serve you better...",
    sections: [
      {
        title: "Welcome Home",
        content: `We hope your time at ${booking.villa_name} created memories to last a lifetime. We'd love to hear about your experience.`,
      },
      {
        title: "Share Your Story",
        content: "Your feedback helps future guests discover their perfect villa and helps us continue to improve.",
        cta: { text: "Leave a Review", url: `/properties/${booking.villa_id}#reviews` },
      },
      {
        title: "Book Again & Save",
        content: "As a returning guest, enjoy 10% off your next booking at any Valar Travel property.",
        cta: { text: "Plan Your Next Escape", url: "/properties" },
      },
    ],
  }
}

// Process pending follow-ups (called by cron job)
export async function processPendingFollowups(): Promise<{ processed: number; errors: number }> {
  try {
    const supabase = await createAdminClient()
    
    // Get pending follow-ups that are due
    const { data: pendingFollowups } = await supabase
      .from("booking_followup_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .limit(50)

    if (!pendingFollowups || pendingFollowups.length === 0) {
      return { processed: 0, errors: 0 }
    }

    let processed = 0
    let errors = 0

    for (const followup of pendingFollowups) {
      try {
        // Here you would integrate with your email service (Resend, SendGrid, etc.)
        // For now, we'll just mark as sent
        // await sendEmail(followup.user_id, followup.content_data)

        await supabase
          .from("booking_followup_queue")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", followup.id)

        processed++
      } catch (error) {
        await supabase
          .from("booking_followup_queue")
          .update({ 
            status: "failed", 
            error_message: error instanceof Error ? error.message : "Unknown error" 
          })
          .eq("id", followup.id)

        errors++
      }
    }

    return { processed, errors }
  } catch {
    return { processed: 0, errors: 0 }
  }
}

// Cancel all pending follow-ups for a cancelled booking
export async function cancelBookingFollowups(bookingId: string): Promise<void> {
  try {
    const supabase = await createAdminClient()
    
    await supabase
      .from("booking_followup_queue")
      .update({ status: "cancelled" })
      .eq("booking_id", bookingId)
      .eq("status", "pending")
  } catch {
    // Silent fail
  }
}
