import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

const SESSION_COOKIE_NAME = "valar_admin_session"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (sessionToken) {
      const supabase = createAdminClient()
      await supabase.from("admin_sessions").delete().eq("token", sessionToken)
    }

    cookieStore.delete(SESSION_COOKIE_NAME)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
