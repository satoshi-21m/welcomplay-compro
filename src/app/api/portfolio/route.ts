import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { detectColumns, tableExists, columnExists } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Verify authentication for admin access
    const token = await verifyJWT(request as any)
    if (!token || !token.userId) {
      console.log('🚫 Admin Portfolio API - No valid token found')
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. Valid admin token required.' 
      }, { status: 401 })
    }

    console.log('✅ Admin Portfolio API - Authenticated user:', token.userId)
  } catch (authError) {
    console.log('🚫 Admin Portfolio API - Authentication failed:', authError)
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied. Admin authentication required.' 
    }, { status: 401 })
  }

  const pool = getPool()
  
  try {
    const hasPortfolioTable = await tableExists(TABLES.PORTFOLIO)
    if (!hasPortfolioTable) {
      return NextResponse.json({ success: true, data: [] })
    }

    const cols = await detectColumns(TABLES.PORTFOLIO, [
      'id','title','description','slug','featured_image','featured_image_alt',
      'is_active','is_featured','portfolio_category_id','category_id','category',
      'project_type_id','project_type','technologies','project_url','github_url',
      'meta_title','meta_description','meta_keywords','created_at','updated_at'
    ])

    const selectParts = [
      'id',
      'title',
      'description',
      cols.slug ? 'slug' : 'NULL as slug',
      cols.featured_image ? 'featured_image AS featuredImage' : 'NULL as featuredImage',
      cols.featured_image_alt ? 'featured_image_alt AS featuredImageAlt' : 'NULL as featuredImageAlt',
      cols.is_active ? 'is_active' : 'NULL as is_active',
      cols.is_featured ? 'is_featured' : 'NULL as is_featured',
      cols.portfolio_category_id ? 'portfolio_category_id AS category_id' : (cols.category_id ? 'category_id' : 'NULL as category_id'),
      cols.category ? 'category AS categoryName' : 'NULL as categoryName',
      cols.project_type_id ? 'project_type_id' : 'NULL as project_type_id',
      cols.project_type ? 'project_type AS projectTypeName' : 'NULL as projectTypeName',
      cols.project_url ? 'project_url AS projectUrl' : 'NULL as projectUrl',
      cols.github_url ? 'github_url AS githubUrl' : 'NULL as githubUrl',
      cols.technologies ? 'technologies' : 'NULL as technologies',
      cols.meta_title ? 'meta_title' : "'' AS meta_title",
      cols.meta_description ? 'meta_description' : "'' AS meta_description",
      cols.meta_keywords ? 'meta_keywords' : "'' AS meta_keywords",
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    ]

    // Filter for active portfolios (admin can see all, but we'll filter for consistency)
    const whereClause = cols.is_active ? 'WHERE (is_active = 1 OR is_active IS NULL)' : ''
    
    const [rows] = await pool.execute(
      `SELECT ${selectParts.join(', ')} FROM ${TABLES.PORTFOLIO} ${whereClause} ORDER BY created_at DESC`
    ) as any

    return NextResponse.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('Error fetching portfolio:', e)
    return NextResponse.json({ success: false, message: e.message || 'Failed to fetch portfolio' }, { status: 500 })
  }
}