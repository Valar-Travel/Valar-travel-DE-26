import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We've sent you a confirmation link to complete your registration</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Please check your email and click the confirmation link to activate your account.
          </p>
          <Link href="/auth/login">
            <Button variant="outline">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
