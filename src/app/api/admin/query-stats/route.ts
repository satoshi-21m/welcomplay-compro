import { NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { getQueryStats, getSlowQueries } from '@/lib/query-monitor'

/**
 * GET /api/admin/query-stats
 * Returns query performance statistics
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const token = await verifyJWT(request as any)
    if (!token || !token.userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. Admin authentication required.' 
      }, { status: 401 })
    }

    // Get query statistics
    const stats = getQueryStats()
    const slowQueries = getSlowQueries(20) // Get top 20 slow queries

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          totalQueries: stats.totalQueries,
          avgDuration: Math.round(stats.avgDuration * 100) / 100, // Round to 2 decimals
          slowQueries: stats.slowQueries,
          fastestQuery: Math.round(stats.fastestQuery * 100) / 100,
          slowestQuery: Math.round(stats.slowestQuery * 100) / 100,
          slowQueryThreshold: 1000 // ms
        },
        recentQueries: stats.recentQueries,
        slowQueries: slowQueries.map(q => ({
          ...q,
          duration: Math.round(q.duration * 100) / 100
        }))
      }
    })
  } catch (error: any) {
    console.error('❌ Error fetching query stats:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch query statistics',
      error: error.message
    }, { status: 500 })
  }
}

