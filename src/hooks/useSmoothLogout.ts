import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { completeCleanup, blockBackNavigation } from '@/lib/utils/historyCleaner'

/**
 * Hook untuk smooth logout dengan loading state yang elegant
 */
export function useSmoothLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  /**
   * Block back navigation setelah logout
   */
  const blockNavigation = useCallback(() => {
    // Block back navigation
    const cleanup = blockBackNavigation()
    
    // Cleanup setelah 5 detik (pastikan user sudah di login page)
    setTimeout(() => {
      if (cleanup) cleanup()
    }, 5000)
    
    console.log('🚫 [useSmoothLogout] Back navigation blocked')
  }, [])

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return // Prevent multiple logout calls
    
    try {
      setIsLoggingOut(true)
      
      // Tambahkan class untuk smooth transition
      if (typeof document !== 'undefined') {
        document.body.classList.add('page-transitioning', 'fade-out')
      }
      
      // Tunggu sebentar untuk smooth transition
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Jalankan logout
      await logout()
      
      // Complete cleanup dan block navigation
      completeCleanup()
      blockNavigation()
      
      // Redirect dengan smooth transition
      router.push('/admin-g30spki/login')
      
      // Hapus class setelah redirect
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          document.body.classList.remove('page-transitioning', 'fade-out')
        }
      }, 300)
      
    } catch (error) {
      console.error('❌ [useSmoothLogout] Logout error:', error)
      
      // Reset state jika error
      setIsLoggingOut(false)
      
      // Hapus class jika error
      if (typeof document !== 'undefined') {
        document.body.classList.remove('page-transitioning', 'fade-out')
      }
      
      // Complete cleanup dan fallback redirect
      completeCleanup()
      blockNavigation()
      router.push('/admin-g30spki/login')
    }
  }, [logout, router, isLoggingOut, blockNavigation])

  return {
    handleLogout,
    isLoggingOut
  }
}
