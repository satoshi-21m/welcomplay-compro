import { NextRequest, NextResponse } from 'next/server'
import { CacheInvalidator } from '@/lib/cache-invalidator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { type } = body
    
    switch (type) {
      case 'blog':
        CacheInvalidator.invalidateBlogCache()
        break
      case 'portfolio':
        CacheInvalidator.invalidatePortfolioCache()
        break
      case 'settings':
        CacheInvalidator.invalidateSettingsCache()
        break
      case 'all':
        CacheInvalidator.invalidateAllCache()
        break
      default:
        // If no type specified, invalidate all
        CacheInvalidator.invalidateAllCache()
        break
    }
    
    const stats = CacheInvalidator.getCacheStats()
    
    return NextResponse.json({
      success: true,
      message: `Cache invalidated for ${type || 'all'}`,
      cacheStats: stats
    })
    
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = CacheInvalidator.getCacheStats()
    
    return NextResponse.json({
      success: true,
      cacheStats: stats
    })
    
  } catch (error) {
    console.error('Cache stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    )
  }
}
