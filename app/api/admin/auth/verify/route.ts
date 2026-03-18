import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

const SESSION_COOKIE_NAME = "valar_admin_session"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select(`
        *,
        admin_users (
          id,
          email,
          name,
          role,
          is_active
        )
      `)
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session || !session.admin_users) {
      // Clear invalid cookie
      cookieStore.delete(SESSION_COOKIE_NAME)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const user = session.admin_users as {
      id: string
      email: string
      name: string
      role: string
      is_active: boolean
    }

    if (!user.is_active) {
      cookieStore.delete(SESSION_COOKIE_NAME)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
