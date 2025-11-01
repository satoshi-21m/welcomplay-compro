import { NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { getCachedAdminProjectTypes } from '@/lib/actions/admin-portfolio-actions'

// ⚡ Enable Edge Runtime for faster response
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify authentication for admin access
    const token = await verifyJWT(request as any)
    if (!token || !token.userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. Valid admin token required.' 
      }, { status: 401 })
    }
  } catch (authError) {
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied. Admin authentication required.' 
    }, { status: 401 })
  }

  try {
    // ⚡ Use cached version for better performance
    const result = await getCachedAdminProjectTypes()
    
    if (result.success) {
      // ⚡ Add cache headers for client-side caching (5 minutes)
      return NextResponse.json({ 
        success: true, 
        data: result.data || [] 
      }, {
        headers: {
          'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
          'CDN-Cache-Control': 'max-age=300',
        }
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Portfolio Project Types API - Error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch project types' },
      { status: 500 }
    )
  }
}