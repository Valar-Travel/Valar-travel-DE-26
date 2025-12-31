"use client"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { useAnalytics } from "@/hooks/use-analytics"

function OnboardingContent() {
  const router = useRouter()
  const { track } = useAnalytics()

  const handleOnboardingComplete = () => {
    track("onboarding_completed")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <OnboardingFlow userId="user-id" onComplete={handleOnboardingComplete} />
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <p>Loading onboarding...</p>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
