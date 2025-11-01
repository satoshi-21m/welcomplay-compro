"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Globe, Save, Mail, Phone, Clock, Code2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { showSuccess, showError } from "@/lib/toast"

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    // Profile
    name: "Admin",
    email: "admin@welcomplay.com",
    phone: "+62 812-3456-7890",
    timezone: "Asia/Jakarta",
    language: "id",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    
    // Security
    twoFactorEnabled: false,
    sessionTimeout: 30,
    
    // Third Party Scripts
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    customHeadScripts: "",
    customBodyScripts: "",
  })

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/settings?category=third_party_scripts')
      const data = await response.json()
      
      if (data.success && data.settings) {
        setFormData(prev => ({
          ...prev,
          googleAnalyticsId: data.settings.google_analytics_id || "",
          googleTagManagerId: data.settings.google_tag_manager_id || "",
          facebookPixelId: data.settings.facebook_pixel_id || "",
          customHeadScripts: data.settings.custom_head_scripts || "",
          customBodyScripts: data.settings.custom_body_scripts || "",
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      showError('Gagal memuat pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Prepare settings data for API
      const settingsToUpdate = {
        google_analytics_id: formData.googleAnalyticsId,
        google_tag_manager_id: formData.googleTagManagerId,
        facebook_pixel_id: formData.facebookPixelId,
        custom_head_scripts: formData.customHeadScripts,
        custom_body_scripts: formData.customBodyScripts,
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToUpdate }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        showSuccess('Pengaturan berhasil disimpan!')
        setIsEditing(false)
        
        // Invalidate settings cache to reload scripts
        await fetch('/api/admin/invalidate-cache', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'settings' })
        })
      } else {
        showError(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showError('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout title="Pengaturan">
      <div className="space-y-6 p-4">
        {/* Header Actions */}
        <div className="flex justify-end">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border-gray-200 hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Edit Pengaturan
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-red-600" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nama Lengkap
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  type="email"
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Nomor Telepon
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Zona Waktu
                </label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange("timezone", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih zona waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Jakarta">WIB (UTC+7) - Jakarta</SelectItem>
                    <SelectItem value="Asia/Makassar">WITA (UTC+8) - Makassar</SelectItem>
                    <SelectItem value="Asia/Jayapura">WIT (UTC+9) - Jayapura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div>
                <h4 className="font-medium text-blue-900">Two-Factor Authentication</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Tambahkan lapisan keamanan ekstra
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={formData.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                  {formData.twoFactorEnabled ? "Aktif" : "Nonaktif"}
                </Badge>
                <Switch
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Session Timeout (menit)</label>
                <Input
                  value={formData.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                  type="number"
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Terima notifikasi via email
                </p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Terima notifikasi push
                </p>
              </div>
              <Switch
                checked={formData.pushNotifications}
                onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Card */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-red-600" />
              Bahasa & Regional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bahasa Interface</label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange("language", value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Scripts Card */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-red-600" />
              Third Party Scripts
            </CardTitle>
            <CardDescription className="text-gray-600">
              Kelola script tracking dan analytics untuk website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Analytics */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Google Analytics ID
              </label>
              <Input
                value={formData.googleAnalyticsId}
                onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
                disabled={!isEditing}
                placeholder="G-XXXXXXXXXX atau UA-XXXXXXXXX-X"
                className="rounded-xl font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Contoh: G-XXXXXXXXXX (GA4) atau UA-XXXXXXXXX-X (Universal Analytics)
              </p>
            </div>

            <Separator />

            {/* Google Tag Manager */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Google Tag Manager ID
              </label>
              <Input
                value={formData.googleTagManagerId}
                onChange={(e) => handleInputChange("googleTagManagerId", e.target.value)}
                disabled={!isEditing}
                placeholder="GTM-XXXXXXX"
                className="rounded-xl font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Contoh: GTM-XXXXXXX
              </p>
            </div>

            <Separator />

            {/* Facebook Pixel */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Facebook Pixel ID
              </label>
              <Input
                value={formData.facebookPixelId}
                onChange={(e) => handleInputChange("facebookPixelId", e.target.value)}
                disabled={!isEditing}
                placeholder="XXXXXXXXXXXXXXX"
                className="rounded-xl font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Contoh: 123456789012345 (15 digit angka)
              </p>
            </div>

            <Separator />

            {/* Custom Head Scripts */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Custom Head Scripts
              </label>
              <Textarea
                value={formData.customHeadScripts}
                onChange={(e) => handleInputChange("customHeadScripts", e.target.value)}
                disabled={!isEditing}
                placeholder="<script>...</script> atau <meta> tags"
                className="rounded-xl font-mono text-sm min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                Script yang akan ditempatkan di dalam tag &lt;head&gt;. Pastikan menyertakan tag &lt;script&gt; lengkap.
              </p>
            </div>

            <Separator />

            {/* Custom Body Scripts */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Custom Body Scripts
              </label>
              <Textarea
                value={formData.customBodyScripts}
                onChange={(e) => handleInputChange("customBodyScripts", e.target.value)}
                disabled={!isEditing}
                placeholder="<script>...</script>"
                className="rounded-xl font-mono text-sm min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                Script yang akan ditempatkan sebelum tag penutup &lt;/body&gt;. Pastikan menyertakan tag &lt;script&gt; lengkap.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
