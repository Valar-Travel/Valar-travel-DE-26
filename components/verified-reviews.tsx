import { Star, Shield, CheckCircle, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  date: string
  verified: boolean
  stay_type: string
}

interface VerifiedReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function VerifiedReviews({ reviews, averageRating, totalReviews }: VerifiedReviewsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-xl font-semibold">Verified Reviews</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          All Verified
        </Badge>
      </div>

      <div className="grid gap-4">
        {reviews.slice(0, 6).map((review) => (
          <Card key={review.id} className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user_name}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Stay
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">{review.stay_type}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalReviews > 6 && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">View all {totalReviews} reviews →</button>
        </div>
      )}
    </div>
  )
}
