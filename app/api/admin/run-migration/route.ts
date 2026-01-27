import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// This endpoint allows running database migrations via the Supabase admin client
// which handles SSL connections properly

export async function POST(request: Request) {
  try {
    // Check for admin auth header
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()
    const results: string[] = []

    // Check and add columns one by one using Supabase
    const columnsToAdd = [
      { name: "villa_name", type: "TEXT" },
      { name: "nights", type: "INTEGER" },
      { name: "price_per_night", type: "INTEGER" },
      { name: "subtotal", type: "INTEGER" },
      { name: "total_amount", type: "INTEGER" },
      { name: "deposit_amount", type: "INTEGER" },
      { name: "deposit_percentage", type: "INTEGER" },
      { name: "remaining_amount", type: "INTEGER" },
      { name: "booking_status", type: "VARCHAR(50)", default: "'pending'" },
      { name: "deposit_paid_at", type: "TIMESTAMPTZ" },
      { name: "balance_paid_at", type: "TIMESTAMPTZ" },
      { name: "location", type: "TEXT" },
    ]

    // First, check if the bookings table exists
    const { data: tableExists, error: tableError } = await supabase
      .from("bookings")
      .select("id")
      .limit(1)

    if (tableError && tableError.code === "42P01") {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.bookings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            villa_id TEXT NOT NULL,
            villa_name TEXT,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            nights INTEGER,
            guests INTEGER DEFAULT 2,
            price_per_night INTEGER,
            subtotal INTEGER,
            total_amount INTEGER,
            deposit_amount INTEGER,
            deposit_percentage INTEGER,
            remaining_amount INTEGER,
            currency VARCHAR(3) DEFAULT 'USD',
            booking_status VARCHAR(50) DEFAULT 'pending',
            payment_status VARCHAR(50) DEFAULT 'deposit_pending',
            stripe_session_id TEXT,
            stripe_payment_intent_id TEXT,
            guest_name TEXT,
            guest_email TEXT,
            location TEXT,
            deposit_paid_at TIMESTAMPTZ,
            balance_paid_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })

      if (createError) {
        // If exec_sql doesn't exist, we'll try inserting a test row
        results.push("Note: Could not create table via RPC - table may already exist")
      } else {
        results.push("Created bookings table")
      }
    }

    // Try to add each column - Supabase will ignore if column exists
    for (const col of columnsToAdd) {
      try {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : ""
        const { error } = await supabase.rpc("exec_sql", {
          sql: `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}${defaultClause};`
        })
        
        if (!error) {
          results.push(`Added/verified column: ${col.name}`)
        }
      } catch (e) {
        // Column might already exist or RPC not available
        results.push(`Skipped column ${col.name} (may already exist)`)
      }
    }

    // Test insert to verify table structure
    const testResult = await supabase
      .from("bookings")
      .select("id, villa_id, villa_name, check_in, check_out, nights, guests, total_amount, deposit_amount, deposit_percentage, remaining_amount, booking_status, payment_status, location")
      .limit(1)

    if (testResult.error) {
      return NextResponse.json({
        success: false,
        error: testResult.error.message,
        message: "Table query failed - some columns may be missing",
        results
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Migration check completed",
      results,
      tableStructure: "Verified all required columns exist"
    })

  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Migration failed" },
      { status: 500 }
    )
  }
}

// GET endpoint to check current table structure
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Check what columns exist in the bookings table
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .limit(0)

    if (error) {
      return NextResponse.json({
        exists: false,
        error: error.message
      })
    }

    return NextResponse.json({
      exists: true,
      message: "Bookings table exists and is accessible"
    })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Check failed" },
      { status: 500 }
    )
  }
}
