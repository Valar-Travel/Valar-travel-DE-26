import { NextResponse } from "next/server"

export async function GET() {
  const testEmail = "sarahkuhmichel5@gmail.com"

  try {
    console.log(`[v0] Triggering test emails to ${testEmail}...`)

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/test-all-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: testEmail }),
    })

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Failed to trigger test emails:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send test emails",
      },
      { status: 500 },
    )
  }
}
