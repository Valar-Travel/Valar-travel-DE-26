import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// This endpoint resets the admin password - should be removed after use
export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json()
    
    // Simple security check - require a secret key
    if (secretKey !== "RESET_ADMIN_2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    
    // Generate fresh bcrypt hash for ValarAdmin2024!
    const password = "ValarAdmin2024!"
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // First, check if admin_users table exists
    const { error: checkError } = await supabase
      .from("admin_users")
      .select("*")

    // Delete existing admin users
    const { error: deleteError } = await supabase
      .from("admin_users")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    // Continue even if delete fails (table might be empty)

    // Insert fresh admin users
    const { data: insertData, error: insertError } = await supabase
      .from("admin_users")
      .insert([
        {
          email: "admin@valartravel.de",
          password_hash: passwordHash,
          name: "Admin",
          role: "super_admin",
          is_active: true
        },
        {
          email: "hello@valartravel.de",
          password_hash: passwordHash,
          name: "Valar Admin",
          role: "super_admin",
          is_active: true
        }
      ])
      .select()

    if (insertError) {
      return NextResponse.json({ 
        error: "Failed to create admin users", 
        details: insertError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin users reset successfully",
      users: insertData?.map(u => ({ email: u.email, name: u.name })),
      password: "ValarAdmin2024!"
    })

  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
