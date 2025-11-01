import { useRouter } from 'next/navigation'

/**
 * Utility function untuk smooth navigation tanpa multiple redirect
 * Menggunakan single strategy untuk memastikan URL berubah dengan smooth
 */
export const smoothRedirect = (router: ReturnType<typeof useRouter>, targetPath: string) => {
  try {
    // Gunakan router.push untuk smooth navigation
    router.push(targetPath)
    
    // Tambahkan class untuk smooth transition
    if (typeof document !== 'undefined') {
      document.body.classList.add('page-transitioning')
      
      // Hapus class setelah transition selesai
      setTimeout(() => {
        document.body.classList.remove('page-transitioning')
      }, 300)
    }
  } catch (navigationError) {
    console.warn('⚠️ [Navigation] Router error, using fallback:', navigationError)
    // Fallback yang lebih smooth: gunakan history API
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetPath)
      // Trigger route change event
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
}

/**
 * Utility function untuk smooth redirect ke login
 */
export const smoothRedirectToLogin = (router: ReturnType<typeof useRouter>) => {
  smoothRedirect(router, '/admin-g30spki/login')
}

/**
 * Utility function untuk smooth redirect ke dashboard
 */
export const smoothRedirectToDashboard = (router: ReturnType<typeof useRouter>) => {
  smoothRedirect(router, '/admin-g30spki')
}

/**
 * Utility function untuk logout yang smooth
 * Membersihkan state dan redirect tanpa refresh
 */
export const smoothLogout = async (
  router: ReturnType<typeof useRouter>, 
  logoutFunction: () => Promise<void>
) => {
  try {
    // Jalankan logout function
    await logoutFunction()
    
    // Redirect dengan smooth transition
    smoothRedirectToLogin(router)
  } catch (error) {
    console.error('❌ [Navigation] Logout error:', error)
    // Fallback: redirect langsung jika logout gagal
    smoothRedirectToLogin(router)
  }
}
