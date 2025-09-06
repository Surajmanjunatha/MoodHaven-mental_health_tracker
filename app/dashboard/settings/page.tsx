"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, Bell, Shield, Trash2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserSettings {
  name: string
  email: string
  notifications: {
    dailyReminders: boolean
    weeklyReports: boolean
    moodAlerts: boolean
  }
  privacy: {
    dataSharing: boolean
    analytics: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      moodAlerts: false,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
    },
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load user data and settings
    const userData = localStorage.getItem("mind-haven-user")
    const userSettings = localStorage.getItem("mind-haven-settings")

    if (userData) {
      const user = JSON.parse(userData)
      setSettings((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }

    if (userSettings) {
      const savedSettings = JSON.parse(userSettings)
      setSettings((prev) => ({
        ...prev,
        ...savedSettings,
      }))
    }
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user data
    const userData = { name: settings.name, email: settings.email }
    localStorage.setItem("mind-haven-user", JSON.stringify(userData))
    localStorage.setItem("mind-haven-settings", JSON.stringify(settings))

    setIsSaving(false)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      localStorage.removeItem("mind-haven-journal-entries")
      localStorage.removeItem("mind-haven-settings")
      alert("All data has been cleared.")
    }
  }

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This will remove all your data permanently.")) {
      localStorage.clear()
      router.push("/")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="glass-module gentle-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                  className="glass-overlay"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  className="glass-overlay"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-module gentle-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Daily Journal Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to write in your journal</p>
              </div>
              <Switch
                checked={settings.notifications.dailyReminders}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, dailyReminders: checked },
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Mood Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summaries of your mood trends</p>
              </div>
              <Switch
                checked={settings.notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, weeklyReports: checked },
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Mood Alert Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about significant mood changes</p>
              </div>
              <Switch
                checked={settings.notifications.moodAlerts}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, moodAlerts: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass-module gentle-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Anonymous Data Sharing</Label>
                <p className="text-sm text-muted-foreground">Help improve our services with anonymous usage data</p>
              </div>
              <Switch
                checked={settings.privacy.dataSharing}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataSharing: checked },
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Analytics & Insights</Label>
                <p className="text-sm text-muted-foreground">Enable advanced mood analytics and insights</p>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, analytics: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={saveSettings} disabled={isSaving} className="w-full hover-lift">
          {isSaving ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>

        {/* Danger Zone */}
        <Card className="glass-module border-red-200/20 bg-red-50/10">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Clear All Data</Label>
                <p className="text-sm text-muted-foreground">Remove all journal entries and analytics data</p>
              </div>
              <Button variant="outline" onClick={clearAllData} className="text-red-600 border-red-200 bg-transparent">
                Clear Data
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={deleteAccount}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
