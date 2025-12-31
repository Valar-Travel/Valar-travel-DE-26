import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

async function getPost(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/blog-posts`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const posts = await response.json()
  return posts.find((post: any) => post.slug === slug)
}

async function getRelatedPosts(currentSlug: string, category: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/blog-posts?category=${category}`,
    {
      cache: "no-store",
    },
  )

  if (!response.ok) {
    return []
  }

  const posts = await response.json()
  return posts.filter((post: any) => post.slug !== currentSlug).slice(0, 3)
}

export default async function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={post.image_url || post.featured_image || "/placeholder.svg?height=800&width=1600"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-8 left-4 md:left-8">
          <Link href="/journal">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Journal
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Badge className="mb-4 bg-emerald-600 hover:bg-emerald-700">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-4 text-balance">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto max-w-4xl px-4 py-12">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.read_time} min read</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-muted-foreground font-light italic mb-8 leading-relaxed">{post.excerpt}</p>

        <Separator className="mb-8" />

        {/* Article Body */}
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          {post.content.split("\n\n").map((paragraph: string, index: number) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-3xl font-serif font-light mt-12 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              )
            }
            return (
              <p key={index} className="mb-6 leading-relaxed text-lg">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">Continue Reading</h2>
              <p className="text-muted-foreground">More stories from {post.category}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost: any) => (
                <Link key={relatedPost.id} href={`/journal/${relatedPost.slug}`} className="group">
                  <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={relatedPost.image_url || relatedPost.featured_image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className="mb-2">{relatedPost.category}</Badge>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
