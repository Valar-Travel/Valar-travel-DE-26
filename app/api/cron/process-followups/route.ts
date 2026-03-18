import { NextResponse } from "next/server"
import { processPendingFollowups } from "@/lib/booking-followup-scheduler"

// This endpoint should be called by a cron job every hour
// Configure in vercel.json with: "crons": [{ "path": "/api/cron/process-followups", "schedule": "0 * * * *" }]

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await processPendingFollowups()
    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}
