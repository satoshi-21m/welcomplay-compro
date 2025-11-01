"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react"
import Image from "next/image"
import { showSuccess, showError } from "@/lib/toast"
import { useAuth } from "@/contexts/AuthContext"
import { FullScreenSpinner } from "@/components/ui/LoadingSpinner"
import { AuthGuard } from "@/components/admin/server/AuthGuard"

// Types
interface LoginFormData {
  email: string
  password: string
  showPassword: boolean
  error: string
  isLoading: boolean
}

interface LoginResponse {
  success: boolean
  message?: string
}

export default function LoginPage() {
  // Set page title
  useEffect(() => {
    document.title = "Login Admin - WELCOMPLAY"
  }, [])

  // Initial state values
  const initialState: LoginFormData = {
    email: '',
    password: '',
    showPassword: false,
    error: '',
    isLoading: false
  }

  // State management
  const [formData, setFormData] = useState<LoginFormData>(initialState)
  const { login, isLoading: authLoading, isAuthenticated } = useAuth()

  // Destructure form data for easier access
  const { email, password, showPassword, error, isLoading } = formData

  // Handle input changes
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear error when user starts typing
      ...(field === 'email' || field === 'password' ? { error: '' } : {})
    }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return
    
    // Validation
    if (!email.trim() || !password.trim()) {
      handleInputChange('error', 'Email dan password harus diisi')
      return
    }

    try {
      setFormData(prev => ({ ...prev, isLoading: true, error: '' }))
      
      const result: LoginResponse = await login(email.trim(), password)
      
      if (result.success) {
        showSuccess('Login berhasil! Selamat datang kembali.')
        console.log('✅ Login successful, redirecting to dashboard...')
        // Redirect akan ditangani oleh AuthContext
      } else {
        handleInputChange('error', result.message || 'Login gagal')
        showError(result.message || 'Login gagal')
      }
    } catch (error: any) {
      console.error('❌ Login error:', error)
      const errorMessage = error.message || 'Terjadi kesalahan saat login'
      handleInputChange('error', errorMessage)
      showError(errorMessage)
    } finally {
      setFormData(prev => ({ ...prev, isLoading: false }))
    }
  }, [email, password, isLoading, login, handleInputChange])

  // Handle password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    handleInputChange('showPassword', !showPassword)
  }, [showPassword, handleInputChange])

  // ⏳ Tunda render login form sampai session dicek
  // 🧠 Jangan render apapun saat session masih "loading"
  if (authLoading) {
    return <FullScreenSpinner text="Memverifikasi session..." />
  }

  // Render login form dengan AuthGuard - requireAuth={false} agar redirect ke dashboard jika sudah authenticated
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md animate-slide-left">
            <Card className="border-none shadow-md">
              <CardHeader className="text-start pb-6 px-8 pt-8">
                <CardTitle className="text-2xl text-gray-900">Selamat Datang</CardTitle>
                <CardDescription className="text-gray-600">
                  Masuk ke panel admin untuk mengelola platform
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="admin@welcomplay.com"
                        className="pl-12 h-12 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:outline-none rounded-2xl transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Masukkan password"
                        className="pl-12 pr-12 h-12 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:outline-none rounded-2xl transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded-xl border-gray-200 text-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-200"
                      />
                      <span className="text-sm text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" className="text-sm text-red-500 hover:text-red-600 transition-colors">
                      Lupa password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 animate-loading-shimmer"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Memproses...</span>
                        </div>
                      </>
                    ) : (
                      "Masuk ke Admin Panel"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden flex items-center justify-center rounded-[3rem] mx-8 my-4 animate-slide-right">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Main Image */}
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src="/images/visi-2.png"
              alt="WelcomPlay Vision"
              width={400}
              height={400}
              className="relative z-10 rounded-[2rem] animate-image-entrance animate-image-float"
              priority
              quality={95}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-16 h-16 bg-white/20 rounded-[2rem] animate-pulse"></div>
            <div className="absolute top-40 right-32 w-12 h-12 bg-white/15 rounded-[2rem] animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 bg-white/10 rounded-[2rem] animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-20 w-14 h-14 bg-white/25 rounded-[2rem] animate-pulse delay-1500"></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] rounded-[3rem]"></div>
        </div>
      </div>
    </AuthGuard>
  )
}
