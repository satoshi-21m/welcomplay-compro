import { NextResponse } from 'next/server'
import { getBlogCategoriesAdmin } from '@/lib/actions/admin-blog-actions'

// ✅ Wrapper API untuk compatibility dengan SWR fetcher
export async function GET(request: Request) {
  try {
    const result = await getBlogCategoriesAdmin()
    
    return NextResponse.json({
      success: result.success,
      data: result.data || [],
      message: result.message
    })
  } catch (error: any) {
    console.error('Error in blog categories API:', error)
    return NextResponse.json(
      { 
        success: false, 
        data: [], 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

