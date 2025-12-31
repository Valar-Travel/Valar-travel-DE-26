"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Trash2 } from "lucide-react"

interface AccountSettingsProps {
  user: any
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const supabase = createClient()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Error updating password:", error)
      alert("Error updating password")
    } else {
      alert("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }

    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, you'd want to handle account deletion properly
      alert("Account deletion would be handled here")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security
        </CardTitle>
        <CardDescription>Manage your account security and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Change Password
          </h4>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium text-red-900 mb-3 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
