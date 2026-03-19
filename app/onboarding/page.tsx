import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LuxuryOnboarding } from "@/components/onboarding/luxury-onboarding"

export const metadata = {
  title: "Welcome to Valar Travel | Personalize Your Experience",
  description: "Tell us about your dream Caribbean escape so we can curate the perfect villas for you.",
}

export default async function OnboardingPage() {
  try {
    const supabase = await createClient()
    
    // Check if supabase client is valid
    if (!supabase?.auth?.getUser) {
      console.error("[Onboarding] Invalid Supabase client")
      return (
        <LuxuryOnboarding 
          userId={undefined} 
          userName={undefined}
        />
      )
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error("[Onboarding] Auth error:", authError.message)
    }
    
    if (!user) {
      redirect("/auth/sign-in")
    }

    // Check if user has already completed onboarding - with error handling
    let isOnboarded = false
    try {
      if (supabase.from) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("onboarded_at")
          .eq("user_id", user.id)
          .single()
        
        if (profileError) {
          console.log("[Onboarding] Profile check:", profileError.message)
        }
        
        isOnboarded = !!profile?.onboarded_at
      }
    } catch (e) {
      console.log("[Onboarding] Profile check failed, continuing with onboarding")
    }

    // If already onboarded, redirect to dashboard
    if (isOnboarded) {
      redirect("/dashboard")
    }

    const userName = user.user_metadata?.full_name || 
                     user.user_metadata?.display_name || 
                     user.user_metadata?.name

    return (
      <LuxuryOnboarding 
        userId={user.id} 
        userName={userName}
      />
    )
  } catch (error: any) {
    console.error("[Onboarding] Page error:", error?.message || error)
    // Still show onboarding even if there's an error
    return (
      <LuxuryOnboarding 
        userId={undefined} 
        userName={undefined}
      />
    )
  }
}
