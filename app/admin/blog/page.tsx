"use client"

import { useState } from "react"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Trash2, Edit, BookOpen } from "lucide-react"
import { DynamicImage } from "@/components/dynamic-image"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featured_image: string
  published: boolean
  featured: boolean
  read_time: number
  created_at: string
}

const categories = ["Destinations", "Luxury", "Tips", "Nightlife", "Food", "Culture", "Adventure"]

const sampleImages = [
  "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Paris
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Tokyo
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Santorini
  "https://images.unsplash.com/photo-1537953773346-21bda4d32df1?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Bali
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // NYC
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Mountain
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // Beach
  "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80", // City
]

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: [],
    featured_image: sampleImages[0],
    published: false,
    featured: false,
    read_time: 5,
  })

  const handleSave = () => {
    if (!currentPost.title || !currentPost.excerpt) return

    const newPost: BlogPost = {
      id: isEditing ? currentPost.id! : Date.now().toString(),
      slug: currentPost
        .title!.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
      created_at: isEditing ? currentPost.created_at! : new Date().toISOString(),
      ...(currentPost as BlogPost),
    }

    if (isEditing) {
      setPosts(posts.map((p) => (p.id === newPost.id ? newPost : p)))
    } else {
      setPosts([...posts, newPost])
    }

    setCurrentPost({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      tags: [],
      featured_image: sampleImages[0],
      published: false,
      featured: false,
      read_time: 5,
    })
    setIsEditing(false)
  }

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Blog Management</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blog Post Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {isEditing ? "Edit Post" : "Create New Post"}
                </CardTitle>
                <CardDescription>{isEditing ? "Update your blog post" : "Add a new travel blog post"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={currentPost.title || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={currentPost.excerpt || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    placeholder="Brief description of the post..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={currentPost.content || ""}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    placeholder="Write your blog post content..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={currentPost.author || ""}
                      onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={currentPost.category || ""}
                      onValueChange={(value) => setCurrentPost({ ...currentPost, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={currentPost.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setCurrentPost({ ...currentPost, tags: e.target.value.split(",").map((t) => t.trim()) })
                    }
                    placeholder="Paris, Travel, Tips"
                  />
                </div>

                <div>
                  <Label>Featured Image</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {sampleImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                          currentPost.featured_image === img ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setCurrentPost({ ...currentPost, featured_image: img })}
                      >
                        <DynamicImage
                          src={img}
                          alt={`Sample ${idx + 1}`}
                          width={100}
                          height={75}
                          className="w-full h-16 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={currentPost.published || false}
                      onCheckedChange={(checked) => setCurrentPost({ ...currentPost, published: checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={currentPost.featured || false}
                      onCheckedChange={(checked) => setCurrentPost({ ...currentPost, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
              </CardContent>
            </Card>

            {/* Posts List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Blog Posts</CardTitle>
                <CardDescription>Manage your existing posts</CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No posts yet. Create your first blog post!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{post.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{post.excerpt}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                              {post.published && (
                                <Badge variant="default" className="text-xs">
                                  Published
                                </Badge>
                              )}
                              {post.featured && (
                                <Badge variant="secondary" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Add Blog Posts</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Using This Interface:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Fill out the form on the left with your post details</li>
                    <li>Choose a stunning image from the gallery</li>
                    <li>Set category and tags for better organization</li>
                    <li>Toggle "Published" to make it live</li>
                    <li>Toggle "Featured" to highlight important posts</li>
                    <li>Click "Create Post" to save</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Developers:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Edit <code>app/blog/page.tsx</code>
                    </li>
                    <li>
                      Add new objects to the <code>staticBlogPosts</code> array
                    </li>
                    <li>Use high-quality Unsplash URLs for images</li>
                    <li>Follow the existing structure for consistency</li>
                    <li>
                      Set <code>published: true</code> to make posts visible
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
