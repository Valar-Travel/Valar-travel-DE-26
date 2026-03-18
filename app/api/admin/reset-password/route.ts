import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

/**
 * Admin Password Reset Endpoint
 * 
 * SECURITY: This endpoint requires environment variables for credentials.
 * Set ADMIN_RESET_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD in your environment.
 * 
 * This should only be used for initial setup or emergency recovery.
 */
export async function POST(request: Request) {
  try {
    const { secretKey, email, password } = await request.json()
    
    // Require secret key from environment
    const adminResetSecret = process.env.ADMIN_RESET_SECRET
    if (!adminResetSecret) {
      return NextResponse.json({ 
        error: "Reset functionality not configured" 
      }, { status: 503 })
    }
    
    if (secretKey !== adminResetSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required inputs
    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required" 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 12) {
      return NextResponse.json({ 
        error: "Password must be at least 12 characters" 
      }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Generate bcrypt hash with appropriate cost factor
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({ 
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq("email", email.toLowerCase())

      if (updateError) {
        return NextResponse.json({ 
          error: "Failed to update password", 
          details: updateError.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: "Password updated successfully",
        email: email.toLowerCase()
      })
    } else {
      // Create new admin user
      const { error: insertError } = await supabase
        .from("admin_users")
        .insert({
          email: email.toLowerCase(),
          password_hash: passwordHash,
          name: "Admin",
          role: "admin",
          is_active: true
        })

      if (insertError) {
        return NextResponse.json({ 
          error: "Failed to create admin user", 
          details: insertError.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: "Admin user created successfully",
        email: email.toLowerCase()
      })
    }

  } catch {
    return NextResponse.json({ 
      error: "Internal server error"
    }, { status: 500 })
  }
}
