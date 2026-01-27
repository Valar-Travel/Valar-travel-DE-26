import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const staticBlogPosts = [
  {
    id: "1",
    slug: "hidden-gems-paris",
    title: "10 Hidden Gems in Paris You Must Visit",
    excerpt: "Discover the secret spots that locals love but tourists rarely find in the City of Light.",
    content: `Paris is full of hidden treasures beyond the Eiffel Tower and Louvre. From secret gardens to underground speakeasies, here are 10 places that will make your trip unforgettable.

    <h3>1. Promenade Plantée</h3>
    This elevated park built on former railway tracks offers a unique perspective of the city. Walk among the trees 30 feet above street level and discover hidden courtyards below.

    <h3>2. Musée de la Chasse et de la Nature</h3>
    A quirky museum that blends taxidermy with contemporary art in the most unexpected ways. It's like stepping into a surreal fairy tale.

    <h3>3. Passage des Panoramas</h3>
    One of Paris's oldest covered passages, filled with vintage shops, stamp dealers, and authentic bistros that locals frequent.

    <h3>4. Square du Vert-Galant</h3>
    A tiny triangular park at the tip of Île de la Cité, perfect for picnics with stunning views of the Seine and Pont Neuf.

    <h3>5. La REcyclerie</h3>
    A former railway station turned eco-friendly café and cultural space, complete with an urban farm and weekend markets.`,
    author: "Sophie Martin",
    category: "Destinations",
    tags: ["Paris", "Hidden Gems", "Local Tips"],
    featured_image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    read_time: 8,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    slug: "luxury-hotels-paris",
    title: "Paris Luxury Hotels: Where Elegance Meets Excellence",
    excerpt: "Experience the pinnacle of Parisian hospitality at these world-renowned luxury hotels.",
    content: `Paris has long been synonymous with luxury, and its hotels are no exception. From palatial suites overlooking the Champs-Élysées to intimate boutique properties in historic neighborhoods, the City of Light offers accommodations that define elegance.

    <h3>The Ritz Paris</h3>
    The legendary Ritz Paris remains the gold standard of luxury hospitality. After a four-year renovation, this iconic hotel has reclaimed its position as the most prestigious address in the city. The Imperial Suite, where Coco Chanel lived for 34 years, epitomizes Parisian glamour.

    <h3>Le Bristol Paris</h3>
    A palace hotel on Rue du Faubourg Saint-Honoré, Le Bristol combines French elegance with modern luxury. Their rooftop garden and three-Michelin-starred restaurant Epicure make it a destination in itself.

    <h3>Hotel Plaza Athénée</h3>
    Famous for its red awnings and flower-filled balconies, this Dorchester Collection property offers unparalleled views of the Eiffel Tower. The Alain Ducasse restaurant holds three Michelin stars.

    <h3>La Réserve Paris</h3>
    This intimate luxury hotel near the Champs-Élysées feels more like a private mansion than a hotel. With only 40 rooms and suites, it offers personalized service that's second to none.

    <h3>Four Seasons Hotel George V</h3>
    Art Deco elegance meets contemporary luxury at this legendary hotel. Home to three restaurants with a combined five Michelin stars, it's a culinary destination as much as a place to stay.`,
    author: "Isabella Dubois",
    category: "Luxury",
    tags: ["Paris", "Luxury Hotels", "Hospitality", "Travel"],
    featured_image: "/paris-luxury-hotel-plaza-athenee.jpg",
    published: true,
    read_time: 10,
    created_at: "2024-01-18T12:00:00Z",
  },
  {
    id: "3",
    slug: "tokyo-luxury-ryokans",
    title: "Tokyo's Best Luxury Ryokans: A Complete Guide",
    excerpt: "Experience authentic Japanese hospitality in these exquisite traditional inns.",
    content: `Traditional ryokans offer an unparalleled glimpse into Japanese culture and hospitality. These luxury establishments combine centuries-old traditions with modern amenities to create unforgettable experiences.

    <h3>Hoshinoya Tokyo</h3>
    The world's first luxury ryokan in a high-rise building, Hoshinoya Tokyo brings traditional Japanese hospitality to the heart of the modern city. Each floor represents a different season, and guests enjoy tatami-floored rooms with stunning city views.

    <h3>The Gate Hotel Kaminarimon</h3>
    Located in the historic Asakusa district, this modern interpretation of a ryokan offers panoramic views of Tokyo Skytree and Sensoji Temple. The rooftop onsen provides a serene escape from the bustling city below.

    <h3>Andon Ryokan</h3>
    A boutique ryokan in the traditional Taito district, Andon perfectly balances modern design with traditional elements. The communal bath and authentic kaiseki dining create an immersive cultural experience.`,
    author: "Hiroshi Tanaka",
    category: "Luxury",
    tags: ["Tokyo", "Ryokans", "Luxury", "Japan"],
    featured_image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    read_time: 12,
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "4",
    slug: "santorini-sunset-guide",
    title: "Santorini Sunset Views: The Ultimate Guide",
    excerpt: "Find the perfect spot to watch the world's most famous sunset in the Greek islands.",
    content: `Santorini's sunsets are legendary, but knowing where to watch them makes all the difference. Here are the best vantage points for experiencing this daily spectacle.

    <h3>Oia Castle</h3>
    The most famous sunset spot in Santorini, offering panoramic views across the caldera. Arrive early to secure a good spot, as it gets crowded during peak season.

    <h3>Fira to Firostefani Walk</h3>
    This scenic clifftop walk offers multiple sunset viewing opportunities with fewer crowds than Oia. The path provides stunning views of the volcanic islands.

    <h3>Akrotiri Lighthouse</h3>
    For a more secluded experience, head to this 19th-century lighthouse at the southern tip of the island. The dramatic cliffs provide a perfect frame for the setting sun.`,
    author: "Maria Kostas",
    category: "Destinations",
    tags: ["Santorini", "Greece", "Sunsets", "Photography"],
    featured_image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    read_time: 6,
    created_at: "2024-01-25T09:15:00Z",
  },
  {
    id: "5",
    slug: "bali-secret-beaches",
    title: "Bali's Secret Beaches: Beyond the Crowds",
    excerpt: "Escape the tourist masses and discover pristine beaches known only to locals.",
    content: `While Bali's popular beaches are stunning, the island's hidden coastal gems offer tranquility and natural beauty without the crowds.

    <h3>Green Bowl Beach</h3>
    Hidden beneath towering cliffs, this secluded beach requires a steep climb down, but rewards visitors with pristine white sand and excellent surfing conditions.

    <h3>Bias Tugel Beach</h3>
    A small, hidden cove near Padang Bai, accessible only by a short trek through the jungle. The crystal-clear waters are perfect for snorkeling.

    <h3>Gunung Payung Beach</h3>
    Located on the Bukit Peninsula, this beach remains relatively unknown despite its stunning beauty. The dramatic limestone cliffs create a natural amphitheater around the golden sand.`,
    author: "Kadek Sari",
    category: "Destinations",
    tags: ["Bali", "Beaches", "Hidden Gems", "Indonesia"],
    featured_image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    read_time: 10,
    created_at: "2024-02-01T16:45:00Z",
  },
  {
    id: "6",
    slug: "nyc-rooftop-bars",
    title: "New York's Rooftop Bars: Sky-High Luxury",
    excerpt: "Sip cocktails above the city that never sleeps at these exclusive rooftop venues.",
    content: `New York's skyline is best appreciated from above, with a craft cocktail in hand. These rooftop bars offer spectacular views and sophisticated atmospheres.

    <h3>230 Fifth</h3>
    One of the largest rooftop bars in NYC, offering unobstructed views of the Empire State Building. The heated igloos in winter make it a year-round destination.

    <h3>The Press Lounge</h3>
    Located in Hell's Kitchen, this sleek rooftop bar provides panoramic views of the Hudson River and Manhattan skyline. The minimalist design lets the views take center stage.

    <h3>1 Rooftop</h3>
    Atop the 1 Hotel Brooklyn Bridge, this eco-conscious rooftop bar offers stunning views of the Manhattan skyline and Brooklyn Bridge. The sustainable cocktail menu features locally sourced ingredients.`,
    author: "James Rodriguez",
    category: "Nightlife",
    tags: ["New York", "Rooftop Bars", "Luxury", "Cocktails"],
    featured_image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    published: true,
    read_time: 7,
    created_at: "2024-02-05T11:20:00Z",
  },
]

async function getBlogPost(slug: string) {
  const post = staticBlogPosts.find((p) => p.slug === slug && p.published)
  return post || null
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Article Meta */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.read_time} min read
              </div>
            </div>

            {post.excerpt && <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.excerpt}</p>}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
              className="text-foreground leading-relaxed"
            />
          </div>
        </div>
      </article>
    </div>
  )
}
