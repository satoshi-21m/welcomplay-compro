"use client"

import { ProtectedGuard } from "@/components/admin/server/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Debug logging
  useEffect(() => {
    console.log('🔒 [ProtectedRoute] Auth status:', { isAuthenticated, isLoading })
  }, [isAuthenticated, isLoading])
  
  // 🔐 Gunakan ProtectedGuard untuk proteksi halaman yang memerlukan login
  return (
    <ProtectedGuard>
      {children}
    </ProtectedGuard>
  )
}
