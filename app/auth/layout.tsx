export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth pages have their own minimal layout without header/footer
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-emerald-950">
      {children}
    </div>
  )
}
