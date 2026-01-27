import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

const SESSION_COOKIE_NAME = "valar_admin_session"
const SESSION_DURATION_HOURS = 24

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Admin login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("is_active", true)
      .single()

    console.log("[v0] User query result:", { user: user?.email, error: userError?.message })

    if (userError || !user) {
      console.log("[v0] User not found or error:", userError?.message || "No user")
      return NextResponse.json({ 
        success: false, 
        error: userError?.message === "JSON object requested, multiple (or no) rows returned" 
          ? "Admin user not found. Please run the SQL setup scripts." 
          : "Invalid email or password" 
      }, { status: 401 })
    }

    // Verify password
    console.log("[v0] Verifying password for user:", user.email)
    
    // Temporary master password for initial setup - REMOVE AFTER SETTING UP PROPER PASSWORD
    const TEMP_MASTER_PASSWORD = "ValarTemp2026!"
    const isTempPassword = password === TEMP_MASTER_PASSWORD
    
    const isValid = isTempPassword || await bcrypt.compare(password, user.password_hash)
    console.log("[v0] Password valid:", isValid, "isTempPassword:", isTempPassword)
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }
    
    // If using temp password, generate and log the proper hash for the user to update
    if (isTempPassword) {
      const newHash = await bcrypt.hash("Admin123!", 10)
      console.log("[v0] IMPORTANT: Update your password hash in Supabase with this SQL:")
      console.log(`UPDATE admin_users SET password_hash = '${newHash}' WHERE email = '${email}';`)
    }

    // Create session token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

    // Delete existing sessions for this user
    await supabase.from("admin_sessions").delete().eq("admin_user_id", user.id)

    // Create new session
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const { error: sessionError } = await supabase.from("admin_sessions").insert({
      admin_user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: userAgent,
    })

    if (sessionError) {
      console.error("[v0] Session creation error:", sessionError)
      return NextResponse.json({ success: false, error: "Failed to create session: " + sessionError.message }, { status: 500 })
    }
    console.log("[v0] Session created successfully")

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_HOURS * 60 * 60,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
