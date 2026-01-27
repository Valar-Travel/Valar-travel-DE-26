"use server"

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Temporary endpoint to generate a password hash
// DELETE THIS FILE AFTER USE
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }
    
    const hash = await bcrypt.hash(password, 10)
    
    return NextResponse.json({ 
      password,
      hash,
      sql: `UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@valartravel.de';`
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 })
  }
}
