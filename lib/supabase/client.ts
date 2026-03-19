import { createBrowserClient } from "@supabase/ssr"

// Use a global variable to ensure true singleton across module reloads (HMR)
const globalForSupabase = globalThis as typeof globalThis & {
  supabaseBrowserClient?: ReturnType<typeof createBrowserClient>
}

const mockClient = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
    signUp: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: new Error("Supabase not configured - OAuth unavailable") }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
      then: (resolve: any) => resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
} as any

export function createClient() {
  // Return existing global singleton if available
  if (globalForSupabase.supabaseBrowserClient) {
    return globalForSupabase.supabaseBrowserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging
  console.log("[v0] Supabase client init - URL exists:", !!supabaseUrl, "Key exists:", !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith("http")) {
    console.error("[v0] Supabase env vars missing or invalid - using mock client")
    return mockClient
  }

  // Only create client in browser environment
  if (typeof window !== "undefined") {
    console.log("[v0] Creating real Supabase browser client")
    globalForSupabase.supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return globalForSupabase.supabaseBrowserClient
  }

  // Return mock for SSR (should use server client instead)
  console.log("[v0] SSR environment - returning mock")
  return mockClient
}
