import { NextRequest, NextResponse } from 'next/server'
import { getCachedAdminProjectTypes } from '@/lib/actions/admin-portfolio-actions'

export async function GET(request: NextRequest) {
  try {
    const result = await getCachedAdminProjectTypes()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in admin project types API:', error)
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
