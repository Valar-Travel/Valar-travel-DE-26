import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Use production URL as fallback
  const requestUrl = new URL(request.url)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin || "https://valartravel.de"
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"
  const error_description = requestUrl.searchParams.get("error_description")
  const error_code = requestUrl.searchParams.get("error")

  // Handle OAuth errors from provider
  if (error_description || error_code) {
    console.error("[Auth Callback] OAuth error:", error_description || error_code)
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error_description || error_code || "OAuth error")}`)
  }

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("[Auth Callback] Missing Supabase environment variables")
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent("Server configuration error")}`)
  }

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => 
                cookieStore.set(name, value, options)
              )
            } catch (e) {
              // Ignore - called from Server Component
              console.log("[Auth Callback] Cookie set warning:", e)
            }
          },
        },
      })

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("[Auth Callback] Exchange error:", error.message, error)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      console.log("[Auth Callback] Success - user:", data?.user?.email)

      // Success - redirect to destination
      return NextResponse.redirect(`${origin}${next}`)
    } catch (err: any) {
      console.error("[Auth Callback] Exception:", err?.message || err)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(err?.message || "Authentication failed")}`)
    }
  }

  // No code provided
  console.error("[Auth Callback] No code provided in URL")
  return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent("No authorization code provided")}`)
}
