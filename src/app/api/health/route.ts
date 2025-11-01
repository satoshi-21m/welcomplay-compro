import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Block all access to this endpoint - no data should be returned
  console.log('🚫 Health API - Access blocked to prevent data leak')
  return NextResponse.json({ 
    success: false, 
    message: 'This endpoint is not available' 
  }, { status: 404 })
}