import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem confirming your email or signing you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Common issues:</strong>
            </p>
            <ul className="mt-2 text-sm text-amber-900 list-disc list-inside space-y-1">
              <li>The confirmation link may have expired</li>
              <li>The link may have already been used</li>
              <li>Email confirmation may be enabled but emails aren't being delivered</li>
              <li>There might be a connection issue</li>
            </ul>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> If emails aren't arriving, you can disable email confirmation in Supabase Dashboard under Authentication &gt; Providers &gt; Email.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/auth/sign-up" className="w-full">
              <Button className="w-full">Try Signing Up Again</Button>
            </Link>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Already have an account? Sign In
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button variant="ghost" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
