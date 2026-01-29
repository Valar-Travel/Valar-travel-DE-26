import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-2/3 max-w-lg mb-4 bg-white/20" />
          <Skeleton className="h-6 w-full max-w-2xl bg-white/20" />
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <section className="py-6 bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center gap-4 flex-wrap">
            <Skeleton className="h-10 flex-1 max-w-md" />
            <Skeleton className="h-10 w-[160px]" />
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[160px]" />
          </div>
          <Skeleton className="h-10 w-24 lg:hidden" />
        </div>
      </section>

      {/* Villa Grid Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
