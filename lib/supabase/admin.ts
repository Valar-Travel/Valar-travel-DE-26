import { createClient } from "@supabase/supabase-js"

// Admin client with service role key for admin operations
// This bypasses RLS policies
let adminClient: ReturnType<typeof createClient> | null = null

export function createAdminClient() {
  if (adminClient) {
    return adminClient
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[v0] Missing Supabase admin credentials")
    throw new Error("Missing Supabase admin credentials")
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
