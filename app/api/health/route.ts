import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.2",
    environment: process.env.NODE_ENV || "development",
    database: {
      connected: false,
      ssl: true,
      error: null as string | null,
    },
    cache: {
      headers: "no-store",
      revalidate: 0,
    },
  }

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase.from("scraped_luxury_properties").select("id").limit(1)

    if (error) throw error

    healthCheck.database.connected = true
    healthCheck.database.ssl = true
    healthCheck.database.error = null
  } catch (error) {
    healthCheck.status = "unhealthy"
    healthCheck.database.connected = false
    healthCheck.database.error = error instanceof Error ? error.message : "Unknown error"
  }

  return NextResponse.json(healthCheck, {
    status: healthCheck.status === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
