export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Full-screen layout without header/footer for immersive onboarding
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
