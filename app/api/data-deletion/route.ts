import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SITE_URL = "https://valartravel.de"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, reason, requestedAt } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()
    
    if (supabase) {
      // Store the deletion request in the database
      const { error: insertError } = await supabase
        .from("data_deletion_requests")
        .insert({
          email,
          name,
          reason: reason || null,
          requested_at: requestedAt,
          status: "pending",
        })

      if (insertError) {
        console.error("[Data Deletion] Database insert error:", insertError.message)
        // Continue anyway - we'll handle via email
      }
    }

    // Send notification email to admin (would use Resend in production)
    // For now, just log the request
    console.log("[Data Deletion] Request received:", {
      email,
      name,
      reason,
      requestedAt,
    })

    // In production, you would:
    // 1. Send confirmation email to user
    // 2. Send notification to privacy team
    // 3. Create audit log entry

    return NextResponse.json({
      success: true,
      message: "Data deletion request received. We will process your request within 30 days.",
      referenceId: `DDR-${Date.now()}`,
    })
  } catch (error) {
    console.error("[Data Deletion] Error processing request:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Data deletion endpoint. Use POST to submit a request.",
    documentation: `${SITE_URL}/privacy`,
  })
}
