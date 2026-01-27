"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Loader2,
  Check,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "Valar Travel",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://valartravel.com",
    contactEmail: "hello@valartravel.de",
    notifyNewBookings: true,
    notifyNewSubscribers: true,
    notifyLowInventory: false,
    enableMaintenanceMode: false,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Settings saved successfully")
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your admin preferences and site configuration</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic site configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="mt-1.5"
            />
            <p className="text-xs text-neutral-500 mt-1">
              This email receives booking inquiries and contact form submissions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Booking Alerts</p>
              <p className="text-sm text-neutral-500">Get notified when a new booking is made</p>
            </div>
            <Switch
              checked={settings.notifyNewBookings}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyNewBookings: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Newsletter Signups</p>
              <p className="text-sm text-neutral-500">Get notified when someone subscribes</p>
            </div>
            <Switch
              checked={settings.notifyNewSubscribers}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyNewSubscribers: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Low Inventory Alerts</p>
              <p className="text-sm text-neutral-500">Alert when property availability is low</p>
            </div>
            <Switch
              checked={settings.notifyLowInventory}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyLowInventory: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Security and access settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-neutral-500">Temporarily disable public access to the site</p>
            </div>
            <Switch
              checked={settings.enableMaintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, enableMaintenanceMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Admin User</p>
              <p className="font-medium">Sarah Kuhmichel</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Role</p>
              <p className="font-medium">Super Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
