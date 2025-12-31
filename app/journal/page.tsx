"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function JournalPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "destinations", name: "Destinations" },
    { id: "for owners", name: "For Owners" },
    { id: "travel tips", name: "Travel Tips" },
    { id: "food & drink", name: "Food & Drink" },
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog-posts", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
          setFilteredPosts(data)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory, posts])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/destinations/st-lucia-pitons.jpg"
          alt="Valar Travel Journal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-800/70 to-emerald-950/85" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Luxury badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-medium tracking-widest uppercase text-amber-100">Stories & Insights</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light mb-6 text-balance tracking-tight text-white">
            Valar Travel
            <span className="block font-semibold italic text-amber-200">Journal</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Stories, insights, and inspiration from the world of Caribbean luxury travel
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative shadow-2xl">
              <Search
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-700 w-5 h-5"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 py-6 text-base rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-medium"
                aria-label="Search journal articles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-green-700 hover:bg-green-800" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Badge className="mb-4">Featured Article</Badge>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto relative bg-gradient-to-br from-green-400 to-green-600">
                  <Image
                    src={
                      filteredPosts[0].image_url ||
                      "/placeholder.svg?height=600&width=800&query=luxury caribbean villa" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">{filteredPosts[0].category}</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{filteredPosts[0].title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {filteredPosts[0].author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(filteredPosts[0].published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/journal/${filteredPosts[0].slug}`}>
                    <Button className="bg-green-700 hover:bg-green-800">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            {selectedCategory === "all" ? "Latest Articles" : categories.find((c) => c.id === selectedCategory)?.name}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No articles found</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <Link href={`/journal/${post.slug}`}>
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
                      <Image
                        src={post.image_url || "/placeholder.svg?height=400&width=600&query=caribbean travel"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-3">{post.category}</Badge>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-green-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium mb-6">Stay Inspired</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance tracking-tight">
            Never Miss a <span className="font-semibold italic">Story</span>
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed">
            Subscribe to receive the latest stories and insights from Valar Travel
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/95 backdrop-blur-sm text-gray-900 border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-none h-12"
            />
            <Button className="bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-none px-8 tracking-wider uppercase text-sm font-semibold whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
