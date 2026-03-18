import { createClient } from "@/lib/supabase/server"

// Types
export interface FollowupContent {
  subject: string
  template: string
  personalized_data: Record<string, unknown>
}

export interface FollowupQueueItem {
  id: string
  booking_id: string
  user_id: string
  followup_type: string
  scheduled_for: string
  content_data: FollowupContent
  status: "pending" | "sent" | "failed" | "cancelled"
}

type FollowupType = "welcome" | "pre_arrival" | "itinerary" | "local_experiences" | "post_stay" | "loyalty_offer"

// ============================================================================
// Schedule Follow-ups After Booking
// ============================================================================
export async function scheduleBookingFollowups(
  bookingId: string,
  userId: string,
  bookingDetails: {
    villaName: string
    location: string
    checkIn: string
    checkOut: string
    guestName: string
  }
) {
  const supabase = await createClient()
  
  // Check if user has consent for marketing communications
  const { data: consent } = await supabase
    .from("user_privacy_consent")
    .select("marketing_communications")
    .eq("user_id", userId)
    .single()

  if (!consent?.marketing_communications) {
    // Only schedule essential booking-related emails
    await scheduleEssentialFollowups(bookingId, userId, bookingDetails)
    return
  }

  // Schedule full personalized follow-up sequence
  const checkInDate = new Date(bookingDetails.checkIn)
  const checkOutDate = new Date(bookingDetails.checkOut)
  const now = new Date()

  const followups: Array<{
    type: FollowupType
    scheduledFor: Date
    content: FollowupContent
  }> = [
    // Immediate: Welcome & Confirmation
    {
      type: "welcome",
      scheduledFor: now,
      content: generateWelcomeContent(bookingDetails),
    },
    // 7 days before: Pre-arrival checklist
    {
      type: "pre_arrival",
      scheduledFor: addDays(checkInDate, -7),
      content: generatePreArrivalContent(bookingDetails),
    },
    // 3 days before: Personalized itinerary
    {
      type: "itinerary",
      scheduledFor: addDays(checkInDate, -3),
      content: generateItineraryContent(bookingDetails),
    },
    // 1 day before: Local experiences
    {
      type: "local_experiences",
      scheduledFor: addDays(checkInDate, -1),
      content: generateLocalExperiencesContent(bookingDetails),
    },
    // 2 days after checkout: Review request
    {
      type: "post_stay",
      scheduledFor: addDays(checkOutDate, 2),
      content: generatePostStayContent(bookingDetails),
    },
    // 30 days after: Loyalty offer
    {
      type: "loyalty_offer",
      scheduledFor: addDays(checkOutDate, 30),
      content: generateLoyaltyContent(bookingDetails),
    },
  ]

  // Filter out past dates and insert into queue
  const validFollowups = followups.filter(f => f.scheduledFor > now)
  
  for (const followup of validFollowups) {
    await supabase
      .from("booking_followup_queue")
      .insert({
        booking_id: bookingId,
        user_id: userId,
        followup_type: followup.type,
        scheduled_for: followup.scheduledFor.toISOString(),
        content_data: followup.content,
        status: "pending",
      })
  }

  return { scheduled: validFollowups.length }
}

async function scheduleEssentialFollowups(
  bookingId: string,
  userId: string,
  bookingDetails: {
    villaName: string
    location: string
    checkIn: string
    checkOut: string
    guestName: string
  }
) {
  const supabase = await createClient()
  const checkInDate = new Date(bookingDetails.checkIn)
  const now = new Date()

  // Only essential booking emails (no marketing)
  const essentialFollowups = [
    {
      type: "welcome" as const,
      scheduledFor: now,
      content: generateWelcomeContent(bookingDetails),
    },
    {
      type: "pre_arrival" as const,
      scheduledFor: addDays(checkInDate, -3),
      content: {
        subject: `Your stay at ${bookingDetails.villaName} is approaching`,
        template: "pre_arrival_essential",
        personalized_data: {
          villa_name: bookingDetails.villaName,
          check_in: bookingDetails.checkIn,
          guest_name: bookingDetails.guestName,
        },
      },
    },
  ]

  const validFollowups = essentialFollowups.filter(f => f.scheduledFor > now)

  for (const followup of validFollowups) {
    await supabase
      .from("booking_followup_queue")
      .insert({
        booking_id: bookingId,
        user_id: userId,
        followup_type: followup.type,
        scheduled_for: followup.scheduledFor.toISOString(),
        content_data: followup.content,
        status: "pending",
      })
  }
}

// ============================================================================
// Content Generators
// ============================================================================
function generateWelcomeContent(details: { villaName: string; location: string; checkIn: string; checkOut: string; guestName: string }): FollowupContent {
  return {
    subject: `Welcome to Valar Travel - Your ${details.villaName} booking is confirmed!`,
    template: "welcome",
    personalized_data: {
      guest_name: details.guestName,
      villa_name: details.villaName,
      location: details.location,
      check_in: formatDate(details.checkIn),
      check_out: formatDate(details.checkOut),
      nights: calculateNights(details.checkIn, details.checkOut),
      concierge_phone: "+1 (555) 123-4567",
      concierge_whatsapp: "+15551234567",
    },
  }
}

function generatePreArrivalContent(details: { villaName: string; location: string; checkIn: string; guestName: string }): FollowupContent {
  return {
    subject: `${details.guestName}, your Caribbean escape awaits in ${calculateDaysUntil(details.checkIn)} days`,
    template: "pre_arrival",
    personalized_data: {
      guest_name: details.guestName,
      villa_name: details.villaName,
      location: details.location,
      check_in: formatDate(details.checkIn),
      days_until: calculateDaysUntil(details.checkIn),
      checklist: [
        "Confirm your flight details with our concierge",
        "Review the villa's house manual (attached)",
        "Let us know any dietary preferences for grocery stocking",
        "Share your arrival time for seamless check-in",
      ],
      weather_tip: getWeatherTip(details.location),
    },
  }
}

function generateItineraryContent(details: { villaName: string; location: string; checkIn: string; checkOut: string; guestName: string }): FollowupContent {
  const experiences = getLocationExperiences(details.location)
  
  return {
    subject: `Your personalized ${details.location} itinerary is ready`,
    template: "itinerary",
    personalized_data: {
      guest_name: details.guestName,
      villa_name: details.villaName,
      location: details.location,
      check_in: formatDate(details.checkIn),
      check_out: formatDate(details.checkOut),
      recommended_experiences: experiences.slice(0, 5),
      dining_recommendations: getDiningRecommendations(details.location),
      insider_tips: getInsiderTips(details.location),
    },
  }
}

function generateLocalExperiencesContent(details: { villaName: string; location: string; guestName: string }): FollowupContent {
  return {
    subject: `Exclusive experiences await you in ${details.location}`,
    template: "local_experiences",
    personalized_data: {
      guest_name: details.guestName,
      location: details.location,
      exclusive_experiences: [
        {
          name: "Private Sunset Catamaran Cruise",
          description: "Sail along the coast with champagne and gourmet canapés",
          price_from: 450,
        },
        {
          name: "In-Villa Private Chef Experience",
          description: "A world-class chef prepares a 5-course Caribbean fusion dinner",
          price_from: 350,
        },
        {
          name: "Spa & Wellness Day",
          description: "Full-day spa treatment at a luxury resort",
          price_from: 280,
        },
      ],
      book_experiences_url: `https://valartravel.de/concierge?location=${encodeURIComponent(details.location)}`,
    },
  }
}

function generatePostStayContent(details: { villaName: string; location: string; guestName: string }): FollowupContent {
  return {
    subject: `${details.guestName}, how was your stay at ${details.villaName}?`,
    template: "post_stay",
    personalized_data: {
      guest_name: details.guestName,
      villa_name: details.villaName,
      location: details.location,
      review_url: "https://valartravel.de/review",
      referral_bonus: "€100 credit",
      referral_url: "https://valartravel.de/refer",
    },
  }
}

function generateLoyaltyContent(details: { villaName: string; location: string; guestName: string }): FollowupContent {
  return {
    subject: `${details.guestName}, your exclusive returning guest offer`,
    template: "loyalty_offer",
    personalized_data: {
      guest_name: details.guestName,
      previous_villa: details.villaName,
      previous_location: details.location,
      discount_percentage: 15,
      discount_code: `RETURN${Date.now().toString(36).toUpperCase()}`,
      valid_until: formatDate(addDays(new Date(), 90).toISOString()),
      suggested_destinations: getSuggestedDestinations(details.location),
    },
  }
}

// ============================================================================
// Helper Functions
// ============================================================================
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function calculateDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getWeatherTip(location: string): string {
  const tips: Record<string, string> = {
    "Barbados": "Expect warm tropical weather (26-30°C). Pack light, breathable clothing and don't forget sunscreen!",
    "St. Lucia": "Perfect weather awaits! Bring a light jacket for cooler evenings in the hills.",
    "Jamaica": "Hot and sunny conditions expected. Stay hydrated and enjoy the island vibes!",
    "St. Barthélemy": "Ideal beach weather. Pack your favorite swimwear and UV protection.",
  }
  return tips[location] || "Tropical Caribbean weather awaits - pack light and bring sunscreen!"
}

function getLocationExperiences(location: string): Array<{ name: string; type: string }> {
  const experiences: Record<string, Array<{ name: string; type: string }>> = {
    "Barbados": [
      { name: "Harrison's Cave Tour", type: "adventure" },
      { name: "Rum Distillery Experience", type: "culinary" },
      { name: "Catamaran Snorkeling Trip", type: "water" },
      { name: "Oistins Fish Fry", type: "cultural" },
      { name: "Golf at Sandy Lane", type: "sports" },
    ],
    "St. Lucia": [
      { name: "Pitons Hiking Adventure", type: "adventure" },
      { name: "Sulphur Springs Visit", type: "wellness" },
      { name: "Chocolate Making Tour", type: "culinary" },
      { name: "Sunset Sail", type: "romantic" },
      { name: "Rainforest Zip-lining", type: "adventure" },
    ],
    "Jamaica": [
      { name: "Dunn's River Falls", type: "adventure" },
      { name: "Blue Mountain Coffee Tour", type: "culinary" },
      { name: "Reggae Music Heritage Tour", type: "cultural" },
      { name: "Luminous Lagoon Night Swim", type: "unique" },
      { name: "Rafting on the Martha Brae", type: "relaxation" },
    ],
    "St. Barthélemy": [
      { name: "Beach Hopping Tour", type: "relaxation" },
      { name: "Fine Dining Experience", type: "culinary" },
      { name: "Yacht Charter", type: "luxury" },
      { name: "Shopping in Gustavia", type: "lifestyle" },
      { name: "Snorkeling at Colombier", type: "water" },
    ],
  }
  return experiences[location] || experiences["Barbados"]
}

function getDiningRecommendations(location: string): string[] {
  const dining: Record<string, string[]> = {
    "Barbados": ["The Cliff", "Champers", "Cin Cin by the Sea", "Lone Star"],
    "St. Lucia": ["Dasheene", "Coal Pot", "Boucan", "Jade Mountain Restaurant"],
    "Jamaica": ["Rockhouse Restaurant", "Pelican Bar", "Miss T's Kitchen", "Strawberry Hill"],
    "St. Barthélemy": ["L'Isola", "Bonito", "Maya's", "Le Tamarin"],
  }
  return dining[location] || dining["Barbados"]
}

function getInsiderTips(location: string): string[] {
  const tips: Record<string, string[]> = {
    "Barbados": [
      "Visit the Friday night fish fry at Oistins for authentic local culture",
      "The west coast has calmer waters - perfect for swimming",
      "Book sunset dinner reservations 2 days in advance",
    ],
    "St. Lucia": [
      "Wake early for the Pitons hike to avoid midday heat",
      "The Friday night street party in Gros Islet is a must",
      "Request a room/table with Pitons view - it's worth it",
    ],
    "Jamaica": [
      "Try the jerk chicken from the roadside stands - they're the best",
      "Book Dunn's River Falls early morning to avoid crowds",
      "The sunsets from Negril's 7-mile beach are legendary",
    ],
    "St. Barthélemy": [
      "Shell Beach is less crowded and great for snorkeling",
      "Reserve at popular restaurants at least a week ahead",
      "The Tuesday market in St. Jean is perfect for local finds",
    ],
  }
  return tips[location] || tips["Barbados"]
}

function getSuggestedDestinations(previousLocation: string): string[] {
  const suggestions: Record<string, string[]> = {
    "Barbados": ["St. Lucia", "Antigua", "Grenada"],
    "St. Lucia": ["Barbados", "St. Vincent", "Martinique"],
    "Jamaica": ["Turks & Caicos", "Cayman Islands", "Bahamas"],
    "St. Barthélemy": ["Anguilla", "St. Martin", "Virgin Gorda"],
  }
  return suggestions[previousLocation] || ["Barbados", "St. Lucia", "Jamaica"]
}

// ============================================================================
// Process Follow-up Queue (Called by cron job)
// ============================================================================
export async function processFollowupQueue() {
  const supabase = await createClient()
  
  // Get pending follow-ups that are due
  const { data: pendingFollowups } = await supabase
    .from("booking_followup_queue")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .limit(50)

  if (!pendingFollowups || pendingFollowups.length === 0) {
    return { processed: 0 }
  }

  let processed = 0
  let failed = 0

  for (const followup of pendingFollowups) {
    try {
      // Send email (integrate with your email service)
      await sendFollowupEmail(followup)
      
      // Mark as sent
      await supabase
        .from("booking_followup_queue")
        .update({ 
          status: "sent", 
          sent_at: new Date().toISOString() 
        })
        .eq("id", followup.id)
      
      processed++
    } catch (error) {
      // Mark as failed
      await supabase
        .from("booking_followup_queue")
        .update({ 
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error"
        })
        .eq("id", followup.id)
      
      failed++
    }
  }

  return { processed, failed }
}

async function sendFollowupEmail(followup: FollowupQueueItem) {
  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  // For now, just log the email that would be sent
  const content = followup.content_data
  
  // This would typically call your email API
  // await resend.emails.send({
  //   from: 'concierge@valartravel.de',
  //   to: userEmail,
  //   subject: content.subject,
  //   react: EmailTemplate({ ...content.personalized_data }),
  // })
  
  return { success: true }
}
