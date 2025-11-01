'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { revalidateTag, unstable_cache as unstableCache } from 'next/cache'
import { getAdminPortfolioItem, getAdminPortfolioItems } from '@/lib/services/portfolio-service-shared'
import { revalidatePortfolio } from '@/lib/revalidate-webhook'

/**
 * Server Actions for Admin Portfolio Operations
 * Direct database access - No REST API needed
 */

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get portfolio item by slug (Admin view)
 */
export async function getAdminPortfolioBySlug(slug: string) {
  try {
    const portfolio = await getAdminPortfolioItem(slug)
    return {
      success: true,
      data: portfolio
    }
  } catch (error: any) {
    console.error('❌ getAdminPortfolioBySlug - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch portfolio'
    }
  }
}

/**
 * Get all portfolio items (Admin view)
 */
export async function getAdminAllPortfolio(options?: {
  limit?: number
  offset?: number
}) {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🔧 Build time detected - skipping database call for admin portfolio')
      return { success: true, data: [] }
    }

    const portfolios = await getAdminPortfolioItems(options)
    return {
      success: true,
      data: portfolios
    }
  } catch (error: any) {
    console.error('❌ getAdminAllPortfolio - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch portfolio',
      data: []
    }
  }
}

// Alias for compatibility
export const getCachedAdminPortfolioItems = getAdminAllPortfolio

// ============================================
// CREATE OPERATION
// ============================================

/**
 * Create new portfolio item
 * ⚡ OPTIMIZED: Dynamic column detection
 */
export async function createPortfolio(data: {
  title: string
  description: string
  category_id: string
  project_type_id: number | null
  project_url: string
  featured_image_alt: string
  is_active: boolean
  featured_image: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  technologies: number[]
}) {
  try {
    const pool = getPool()
    const dbName = process.env.DB_NAME as string

    // ⚡ Check which columns exist
    const [columnRows] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio'`,
      [dbName]
    ) as any
    
    const existingColumns = new Set((columnRows as any[]).map(row => row.COLUMN_NAME))

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Build INSERT query dynamically
    const insertColumns = ['title', 'description', 'slug']
    const insertValues: any[] = [data.title, data.description, slug]
    const placeholders = ['?', '?', '?']

    // Add optional columns if they exist
    if (existingColumns.has('category_id')) {
      insertColumns.push('category_id')
      insertValues.push((data.category_id || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('project_type_id')) {
      insertColumns.push('project_type_id')
      insertValues.push((data.project_type_id || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('project_url')) {
      insertColumns.push('project_url')
      insertValues.push((data.project_url || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('featured_image')) {
      insertColumns.push('featured_image')
      insertValues.push((data.featured_image || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('featured_image_alt')) {
      insertColumns.push('featured_image_alt')
      insertValues.push((data.featured_image_alt || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('is_active')) {
      insertColumns.push('is_active')
      insertValues.push(data.is_active ? 1 : 0)
      placeholders.push('?')
    }

    if (existingColumns.has('meta_title')) {
      insertColumns.push('meta_title')
      insertValues.push((data.meta_title || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('meta_description')) {
      insertColumns.push('meta_description')
      insertValues.push((data.meta_description || null) as any)
      placeholders.push('?')
    }

    if (existingColumns.has('meta_keywords')) {
      insertColumns.push('meta_keywords')
      insertValues.push((data.meta_keywords || null) as any)
      placeholders.push('?')
    }

    // ✅ Only add technologies if column exists
    if (existingColumns.has('technologies')) {
      insertColumns.push('technologies')
      insertValues.push(JSON.stringify(data.technologies || []))
      placeholders.push('?')
    }

    // Add timestamps
    if (existingColumns.has('created_at')) {
      insertColumns.push('created_at')
      placeholders.push('NOW()')
    }

    if (existingColumns.has('updated_at')) {
      insertColumns.push('updated_at')
      placeholders.push('NOW()')
    }

    const query = `INSERT INTO ${TABLES.PORTFOLIO} (${insertColumns.join(', ')}) VALUES (${placeholders.join(', ')})`
    const [result] = await pool.execute(query, insertValues) as any
    const portfolioId = result.insertId

    // ✅ Handle technologies with pivot table if column doesn't exist
    if (!existingColumns.has('technologies') && data.technologies && data.technologies.length > 0) {
      try {
        // Check if portfolio_technologies table exists
        const [pivotTableExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_technologies'`,
          [dbName]
        ) as any
        
        if (Number(pivotTableExists?.[0]?.cnt || 0) > 0) {
          const values = data.technologies.map(() => '(?, ?)').join(', ')
          const params: any[] = []
          data.technologies.forEach(techId => {
            params.push(portfolioId, techId)
          })
          
          await pool.execute(
            `INSERT INTO portfolio_technologies (portfolio_id, technology_id) VALUES ${values}`,
            params
          )
        }
      } catch (pivotError) {
        console.error('⚠️ Failed to insert into pivot table:', pivotError)
        // Don't fail the main insert
      }
    }

    // Revalidate cache (local)
    revalidateTag('portfolio:items', "")
    revalidateTag('portfolio:landing:list', "")

    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidatePortfolio(slug).catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )

    return {
      success: true,
      message: 'Portfolio created successfully',
      data: { id: portfolioId, slug }
    }
  } catch (error: any) {
    console.error('❌ createPortfolio - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create portfolio'
    }
  }
}

// ============================================
// UPDATE OPERATION
// ============================================

/**
 * Update portfolio by slug
 * ⚡ OPTIMIZED: Dynamic column detection
 */
export async function updatePortfolioBySlug(slug: string, data: {
  title?: string
  description?: string
  category_id?: string
  project_type_id?: number | null
  project_url?: string
  featured_image_alt?: string
  is_active?: boolean
  featured_image?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  technologies?: number[]
}) {
  try {
    const pool = getPool()
    const dbName = process.env.DB_NAME as string

    // Get portfolio ID from slug
    const [idRows] = await pool.execute(
      `SELECT id FROM ${TABLES.PORTFOLIO} WHERE slug = ? LIMIT 1`,
      [slug]
    ) as any

    const portfolioId = idRows?.[0]?.id
    if (!portfolioId) {
      return {
        success: false,
        message: 'Portfolio not found'
      }
    }

    // ⚡ Check which columns exist in portfolio table
    const [columnRows] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio'`,
      [dbName]
    ) as any
    
    const existingColumns = new Set((columnRows as any[]).map(row => row.COLUMN_NAME))

    // Build UPDATE query with column checking
    const updateParts: string[] = []
    const values: any[] = []

    if (data.title !== undefined && existingColumns.has('title')) {
      updateParts.push('title = ?')
      values.push(data.title)
    }

    if (data.description !== undefined && existingColumns.has('description')) {
      updateParts.push('description = ?')
      values.push(data.description)
    }

    if (data.category_id !== undefined && existingColumns.has('category_id')) {
      updateParts.push('category_id = ?')
      values.push(data.category_id || null)
    }

    if (data.project_type_id !== undefined && existingColumns.has('project_type_id')) {
      updateParts.push('project_type_id = ?')
      values.push(data.project_type_id || null)
    }

    if (data.project_url !== undefined && existingColumns.has('project_url')) {
      updateParts.push('project_url = ?')
      values.push(data.project_url || null)
    }

    if (data.featured_image !== undefined && existingColumns.has('featured_image')) {
      updateParts.push('featured_image = ?')
      values.push(data.featured_image || null)
    }

    if (data.featured_image_alt !== undefined && existingColumns.has('featured_image_alt')) {
      updateParts.push('featured_image_alt = ?')
      values.push(data.featured_image_alt || null)
    }

    if (data.is_active !== undefined && existingColumns.has('is_active')) {
      updateParts.push('is_active = ?')
      values.push(data.is_active ? 1 : 0)
    }

    if (data.meta_title !== undefined && existingColumns.has('meta_title')) {
      updateParts.push('meta_title = ?')
      values.push(data.meta_title || null)
    }

    if (data.meta_description !== undefined && existingColumns.has('meta_description')) {
      updateParts.push('meta_description = ?')
      values.push(data.meta_description || null)
    }

    if (data.meta_keywords !== undefined && existingColumns.has('meta_keywords')) {
      updateParts.push('meta_keywords = ?')
      values.push(data.meta_keywords || null)
    }

    // ✅ Only update technologies if column exists
    if (data.technologies !== undefined && existingColumns.has('technologies')) {
      updateParts.push('technologies = ?')
      values.push(JSON.stringify(data.technologies || []))
    }

    // Add updated_at
    if (existingColumns.has('updated_at')) {
      updateParts.push('updated_at = NOW()')
    }

    if (updateParts.length === 0) {
      return {
        success: false,
        message: 'No fields to update'
      }
    }

    values.push(portfolioId)

    const query = `UPDATE ${TABLES.PORTFOLIO} SET ${updateParts.join(', ')} WHERE id = ?`
    const [result] = await pool.execute(query, values) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Portfolio not found'
      }
    }

    // ✅ Handle technologies dengan pivot table jika column tidak ada
    if (data.technologies !== undefined && !existingColumns.has('technologies')) {
      try {
        // Check if portfolio_technologies table exists
        const [pivotTableExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_technologies'`,
          [dbName]
        ) as any
        
        if (Number(pivotTableExists?.[0]?.cnt || 0) > 0) {
          // Delete existing relationships
          await pool.execute(
            'DELETE FROM portfolio_technologies WHERE portfolio_id = ?',
            [portfolioId]
          )
          
          // Insert new relationships
          if (Array.isArray(data.technologies) && data.technologies.length > 0) {
            const values = data.technologies.map(() => '(?, ?)').join(', ')
            const params: any[] = []
            data.technologies.forEach(techId => {
              params.push(portfolioId, techId)
            })
            
            await pool.execute(
              `INSERT INTO portfolio_technologies (portfolio_id, technology_id) VALUES ${values}`,
              params
            )
          }
        }
      } catch (pivotError) {
        console.error('⚠️ Failed to update pivot table:', pivotError)
        // Don't fail the main update
      }
    }

    // Revalidate cache (local)
    revalidateTag('portfolio:items', "")
    revalidateTag('portfolio:detail', "")
    revalidateTag('portfolio:landing:list', "")
    
    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidatePortfolio(slug).catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )
    
    return {
      success: true,
      message: 'Portfolio updated successfully',
      data: { slug }
    }
  } catch (error: any) {
    console.error('❌ updatePortfolioBySlug - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update portfolio'
    }
  }
}

// ============================================
// DELETE OPERATION
// ============================================

/**
 * Delete portfolio by ID
 */
export async function deletePortfolio(id: string) {
  try {
    const pool = getPool()

    const [result] = await pool.execute(
      `DELETE FROM ${TABLES.PORTFOLIO} WHERE id = ?`,
      [id]
    ) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Portfolio not found'
      }
    }

    // Revalidate cache (local)
    revalidateTag('portfolio:items', "")
    revalidateTag('portfolio:landing:list', "")
    
    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidatePortfolio().catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )
    
    return {
      success: true,
      message: 'Portfolio deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ deletePortfolio - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete portfolio'
    }
  }
}

// ============================================
// CATEGORY OPERATIONS
// ============================================

/**
 * Get portfolio categories - OPTIMIZED with portfolio count
 */
async function getPortfolioCategoriesCore() {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🔧 Build time detected - skipping database call for portfolio categories')
      return { success: true, data: [] }
    }

    const pool = getPool()
    
    // ⚡ Single optimized query with LEFT JOIN for portfolio count
    // Note: No WHERE filter - admin should see all categories (active & inactive)
    const [rows] = await pool.execute(
      `SELECT 
        pc.id, 
        pc.name, 
        pc.slug, 
        pc.description, 
        pc.icon, 
        pc.is_active, 
        pc.sort_order,
        COUNT(DISTINCT p.id) as portfolio_count
       FROM portfolio_categories pc
       LEFT JOIN portfolio p ON p.category_id = pc.id
       GROUP BY pc.id, pc.name, pc.slug, pc.description, pc.icon, pc.is_active, pc.sort_order
       ORDER BY pc.sort_order ASC, pc.name ASC`
    ) as any
    
    return {
      success: true,
      data: rows
    }
  } catch (error: any) {
    console.error('❌ getPortfolioCategories - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch portfolio categories',
      data: []
    }
  }
}

// ⚡ Cached version with ISR (revalidate every hour)
export const getCachedAdminPortfolioCategories = unstableCache(
  async () => getPortfolioCategoriesCore(),
  ['admin:portfolio-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['portfolio-categories', 'admin:portfolio-categories']
  }
)

// Non-cached version for compatibility
export const getPortfolioCategories = getPortfolioCategoriesCore

/**
 * Get project types
 */
/**
 * Get all project types (Admin) - OPTIMIZED with caching
 */
async function getProjectTypesCore() {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🔧 Build time detected - skipping database call for project types')
      return { success: true, data: [] }
    }

    const pool = getPool()
    
    // ⚡ Single optimized query with LEFT JOIN for portfolio count
    const [rows] = await pool.execute(
      `SELECT 
        pt.id, 
        pt.name, 
        pt.slug, 
        pt.description, 
        pt.color, 
        pt.icon, 
        pt.is_active, 
        pt.sort_order,
        COUNT(DISTINCT p.id) as portfolio_count
       FROM project_types pt
       LEFT JOIN portfolio p ON p.project_type_id = pt.id
       WHERE pt.is_active = 1
       GROUP BY pt.id, pt.name, pt.slug, pt.description, pt.color, pt.icon, pt.is_active, pt.sort_order
       ORDER BY pt.sort_order ASC, pt.name ASC`
    ) as any

    return {
      success: true,
      data: rows
    }
  } catch (error: any) {
    console.error('❌ getProjectTypes - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch project types',
      data: []
    }
  }
}

// ⚡ Cached version with ISR (revalidate every hour)
export const getCachedAdminProjectTypes = unstableCache(
  async () => getProjectTypesCore(),
  ['admin:project-types'],
  {
    revalidate: 3600, // 1 hour
    tags: ['project-types', 'admin:project-types']
  }
)

// Non-cached version for compatibility
export const getProjectTypes = getProjectTypesCore
