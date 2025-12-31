"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User } from "lucide-react"
import { DynamicImage } from "@/components/dynamic-image"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  author: string
  category: string
  tags: string[]
  read_time: number
  created_at: string
  featured: boolean
}

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardSize = featured ? "lg:col-span-2" : ""
  const imageHeight = featured ? "h-64" : "h-48"

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${cardSize}`}>
      <div className="relative">
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <DynamicImage
            src={
              post.featured_image ||
              `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80`
            }
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackSrc="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80"
          />
          {post.featured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-slate-700 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.read_time} min read
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
          </div>

          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>

          <Link href={`/blog/${post.slug}`} className="group">
            <h3
              className={`font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 ${
                featured ? "text-2xl" : "text-xl"
              }`}
            >
              {post.title}
            </h3>
          </Link>

          <p className={`text-slate-700 mb-4 ${featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs text-slate-800 border-slate-300">
                {tag}
              </Badge>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-slate-800 hover:text-slate-900 font-medium text-sm transition-colors"
          >
            Read More →
          </Link>
        </CardContent>
      </div>
    </Card>
  )
}
