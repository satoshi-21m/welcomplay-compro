import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { verifyJWT } from '@/lib/auth'

export async function DELETE(request: Request) {
  try {
    console.log('🔍 [Portfolio Delete] Starting...')
    
    // Verify authentication for admin access
    try {
      const token = await verifyJWT(request as any)
      if (!token || !token.userId) {
        console.log('🚫 Portfolio Delete API - No valid token found')
        return NextResponse.json({ 
          success: false, 
          message: 'Access denied. Valid admin token required.' 
        }, { status: 401 })
      }
      console.log('✅ Portfolio Delete API - Authenticated user:', token.userId)
    } catch (authError: any) {
      console.log('🚫 Portfolio Delete API - Authentication failed:', authError.message)
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. Admin authentication required.',
        error: authError.message 
      }, { status: 401 })
    }
    
    // Get ID from query parameters
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Portfolio ID is required' 
      }, { status: 400 })
    }
    console.log('✅ [Portfolio Delete] Portfolio ID:', id)
    
    const pool = getPool()
    console.log('✅ [Portfolio Delete] Pool created')
    
    await pool.execute('DELETE FROM portfolio WHERE id = ?', [id])
    console.log('✅ [Portfolio Delete] Database delete executed successfully')
    
    return NextResponse.json({ success: true, message: 'Portfolio deleted successfully' })
    
  } catch (error: any) {
    console.error('❌ [Portfolio Delete] Error:', error)
    console.error('❌ [Portfolio Delete] Error stack:', error.stack)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete portfolio', error: error.stack },
      { status: 500 }
    )
  }
}
