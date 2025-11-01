import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { detectColumns } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { verifyJWT } from '@/lib/auth'
import { CacheInvalidator } from '@/lib/cache-invalidator'

export async function PUT(request: Request) {
  try {
    console.log('🔍 [Portfolio Update] Starting update process...')
    
    // Verify authentication for admin access
    try {
      const token = await verifyJWT(request as any)
      if (!token || !token.userId) {
        console.log('🚫 Portfolio Update API - No valid token found')
        return NextResponse.json({ 
          success: false, 
          message: 'Access denied. Valid admin token required.' 
        }, { status: 401 })
      }
      console.log('✅ Portfolio Update API - Authenticated user:', token.userId)
    } catch (authError: any) {
      console.log('🚫 Portfolio Update API - Authentication failed:', authError.message)
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
    console.log('✅ [Portfolio Update] Portfolio ID:', id)
    
    const body = await request.json()
    console.log('✅ [Portfolio Update] Request body:', body)
    
    const { title, description, technologies, category, projectUrl, featuredImage, isFeatured, sortOrder } = body
    console.log('✅ [Portfolio Update] Destructured data:', { title, description, technologies, category, projectUrl, featuredImage, isFeatured, sortOrder })

    const pool = getPool()
    console.log('✅ [Portfolio Update] Pool created')
    
    const cols = await detectColumns(TABLES.PORTFOLIO, ['title','description','technologies','category','project_url','featured_image','is_featured','sort_order'])
    console.log('✅ [Portfolio Update] Columns detected:', cols)
    
    const sets: string[] = []
    const sqlParams: any[] = []
    
    if (cols['title']) { sets.push('title=?'); sqlParams.push(title) }
    if (cols['description']) { sets.push('description=?'); sqlParams.push(description ?? null) }
    if (cols['technologies']) { sets.push('technologies=?'); sqlParams.push(technologies ?? null) }
    if (cols['category']) { sets.push('category=?'); sqlParams.push(category ?? null) }
    if (cols['project_url']) { sets.push('project_url=?'); sqlParams.push(projectUrl ?? null) }
    if (cols['featured_image']) { sets.push('featured_image=?'); sqlParams.push(featuredImage ?? null) }
    if (cols['is_featured']) { sets.push('is_featured=?'); sqlParams.push(!!isFeatured) }
    if (cols['sort_order']) { sets.push('sort_order=?'); sqlParams.push(sortOrder ?? 0) }
    
    console.log('✅ [Portfolio Update] Sets:', sets)
    console.log('✅ [Portfolio Update] SQL Params:', sqlParams)
    
    const sql = `UPDATE ${TABLES.PORTFOLIO} SET ${sets.join(', ')} WHERE id=?`
    sqlParams.push(id)
    console.log('✅ [Portfolio Update] SQL:', sql)
    console.log('✅ [Portfolio Update] Final SQL Params:', sqlParams)
    
    await pool.execute(sql, sqlParams)
    console.log('✅ [Portfolio Update] Database update executed successfully')

    // Invalidate portfolio cache after update
    CacheInvalidator.invalidatePortfolioCache()
    console.log('🗑️ [Portfolio Update] Portfolio cache invalidated')

    return NextResponse.json({ success: true, message: 'Portfolio updated successfully' })
    
  } catch (error: any) {
    console.error('❌ [Portfolio Update] Error:', error)
    console.error('❌ [Portfolio Update] Error stack:', error.stack)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update portfolio', error: error.stack },
      { status: 500 }
    )
  }
}
