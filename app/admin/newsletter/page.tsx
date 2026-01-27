"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Suspense } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Mail,
  Send,
  Users,
  FileText,
  Calendar,
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Copy,
} from "lucide-react"
import { toast } from "sonner"
import Loading from "./loading"

interface Subscriber {
  id: string
  email: string
  status: "active" | "unsubscribed" | "bounced"
  subscribed_at: string
  source?: string
}

interface Campaign {
  id: string
  subject: string
  preview_text?: string
  content: string
  status: "draft" | "scheduled" | "sent"
  sent_at?: string
  scheduled_for?: string
  recipients_count: number
  opens_count: number
  clicks_count: number
  created_at: string
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  unsubscribed: "bg-neutral-100 text-neutral-600",
  bounced: "bg-red-100 text-red-800",
  draft: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-blue-100 text-blue-800",
  sent: "bg-emerald-100 text-emerald-800",
}

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState("subscribers")
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Compose state
  const [composeOpen, setComposeOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [campaignForm, setCampaignForm] = useState({
    subject: "",
    preview_text: "",
    content: "",
    audience: "all",
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    if (activeTab === "subscribers") {
      fetchSubscribers()
    } else {
      fetchCampaigns()
    }
  }, [activeTab])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/newsletter/subscribers")
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error)
      toast.error("Failed to load subscribers")
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/newsletter/campaigns")
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
      toast.error("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async () => {
    if (!campaignForm.subject || !campaignForm.content) {
      toast.error("Please fill in subject and content")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignForm),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Campaign sent to ${data.recipients} subscribers`)
        setComposeOpen(false)
        setCampaignForm({ subject: "", preview_text: "", content: "", audience: "all" })
        fetchCampaigns()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to send campaign")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send campaign")
    } finally {
      setSending(false)
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Subscriber removed")
        fetchSubscribers()
      }
    } catch (error) {
      toast.error("Failed to remove subscriber")
    }
  }

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter((s) => s.status === "active").length,
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter((c) => c.status === "sent").length,
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Newsletter</h1>
            <p className="text-neutral-600 mt-1">Manage subscribers and email campaigns</p>
          </div>
          <Button
            onClick={() => setComposeOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Subscribers</p>
                  <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
                </div>
                <Users className="h-8 w-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Active</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.activeSubscribers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Campaigns</p>
                  <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
                </div>
                <FileText className="h-8 w-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Sent</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.sentCampaigns}</p>
                </div>
                <Send className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="subscribers">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <FileText className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="mt-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Subscribers Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600">No subscribers found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Subscribed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell>
                            <p className="font-medium">{subscriber.email}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[subscriber.status]}>
                              {subscriber.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-500">
                              {subscriber.source || "Website"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-500">
                              {formatDate(subscriber.subscribed_at)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600">No campaigns yet</p>
                    <p className="text-sm text-neutral-400 mt-1">Create your first email campaign</p>
                    <Button
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setComposeOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Opens</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{campaign.subject}</p>
                              {campaign.preview_text && (
                                <p className="text-sm text-neutral-500 truncate max-w-[300px]">
                                  {campaign.preview_text}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[campaign.status]}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.recipients_count}</TableCell>
                          <TableCell>
                            {campaign.opens_count} 
                            {campaign.recipients_count > 0 && (
                              <span className="text-neutral-400 text-sm ml-1">
                                ({Math.round((campaign.opens_count / campaign.recipients_count) * 100)}%)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {campaign.clicks_count}
                            {campaign.opens_count > 0 && (
                              <span className="text-neutral-400 text-sm ml-1">
                                ({Math.round((campaign.clicks_count / campaign.opens_count) * 100)}%)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-neutral-500">
                              {formatDate(campaign.sent_at || campaign.created_at)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Compose Campaign Dialog */}
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Compose and send an email to your newsletter subscribers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject..."
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="preview">Preview Text (optional)</Label>
                  <Input
                    id="preview"
                    placeholder="Brief preview shown in inbox..."
                    value={campaignForm.preview_text}
                    onChange={(e) => setCampaignForm({ ...campaignForm, preview_text: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="audience">Audience</Label>
                  <Select
                    value={campaignForm.audience}
                    onValueChange={(v) => setCampaignForm({ ...campaignForm, audience: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers ({stats.activeSubscribers})</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="recent">Recent Signups (30 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your email content here..."
                    value={campaignForm.content}
                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                    className="mt-1.5 min-h-[200px]"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Plain text or basic HTML supported
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setComposeOpen(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendCampaign}
                disabled={sending || !campaignForm.subject || !campaignForm.content}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}
