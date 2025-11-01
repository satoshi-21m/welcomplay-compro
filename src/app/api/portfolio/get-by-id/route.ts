import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { detectColumns } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    console.log('🔍 [Portfolio Get By ID] Starting...')
    
    // Verify authentication for admin access
    try {
      const token = await verifyJWT(request as any)
      if (!token || !token.userId) {
        console.log('🚫 Portfolio Get By ID API - No valid token found')
        return NextResponse.json({ 
          success: false, 
          message: 'Access denied. Valid admin token required.' 
        }, { status: 401 })
      }
      console.log('✅ Portfolio Get By ID API - Authenticated user:', token.userId)
    } catch (authError: any) {
      console.log('🚫 Portfolio Get By ID API - Authentication failed:', authError.message)
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
    console.log('✅ [Portfolio Get By ID] Portfolio ID:', id)
    
    const pool = getPool()
    console.log('✅ [Portfolio Get By ID] Pool created')
    
    const cols = await detectColumns(TABLES.PORTFOLIO, ['slug','technologies','category','is_featured','sort_order','project_url','featured_image','created_at','updated_at'])
    console.log('✅ [Portfolio Get By ID] Columns detected:', cols)
    
    const selectParts = [
      'id','title','description',
      cols['slug'] ? 'slug' : "'' AS slug",
      cols['technologies'] ? 'technologies' : 'NULL as technologies',
      cols['category'] ? 'category' : 'NULL as category',
      cols['project_url'] ? 'project_url AS projectUrl' : "'' AS projectUrl",
      cols['featured_image'] ? 'featured_image AS featuredImage' : "'' AS featuredImage",
      cols['is_featured'] ? 'is_featured AS isFeatured' : 'NULL as isFeatured',
      cols['sort_order'] ? 'sort_order AS sortOrder' : '0 AS sortOrder',
      cols['created_at'] ? 'created_at AS createdAt' : 'NOW() AS createdAt',
      cols['updated_at'] ? 'updated_at AS updatedAt' : 'NOW() AS updatedAt'
    ]
    console.log('✅ [Portfolio Get By ID] Select parts:', selectParts)
    
    const [rows] = await pool.execute(
      `SELECT ${selectParts.join(', ')} FROM ${TABLES.PORTFOLIO} WHERE id = ? LIMIT 1`,
      [id]
    ) as any
    console.log('✅ [Portfolio Get By ID] Query executed, rows:', rows)
    
    const item = rows[0]
    console.log('✅ [Portfolio Get By ID] Item found:', item)
    
    if (!item) {
      console.log('❌ [Portfolio Get By ID] No item found')
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    
    console.log('✅ [Portfolio Get By ID] Returning success response')
    return NextResponse.json({ success: true, data: item })
    
  } catch (error: any) {
    console.error('❌ [Portfolio Get By ID] Error:', error)
    console.error('❌ [Portfolio Get By ID] Error stack:', error.stack)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch portfolio', error: error.stack },
      { status: 500 }
    )
  }
}
