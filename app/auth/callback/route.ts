import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const error_description = searchParams.get("error_description")

  // Handle OAuth errors from provider
  if (error_description) {
    console.error("[Auth Callback] OAuth error:", error_description)
    return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => 
                  cookieStore.set(name, value, options)
                )
              } catch {
                // Ignore - called from Server Component
              }
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("[Auth Callback] Exchange error:", error.message)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      // Success - redirect to destination
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error("[Auth Callback] Exception:", err)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent("Authentication failed")}`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent("No authorization code provided")}`)
}
