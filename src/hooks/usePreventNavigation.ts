import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { smoothRedirectToLogin } from '@/lib/utils/navigation'

export function usePreventNavigation() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Mencegah browser back/forward ke protected routes
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isAuthenticated && !isLoading) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    // Mencegah popstate (browser back/forward)
    const handlePopState = (event: PopStateEvent) => {
      if (!isAuthenticated && !isLoading) {
        console.log('🚫 [usePreventNavigation] Blocking browser navigation to protected route')
        
        // Block semua navigation ke protected routes
        if (window.location.pathname !== '/admin-g30spki/login') {
          // Clear history dan redirect ke login
          window.history.pushState(null, '', '/admin-g30spki/login')
          window.history.replaceState(null, '', '/admin-g30spki/login')
          
          // Clear storage yang terkait admin
          sessionStorage.clear()
          localStorage.removeItem('admin_visited_pages')
          localStorage.removeItem('admin_last_route')
          
          console.log('🧹 [usePreventNavigation] History cleared and redirected to login')
        }
        
        // Redirect ke login
        smoothRedirectToLogin(router)
      }
    }

    // Mencegah pushState/replaceState yang tidak sah
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      if (isAuthenticated || isLoading) {
        return originalPushState.apply(this, args)
      } else {
        console.log('🚫 [usePreventNavigation] Blocking pushState to protected route')
        return
      }
    }

    window.history.replaceState = function(...args) {
      if (isAuthenticated || isLoading) {
        return originalReplaceState.apply(this, args)
      } else {
        console.log('🚫 [usePreventNavigation] Blocking replaceState to protected route')
        return
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      // Restore original methods
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [isAuthenticated, isLoading, router])

  // Return function untuk manual redirect prevention
  const preventNavigation = (targetPath: string) => {
    if (!isAuthenticated && !isLoading && targetPath !== '/admin-g30spki/login') {
      console.log('🚫 [usePreventNavigation] Preventing navigation to:', targetPath)
      
      // Clear history dan storage sebelum redirect
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin-g30spki/login')
        window.history.replaceState(null, '', '/admin-g30spki/login')
        sessionStorage.clear()
        localStorage.removeItem('admin_visited_pages')
        localStorage.removeItem('admin_last_route')
        
        console.log('🧹 [usePreventNavigation] History cleared during manual prevention')
      }
      
      smoothRedirectToLogin(router)
      return false
    }
    return true
  }

  return { preventNavigation }
}
