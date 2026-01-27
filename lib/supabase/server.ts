import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createMockClient() {
  const mockQueryBuilder = {
    select: (columns?: string) => mockQueryBuilder,
    eq: (column: string, value: any) => mockQueryBuilder,
    neq: (column: string, value: any) => mockQueryBuilder,
    ilike: (column: string, pattern: string) => mockQueryBuilder,
    not: (column: string, operator: string, value: any) => mockQueryBuilder,
    order: (column: string, options?: any) => mockQueryBuilder,
    limit: (count: number) => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  }

  const mockFromBuilder = {
    select: (columns?: string) => mockQueryBuilder,
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        then: (resolve: any) => resolve({ data: [], error: null }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    upsert: (data: any) => Promise.resolve({ data: null, error: null }),
  }

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: (table: string) => mockFromBuilder,
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
    }),
    removeChannel: () => {},
    removeAllChannels: () => {},
  } as any
}

export async function createClient() {
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isBuildTime || !supabaseUrl || !supabaseAnonKey) {
    return createMockClient()
  }

  try {
    const cookieStore = await cookies()

    const client = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    })

    return client
  } catch (error) {
    console.warn("Failed to create Supabase client:", error)
    return createMockClient()
  }
}

export { createServerClient }
