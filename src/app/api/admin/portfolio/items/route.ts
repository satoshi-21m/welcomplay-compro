import { NextRequest, NextResponse } from 'next/server'
import { getCachedAdminPortfolioItems } from '@/lib/actions/admin-portfolio-actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '60')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await getCachedAdminPortfolioItems({ limit, offset })
    
    // Transform response to match expected format
    return NextResponse.json({
      success: result.success,
      portfolios: result.data || [],
      total: result.data?.length || 0,
      message: result.message
    })
  } catch (error) {
    console.error('Error in admin portfolio items API:', error)
    return NextResponse.json(
      { 
        success: false, 
        portfolios: [], 
        total: 0, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
