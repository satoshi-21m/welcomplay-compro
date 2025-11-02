import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPostsForPage } from '@/lib/actions/blog-actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log(`🔍 API Posts called with limit: ${limit}`)

    const posts = await getAllBlogPostsForPage(limit)

    // Simple pagination simulation
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = posts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        hasNext: endIndex < posts.length,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('❌ API Posts error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}