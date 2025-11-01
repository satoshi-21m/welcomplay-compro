/**
 * Utility functions untuk clear browser history dan storage
 * Mencegah user kembali ke halaman admin setelah logout
 */

/**
 * Clear semua browser history dan replace dengan login page
 */
export const clearBrowserHistory = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Clear semua history entries dan replace dengan login
    window.history.pushState(null, '', '/admin-g30spki/login')
    
    // Replace semua history yang ada
    for (let i = 0; i < window.history.length; i++) {
      window.history.replaceState(null, '', '/admin-g30spki/login')
    }
    
    // Push state baru untuk login
    window.history.pushState(null, '', '/admin-g30spki/login')
    
    console.log('🧹 [HistoryCleaner] Browser history cleared')
  } catch (error) {
    console.warn('⚠️ [HistoryCleaner] Error clearing history:', error)
  }
}

/**
 * Clear storage yang terkait admin
 */
export const clearAdminStorage = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Clear session storage (data sementara)
    sessionStorage.clear()
    
    // Clear local storage yang terkait admin
    localStorage.removeItem('admin_visited_pages')
    localStorage.removeItem('admin_last_route')
    localStorage.removeItem('admin_preferences')
    localStorage.removeItem('admin_theme')
    localStorage.removeItem('admin_sidebar_collapsed')
    
    // Clear cookies yang terkait admin (jika ada)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('🧹 [HistoryCleaner] Admin storage cleared')
  } catch (error) {
    console.warn('⚠️ [HistoryCleaner] Error clearing storage:', error)
  }
}

/**
 * Clear semua data dan history (complete cleanup)
 */
export const completeCleanup = () => {
  clearBrowserHistory()
  clearAdminStorage()
  
  // Force reload jika masih di halaman admin
  if (typeof window !== 'undefined' && window.location.pathname !== '/admin-g30spki/login') {
    console.log('🔄 [HistoryCleaner] Force cleanup - redirecting to login')
    window.location.href = '/admin-g30spki/login'
  }
}

/**
 * Block back navigation dengan event listener
 */
export const blockBackNavigation = () => {
  if (typeof window === 'undefined') return
  
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // Block navigation jika user mencoba leave page
    event.preventDefault()
    event.returnValue = ''
    
    // Clear history sebelum leave
    clearBrowserHistory()
  }
  
  const handlePopState = (event: PopStateEvent) => {
    // Block back/forward navigation
    event.preventDefault()
    
    // Clear history dan redirect ke login
    clearBrowserHistory()
    clearAdminStorage()
    
    // Redirect ke login
    window.location.href = '/admin-g30spki/login'
  }
  
  // Add event listeners
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('popstate', handlePopState)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('popstate', handlePopState)
  }
}
