"use client"

import { useMemo, useCallback, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { BottomNavigation } from "./BottomNavigation"

import PageTransition from "@/components/admin/PageTransition"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { usePreventNavigation } from "@/hooks/usePreventNavigation"
import { smoothRedirectToLogin } from "@/lib/utils/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  showSearch?: boolean
  searchTerm?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function AdminLayout({ 
  children, 
  title, 
  showSearch = false, 
  searchTerm = "", 
  onSearchChange,
  searchPlaceholder = "Cari..."
}: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  // Prevent unauthorized browser navigation
  usePreventNavigation()

  // Double protection: client-side + server-side
  useEffect(() => {
    // Jika tidak loading dan tidak authenticated, redirect ke login
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 [AdminLayout] User not authenticated, redirecting to login')
      smoothRedirectToLogin(router)
      return
    }
  }, [isLoading, isAuthenticated, router])

  // Memoize header props untuk mencegah re-render yang tidak perlu
  const headerProps = useMemo(() => ({
    title,
    showSearch,
    searchTerm,
    onSearchChange,
    searchPlaceholder
  }), [title, showSearch, searchTerm, onSearchChange, searchPlaceholder])

  // Memoize main content untuk mencegah re-render
  const mainContent = useMemo(() => (
    <main className="flex-1 overflow-auto p-4 lg:p-6 pb-20 lg:pb-6" style={{ backgroundColor: '#f9f9fb' }}>
      <PageTransition>
        {children}
      </PageTransition>
    </main>
  ), [children])

  // Memoize container styles untuk mencegah re-render
  const containerStyle = useMemo(() => ({ backgroundColor: '#f9f9fb' }), [])
  const mainStyle = useMemo(() => ({ backgroundColor: '#f9f9fb' }), [])

  // Conditional rendering yang aman untuk hooks
  return (
    <>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memverifikasi autentikasi...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="flex items-center justify-center">
          <div className="animate-pulse rounded-full h-12 w-12 bg-red-100"></div>
        </div>
      ) : (
        <div className="flex h-screen relative" style={containerStyle}>
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header {...headerProps} />
            {mainContent}
          </div>
          <BottomNavigation />
        </div>
      )}
    </>
  )
}
