import { NextRequest, NextResponse } from 'next/server'
import { getCachedAdminBlogPosts } from '@/lib/actions/admin-blog-actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await getCachedAdminBlogPosts({ limit, offset })
    
    // Transform response to match expected format
    return NextResponse.json({
      success: result.success,
      posts: result.data || [],
      total: result.data?.length || 0,
      message: result.message
    })
  } catch (error) {
    console.error('Error in admin blog posts API:', error)
    return NextResponse.json(
      { 
        success: false, 
        posts: [], 
        total: 0, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
