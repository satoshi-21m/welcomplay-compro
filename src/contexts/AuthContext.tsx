"use client"

import { useState, useCallback, useEffect, createContext, useContext, useRef } from "react"
import { useRouter } from "next/navigation"
import { smoothRedirectToLogin, smoothRedirectToDashboard, smoothLogout } from "@/lib/utils/navigation"
import { completeCleanup } from "@/lib/utils/historyCleaner"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearAuthState: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Simplified state - hapus state yang tidak perlu
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)
  const hasInitialized = useRef(false)

  // Clear auth state - reset semua state ke default
  const clearAuthState = useCallback(() => {
    console.log('🧹 [AuthContext] Clearing auth state')
    
    // Check if component masih mounted sebelum update state
    if (!isMountedRef.current) {
      console.log('⚠️ [AuthContext] Component unmounted, skipping state update')
      return
    }
    
    // Reset semua state secara synchronous
    setUser(null)
    setIsAuthenticated(false)
    setIsLoading(false)
    
    // Reset flags
    hasInitialized.current = false
    
    // Cancel ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    console.log('✅ [AuthContext] Auth state cleared completely')
  }, [])

  // Fetch user data dari server (hanya sekali saat mount)
  const fetchUserData = useCallback(async () => {
    if (!isMountedRef.current || hasInitialized.current) {
      console.log('🔄 [AuthContext] Skip fetch - already initialized or unmounted')
      return
    }

    try {
      console.log('🔄 [AuthContext] Fetching user data...')
      // Tandai sudah mulai inisialisasi agar efek tidak memicu ulang
      hasInitialized.current = true
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      // ✅ Use correct auth endpoint
      const res = await fetch('/api/auth/profile', {
        credentials: 'include'
      })
      const response = await res.json()
      
      if (!isMountedRef.current) {
        console.log('🔄 [AuthContext] Component unmounted during fetch, aborting...')
        return
      }
      
      if (response && response.success && response.user) {
        console.log('✅ [AuthContext] User authenticated:', response.user.email)
        setUser(response.user)
        setIsAuthenticated(true)
      } else {
        console.log('❌ [AuthContext] User not authenticated')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error: any) {
      if (!isMountedRef.current) {
        console.log('🔄 [AuthContext] Component unmounted during error handling, aborting...')
        return
      }

      if (error.name === 'AbortError') {
        console.log('🔄 [AuthContext] Request aborted')
        return
      }
      
      // Handle 401 error gracefully without causing loops
      if (error.message && error.message.includes('401')) {
        console.log('🔒 [AuthContext] Unauthorized - user not authenticated')
        setUser(null)
        setIsAuthenticated(false)
      } else {
        console.error('❌ [AuthContext] Error fetching user:', error)
        setUser(null)
        setIsAuthenticated(false)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  // Login function - sesuai struktur auth yang benar
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log('🔐 [AuthContext] Attempting login...')
      
      // ✅ Use fetch directly for auth operations
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const response = await res.json()
      
      if (response && response.success && response.user) {
        try {
          if (typeof window !== 'undefined' && (response as any).debugTokens?.access) {
            window.localStorage.setItem('debug_access_token', (response as any).debugTokens.access)
          }
        } catch {}
        // Set user data setelah login berhasil
        setUser(response.user)
        setIsAuthenticated(true)
        
        console.log('✅ [AuthContext] Login successful, user:', response.user.email)
        
        // ✅ Pastikan state terpenuhi sebelum redirect
        await refreshUser()
        router.replace('/')
        
        return { success: true, message: 'Login berhasil' }
      } else {
        console.log('❌ [AuthContext] Login failed:', response?.message)
        return { 
          success: false, 
          message: response?.message || 'Login gagal' 
        }
      }
    } catch (error: any) {
      console.error('❌ [AuthContext] Login error:', error)
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat login' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Logout function - sesuai struktur auth yang benar
  const logout = useCallback(async () => {
    // Prevent multiple logout calls
    if (!isMountedRef.current) {
      console.log('⚠️ [AuthContext] Component unmounted, skipping logout')
      return
    }
    
    try {
      console.log('🚪 [AuthContext] Logging out...')
      setIsLoading(true)
      
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      
      // ✅ Use fetch directly for auth operations
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      console.log('✅ [AuthContext] Backend logout successful')
    } catch (error) {
      console.error('❌ [AuthContext] Logout error:', error)
      // Continue with logout even if backend fails
    } finally {
      // Check if component masih mounted sebelum cleanup
      if (!isMountedRef.current) {
        console.log('⚠️ [AuthContext] Component unmounted during logout, skipping cleanup')
        return
      }
      
      // 🧹 Clear auth state di finally block (selalu dieksekusi)
      clearAuthState()
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('debug_access_token')
        }
      } catch {}
      
      console.log('✅ [AuthContext] Logout completed, state cleared')
      
      // ✅ Complete cleanup untuk mencegah back navigation
      completeCleanup()
      console.log('🧹 [AuthContext] Complete cleanup during logout')
      
      // Redirect dengan utility function
      smoothRedirectToLogin(router)
    }
  }, [router, clearAuthState])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    hasInitialized.current = false
    await fetchUserData()
  }, [fetchUserData])

  // Auto check auth saat mount (hanya sekali)
  useEffect(() => {
    console.log('🔄 [AuthContext] Component mounted, initializing...')
    console.log('🔍 [AuthContext] Initial state:', { isLoading, isAuthenticated, user })
    
    isMountedRef.current = true
    
    // Fetch user data hanya sekali
    fetchUserData()

    // Cleanup function
    return () => {
      console.log('🧹 [AuthContext] Component unmounting, cleaning up...')
      
      // Set flag first
      isMountedRef.current = false
      
      // Cancel ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      
      // Reset state flags
      hasInitialized.current = false
      
      console.log('✅ [AuthContext] Cleanup completed')
    }
  }, [fetchUserData])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      login, 
      logout, 
      refreshUser, 
      clearAuthState
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
