import { NextRequest, NextResponse } from 'next/server'
import { getCachedAdminPortfolioCategories } from '@/lib/actions/admin-portfolio-actions'

export async function GET(request: NextRequest) {
  try {
    const result = await getCachedAdminPortfolioCategories()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in admin portfolio categories API:', error)
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
