import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LuxuryOnboarding } from "@/components/onboarding/luxury-onboarding"

export const metadata = {
  title: "Welcome to Valar Travel | Personalize Your Experience",
  description: "Tell us about your dream Caribbean escape so we can curate the perfect villas for you.",
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/sign-in")
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("onboarded_at")
    .eq("user_id", user.id)
    .single()

  // If already onboarded, redirect to dashboard
  if (profile?.onboarded_at) {
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
}
