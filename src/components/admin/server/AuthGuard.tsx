"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { FullScreenSpinner } from "@/components/ui/LoadingSpinner"
import { smoothRedirectToLogin, smoothRedirectToDashboard } from "@/lib/utils/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/admin-g30spki/login' 
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Reset redirect flag jika auth status berubah
    if (hasRedirected.current && !isAuthenticated) {
      hasRedirected.current = false
    }

    // Hanya redirect sekali
    if (hasRedirected.current) return

    // Redirect jika tidak authenticated dan tidak loading
    if (!isLoading && requireAuth && !isAuthenticated) {
      console.log('🔄 [AuthGuard] User not authenticated, redirecting to login...')
      hasRedirected.current = true
      smoothRedirectToLogin(router)
      return
    }

    // Redirect jika sudah authenticated dan tidak memerlukan auth
    if (!isLoading && !requireAuth && isAuthenticated) {
      console.log('🔄 [AuthGuard] User already authenticated, redirecting to dashboard...')
      hasRedirected.current = true
      smoothRedirectToDashboard(router)
      return
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router])

  // 🧠 Jangan render apapun saat session masih "loading"
  if (isLoading) {
    console.log('⏳ [AuthGuard] Loading state - showing spinner')
    return <FullScreenSpinner text="Memverifikasi autentikasi..." />
  }

  // Jika require auth dan tidak authenticated, jangan render apapun (akan redirect)
  if (requireAuth && !isAuthenticated) {
    console.log('🚫 [AuthGuard] Not rendering - user not authenticated')
    console.log('🔍 [AuthGuard] Auth state:', { requireAuth, isAuthenticated, isLoading })
    return null
  }

  // Jika tidak require auth dan sudah authenticated, jangan render apapun (akan redirect)
  if (!requireAuth && isAuthenticated) {
    console.log('🚫 [AuthGuard] Not rendering - user already authenticated, redirecting...')
    console.log('🔍 [AuthGuard] Auth state:', { requireAuth, isAuthenticated, isLoading })
    return null
  }

  // Render children hanya ketika kondisi terpenuhi
  console.log('✅ [AuthGuard] Rendering children - auth conditions met')
  console.log('🔍 [AuthGuard] Final state:', { requireAuth, isAuthenticated, isLoading })
  return <>{children}</>
}

// Variant untuk halaman yang memerlukan login
export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} redirectTo="/admin-g30spki/login">
      {children}
    </AuthGuard>
  )
}
