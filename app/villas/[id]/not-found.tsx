import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function VillaNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-green-700">404</h1>
          <h2 className="text-3xl font-bold">Villa Not Found</h2>
          <p className="text-muted-foreground text-lg">
            We couldn't find the villa you're looking for. It may have been removed or the link might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
            <Link href="/villas">
              <Search className="w-4 h-4 mr-2" />
              Browse All Villas
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
