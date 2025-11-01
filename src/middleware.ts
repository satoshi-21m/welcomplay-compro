import { NextRequest, NextResponse } from 'next/server'

// Helper: Sanitize slug untuk redirect
function sanitizeSlugForRedirect(slug: string): string {
  return slug
    .replace(/%26/g, 'and')
    .replace(/&/g, 'and')
    .replace(/%20/g, '-')
    .replace(/\+/g, 'plus')
    .replace(/@/g, 'at')
    .replace(/#/g, 'sharp')
    .replace(/!/g, '')
    .replace(/\?/g, '')
    .replace(/%/g, 'percent')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Normalisasi path agar tidak perlu duplikasi trailing slash
  const pathKey = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  
  // ✅ REDIRECT: Handle old URLs dengan special characters
  if (pathname.startsWith('/blog/') || pathname.startsWith('/portfolio/')) {
    const parts = pathname.split('/')
    const slug = parts[parts.length - 1]
    
    // Decode slug terlebih dahulu
    let decodedSlug = slug
    try {
      decodedSlug = decodeURIComponent(slug)
    } catch (e) {
      // If decode fails, use original
    }
    
    // Check if slug perlu dibersihkan
    if (/[^a-z0-9-]/.test(decodedSlug)) {
      const cleanedSlug = sanitizeSlugForRedirect(decodedSlug)
      
      if (cleanedSlug !== slug && cleanedSlug !== decodedSlug) {
        // Rebuild URL dengan cleaned slug
        const newPathname = parts.slice(0, -1).join('/') + '/' + cleanedSlug
        const url = request.nextUrl.clone()
        url.pathname = newPathname
        
        console.log(`🔀 [Middleware] Redirecting: ${pathname} → ${newPathname}`)
        
        // 301 permanent redirect untuk SEO
        return NextResponse.redirect(url, { status: 301 })
      }
    }
  }
  
  // Block ALL direct access to /admin/* paths (return 404)
  // This prevents people from discovering the admin panel
  // Only allow access via secret path /admin-g30spki/* which will be rewritten by next.config
  // Middleware runs BEFORE rewrites, so we see the original request path
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-g30spki')) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  // Set X-Robots-Tag untuk admin routes agar tidak diindeks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
    return res
  }

  // URL mapping untuk services pages
  const urlMappings: Record<string, string> = {
    '/jasa-pembuatan-website': '/web',
    '/jasa-pembuatan-mobile-app': '/mobile',
    '/jasa-manajemen-sosial-media': '/smm',
    '/jasa-search-engine-optimization': '/seo',
    '/jasa-kelola-google-dan-sosial-media-ads': '/ads',
    '/fotovideo': '/visual-ad-creation',
    // Kompatibilitas slug lama diarahkan ke visual-ad-creation
    '/visualad': '/visual-ad-creation',
  }

  // Cek apakah pathname ada di mapping
  if (urlMappings[pathKey]) {
    const newUrl = new URL(urlMappings[pathKey], request.url)
    return NextResponse.rewrite(newUrl) // Internal rewrite - URL tetap sama di browser
  }

  // Jika tidak ada mapping, lanjutkan request normal
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/blog/:slug*',
    '/portfolio/:slug*',
    '/jasa-pembuatan-website',
    '/jasa-pembuatan-website/:path*',
    '/jasa-pembuatan-mobile-app',
    '/jasa-pembuatan-mobile-app/:path*',
    '/jasa-manajemen-sosial-media',
    '/jasa-manajemen-sosial-media/:path*',
    '/jasa-search-engine-optimization',
    '/jasa-search-engine-optimization/:path*',
    '/jasa-kelola-google-dan-sosial-media-ads',
    '/jasa-kelola-google-dan-sosial-media-ads/:path*',
    '/fotovideo',
    '/fotovideo/:path*',
    '/visualad',
    '/visualad/:path*',
  ]
}