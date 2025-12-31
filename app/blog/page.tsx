import { Suspense } from "react"
import { BlogCard } from "@/components/blog-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, TrendingUp, MapPin, Lightbulb, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const staticBlogPosts = [
  {
    id: "1",
    title: "10 Hidden Gems in Paris You Must Visit",
    slug: "hidden-gems-paris",
    excerpt: "Discover the secret spots that locals love but tourists rarely find in the City of Light.",
    content: "Paris is full of hidden treasures beyond the Eiffel Tower and Louvre...",
    author: "Sophie Martin",
    category: "Destinations",
    tags: ["Paris", "Hidden Gems", "Local Tips"],
    featured_image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    featured: true,
    read_time: 8,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Paris Luxury Hotels: Where Elegance Meets Excellence",
    slug: "luxury-hotels-paris",
    excerpt: "Experience the pinnacle of Parisian hospitality at these world-renowned luxury hotels.",
    content: "Paris has long been synonymous with luxury, and its hotels are no exception...",
    author: "Isabella Dubois",
    category: "Luxury",
    tags: ["Paris", "Luxury Hotels", "Hospitality", "Travel"],
    featured_image: "/paris-luxury-hotel-plaza-athenee.jpg",
    published: true,
    featured: false,
    read_time: 12,
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Santorini Sunset Views: The Ultimate Guide",
    slug: "santorini-sunset-guide",
    excerpt: "Find the perfect spot to watch the world's most famous sunset in the Greek islands.",
    content: "Santorini's sunsets are legendary, but knowing where to watch them makes all the difference...",
    author: "Maria Kostas",
    category: "Destinations",
    tags: ["Santorini", "Greece", "Sunsets", "Photography"],
    featured_image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    featured: false,
    read_time: 6,
    created_at: "2024-01-25T09:15:00Z",
  },
  {
    id: "4",
    title: "Bali's Secret Beaches: Beyond the Crowds",
    slug: "bali-secret-beaches",
    excerpt: "Escape the tourist masses and discover pristine beaches known only to locals.",
    content: "While Bali's popular beaches are stunning, the island's hidden coastal gems offer tranquility...",
    author: "Kadek Sari",
    category: "Destinations",
    tags: ["Bali", "Beaches", "Hidden Gems", "Indonesia"],
    featured_image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    featured: false,
    read_time: 10,
    created_at: "2024-02-01T16:45:00Z",
  },
  {
    id: "5",
    title: "New York's Rooftop Bars: Sky-High Luxury",
    slug: "nyc-rooftop-bars",
    excerpt: "Sip cocktails above the city that never sleeps at these exclusive rooftop venues.",
    content: "New York's skyline is best appreciated from above, with a craft cocktail in hand...",
    author: "James Rodriguez",
    category: "Nightlife",
    tags: ["New York", "Rooftop Bars", "Luxury", "Cocktails"],
    featured_image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    featured: false,
    read_time: 7,
    created_at: "2024-02-05T11:20:00Z",
  },
]

async function getBlogPosts() {
  return staticBlogPosts.filter((post) => post.published)
}

async function getFeaturedPost() {
  return staticBlogPosts.find((post) => post.published && post.featured) || null
}

export default async function BlogPage() {
  const [posts, featuredPost] = await Promise.all([getBlogPosts(), getFeaturedPost()])

  const regularPosts = posts.filter((post) => !post.featured)
  const categories = [...new Set(posts.map((post) => post.category))]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Travel Blog</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover insider tips, destination guides, and luxury travel insights from our expert team
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/admin/blog" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Post
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <Link href="/tips" className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Travel Tips
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <Link href="/destinations" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Destinations
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10 bg-background/80 backdrop-blur-sm" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="default" className="cursor-pointer">
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Featured Article</h2>
            </div>
            <div className="max-w-6xl mx-auto">
              <BlogCard post={featuredPost} featured={true} />
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<div>Loading posts...</div>}>
              {regularPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </Suspense>
          </div>

          {regularPosts.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Check back soon for travel insights and tips!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
