'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { executeWithMonitoring } from '@/lib/query-monitor'

/**
 * Core Database Queries for Portfolio
 * Shared by both Landing Page and Admin Side
 * ⚡ Includes query performance monitoring for slow query detection
 */

// Schema info cache (process-level)
let portfolioSchemaCache: null | {
  cols: Record<string, boolean>
  hasCategoriesTable: boolean
  hasProjectTypesTable: boolean
  hasCategoryColor: boolean
  hasProjectTypeColor: boolean
} = null

/**
 * Get portfolio schema information (cached)
 * ⚡ OPTIMIZED: Reduced from 20 queries to 3 queries!
 */
async function getPortfolioSchemaInfo() {
  if (portfolioSchemaCache) return portfolioSchemaCache
  
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  
  try {
    // ⚡ OPTIMIZATION: Single query untuk check semua columns di portfolio
    const [columnRows] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio'`,
      [dbName]
    ) as any
    
    const existingColumns = new Set((columnRows as any[]).map(row => row.COLUMN_NAME))
    
    const cols: Record<string, boolean> = {
      'featured_image': existingColumns.has('featured_image'),
      'featured_image_alt': existingColumns.has('featured_image_alt'),
      'status': existingColumns.has('status'),
      'is_featured': existingColumns.has('is_featured'),
      'created_at': existingColumns.has('created_at'),
      'updated_at': existingColumns.has('updated_at'),
      'project_type_id': existingColumns.has('project_type_id'),
      'category_id': existingColumns.has('category_id'),
      'category': existingColumns.has('category'),
      'technologies': existingColumns.has('technologies'),
      'project_url': existingColumns.has('project_url'),
      'is_active': existingColumns.has('is_active'),
      'meta_title': existingColumns.has('meta_title'),
      'meta_description': existingColumns.has('meta_description'),
      'meta_keywords': existingColumns.has('meta_keywords')
    }
    
    // ⚡ OPTIMIZATION: Single query untuk check tables
    const [tableRows] = await pool.execute(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('portfolio_categories', 'project_types')`,
      [dbName]
    ) as any
    
    const existingTables = new Set((tableRows as any[]).map(row => row.TABLE_NAME))
    const hasCategoriesTable = existingTables.has('portfolio_categories')
    const hasProjectTypesTable = existingTables.has('project_types')
    
    // ⚡ OPTIMIZATION: Single query untuk check color columns
    const [colorColRows] = await pool.execute(
      `SELECT TABLE_NAME, COLUMN_NAME 
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? 
       AND ((TABLE_NAME = 'portfolio_categories' AND COLUMN_NAME = 'color')
         OR (TABLE_NAME = 'project_types' AND COLUMN_NAME = 'color'))`,
      [dbName]
    ) as any
    
    let hasCategoryColor = false
    let hasProjectTypeColor = false
    
    for (const row of colorColRows) {
      if (row.TABLE_NAME === 'portfolio_categories') hasCategoryColor = true
      if (row.TABLE_NAME === 'project_types') hasProjectTypeColor = true
    }
    
    portfolioSchemaCache = { 
      cols, 
      hasCategoriesTable, 
      hasProjectTypesTable,
      hasCategoryColor,
      hasProjectTypeColor
    }
    return portfolioSchemaCache
  } catch (error) {
    console.error('❌ getPortfolioSchemaInfo error:', error)
    // Fallback to safe defaults (assume no color columns to prevent SQL errors)
    portfolioSchemaCache = {
      cols: {
        'featured_image': true,
        'featured_image_alt': true,
        'status': true,
        'is_featured': true,
        'created_at': true,
        'updated_at': true,
        'project_type_id': true,
        'category_id': true,
        'category': false,
        'technologies': true,
        'project_url': true,
        'is_active': true,
        'meta_title': true,
        'meta_description': true,
        'meta_keywords': true
      },
      hasCategoriesTable: true,
      hasProjectTypesTable: true,
      hasCategoryColor: false,
      hasProjectTypeColor: false
    }
    return portfolioSchemaCache
  }
}

/**
 * Core Query: Get portfolio item by slug (RAW data from database)
 * This is the single source of truth for fetching portfolio items
 */
export async function getPortfolioItemBySlugCore(slug: string): Promise<any | null> {
  try {
    const pool = getPool()
    const dbName = process.env.DB_NAME as string
    const schema = await getPortfolioSchemaInfo()
    const { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor } = schema
    
    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.description',
      'p.content',
      cols['featured_image'] ? 'p.featured_image' : 'NULL as featured_image',
      cols['featured_image_alt'] ? 'p.featured_image_alt' : 'NULL as featured_image_alt',
      cols['project_url'] ? 'p.project_url' : 'NULL as project_url',
      cols['is_active'] ? 'p.is_active' : 'TRUE as is_active',
      cols['meta_title'] ? 'p.meta_title' : 'NULL as meta_title',
      cols['meta_description'] ? 'p.meta_description' : 'NULL as meta_description',
      cols['meta_keywords'] ? 'p.meta_keywords' : 'NULL as meta_keywords',
      'p.created_at',
      'p.updated_at',
      cols['category_id'] ? 'p.category_id' : 'NULL as category_id',
      cols['project_type_id'] ? 'p.project_type_id' : 'NULL as project_type_id'
      // ⚠️ Note: technologies tidak di-SELECT di sini (kolom tidak ada di tabel portfolio)
      // Technologies akan di-fetch dari pivot table portfolio_technologies (line 207-228)
    ]
    
    // Add category name and color
    if (cols['category_id'] && hasCategoriesTable) {
      selectParts.push("COALESCE(c.name, 'General') AS category_name")
      selectParts.push('COALESCE(c.slug, "") AS category_slug')
      selectParts.push('COALESCE(c.icon, "Folder") AS category_icon')
      selectParts.push(hasCategoryColor ? 'COALESCE(c.color, "#dc2626") AS category_color' : '"#dc2626" AS category_color')
    } else if (cols['category']) {
      selectParts.push('p.category AS category_name')
      selectParts.push('"" AS category_slug')
      selectParts.push('"Folder" AS category_icon')
      selectParts.push('"#dc2626" AS category_color')
    } else {
      selectParts.push("'General' AS category_name")
      selectParts.push('"" AS category_slug')
      selectParts.push('"Folder" AS category_icon')
      selectParts.push('"#dc2626" AS category_color')
    }
    
    // Add project type name and color
    if (cols['project_type_id'] && hasProjectTypesTable) {
      selectParts.push('COALESCE(pt.name, "") AS project_type_name')
      selectParts.push('COALESCE(pt.slug, "") AS project_type_slug')
      selectParts.push(hasProjectTypeColor ? 'COALESCE(pt.color, "#6b7280") AS project_type_color' : '"#6b7280" AS project_type_color')
    } else {
      selectParts.push('"" AS project_type_name')
      selectParts.push('"" AS project_type_slug')
      selectParts.push('"#6b7280" AS project_type_color')
    }
    
    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN portfolio_categories c ON p.category_id = c.id')
    }
    if (cols['project_type_id'] && hasProjectTypesTable) {
      joinClauses.push('LEFT JOIN project_types pt ON p.project_type_id = pt.id')
    }
    
    const query = `
      SELECT ${selectParts.join(', ')} 
      FROM ${TABLES.PORTFOLIO} p
      ${joinClauses.join(' ')}
      WHERE p.slug = ?
      LIMIT 1
    `
    
    // ⚡ Execute with performance monitoring
    const [rows] = await executeWithMonitoring(pool, query, [slug], 'getPortfolioItemBySlugCore') as any
    
    if (!rows || rows.length === 0) {
      return null
    }
    
    const item = rows[0]
    
    // ✅ Fetch technologies from pivot table (kolom technologies tidak ada di tabel portfolio)
    try {
      // Check if portfolio_technologies table exists
      const [pivotTableExists] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_technologies'`,
        [dbName]
      ) as any
      
      if (Number(pivotTableExists?.[0]?.cnt || 0) > 0) {
        const [techRows] = await pool.execute(
          `SELECT technology_id FROM portfolio_technologies WHERE portfolio_id = ?`,
          [item.id]
        ) as any
        
        const techIds = (techRows as any[]).map(row => row.technology_id)
        item.technologies = JSON.stringify(techIds)
      } else {
        // Pivot table tidak ada, assign empty
        item.technologies = JSON.stringify([])
      }
    } catch (pivotError) {
      console.error('⚠️ Failed to fetch technologies from pivot table:', pivotError)
      // Assign empty technologies on error
      item.technologies = JSON.stringify([])
    }
    
    return item
  } catch (error: any) {
    console.error('❌ getPortfolioItemBySlugCore - Error:', error)
    throw error
  }
}

/**
 * Core Query: Get multiple portfolio items with filters
 */
export async function getPortfolioItemsCore(options: {
  limit?: number
  offset?: number
  category?: string
  excludeSlug?: string
}): Promise<any[]> {
  try {
    const pool = getPool()
    const schema = await getPortfolioSchemaInfo()
    const { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor } = schema
    
    const { limit, offset = 0, category, excludeSlug } = options
    
    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.description',
      cols['featured_image'] ? 'p.featured_image' : 'NULL as featured_image',
      cols['is_active'] ? 'p.is_active' : 'TRUE as is_active',
      'p.created_at',
      'p.updated_at',
      cols['category_id'] ? 'p.category_id' : 'NULL as category_id',
      cols['project_type_id'] ? 'p.project_type_id' : 'NULL as project_type_id'
      // ⚠️ Note: technologies tidak di-SELECT di sini (kolom tidak ada di tabel portfolio)
      // Technologies akan di-fetch dari pivot table portfolio_technologies (line 336-368)
    ]
    
    // Add category name and color
    if (cols['category_id'] && hasCategoriesTable) {
      selectParts.push("COALESCE(c.name, 'General') AS category_name")
      selectParts.push('COALESCE(c.slug, "") AS category_slug')
      selectParts.push('COALESCE(c.icon, "Folder") AS category_icon')
      selectParts.push(hasCategoryColor ? 'COALESCE(c.color, "#dc2626") AS category_color' : '"#dc2626" AS category_color')
    } else if (cols['category']) {
      selectParts.push('p.category AS category_name')
      selectParts.push('"" AS category_slug')
      selectParts.push('"Folder" AS category_icon')
      selectParts.push('"#dc2626" AS category_color')
    } else {
      selectParts.push("'General' AS category_name")
      selectParts.push('"" AS category_slug')
      selectParts.push('"Folder" AS category_icon')
      selectParts.push('"#dc2626" AS category_color')
    }
    
    // Add project type name and color
    if (cols['project_type_id'] && hasProjectTypesTable) {
      selectParts.push('COALESCE(pt.name, "") AS project_type_name')
      selectParts.push('COALESCE(pt.slug, "") AS project_type_slug')
      selectParts.push(hasProjectTypeColor ? 'COALESCE(pt.color, "#6b7280") AS project_type_color' : '"#6b7280" AS project_type_color')
    } else {
      selectParts.push('"" AS project_type_name')
      selectParts.push('"" AS project_type_slug')
      selectParts.push('"#6b7280" AS project_type_color')
    }
    
    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN portfolio_categories c ON p.category_id = c.id')
    }
    if (cols['project_type_id'] && hasProjectTypesTable) {
      joinClauses.push('LEFT JOIN project_types pt ON p.project_type_id = pt.id')
    }
    
    // Build WHERE conditions
    const whereConditions = []
    const queryParams: any[] = []
    
    if (excludeSlug) {
      whereConditions.push('p.slug != ?')
      queryParams.push(excludeSlug)
    }
    
    if (category) {
      if (cols['category_id'] && hasCategoriesTable) {
        whereConditions.push('c.name = ?')
      } else {
        whereConditions.push('p.category = ?')
      }
      queryParams.push(category)
    }
    
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : ''
    
    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.PORTFOLIO} p
      ${joinClauses.join(' ')}
      ${whereClause}
      ORDER BY p.created_at DESC
      ${limit ? `LIMIT ${limit}` : ''}
      ${offset ? `OFFSET ${offset}` : ''}
    `
    
    // ⚡ Execute with performance monitoring
    const [rows] = await executeWithMonitoring(pool, query, queryParams, 'getPortfolioItemsCore') as any
    
    // ✅ Fetch technologies from pivot table (kolom technologies tidak ada di tabel portfolio)
    try {
      const dbName = process.env.DB_NAME as string
      const [pivotTableExists] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio_technologies'`,
        [dbName]
      ) as any
      
      if (Number(pivotTableExists?.[0]?.cnt || 0) > 0 && rows.length > 0) {
        const portfolioIds = rows.map((row: any) => row.id)
        const [techRows] = await pool.execute(
          `SELECT portfolio_id, GROUP_CONCAT(technology_id) as tech_ids 
           FROM portfolio_technologies 
           WHERE portfolio_id IN (${portfolioIds.map(() => '?').join(',')})
           GROUP BY portfolio_id`,
          portfolioIds
        ) as any
        
        // Create map of portfolio_id -> technologies
        const techMap = new Map()
        for (const row of techRows as any[]) {
          const ids = row.tech_ids ? row.tech_ids.split(',').map((id: string) => parseInt(id)) : []
          techMap.set(row.portfolio_id, ids)
        }
        
        // Assign technologies to each portfolio item (empty array if not found)
        for (const item of rows as any[]) {
          item.technologies = JSON.stringify(techMap.get(item.id) || [])
        }
      } else {
        // Pivot table tidak ada, assign empty technologies
        for (const item of rows as any[]) {
          item.technologies = JSON.stringify([])
        }
      }
    } catch (pivotError) {
      console.error('⚠️ Failed to fetch technologies from pivot table:', pivotError)
      // Assign empty technologies on error
      for (const item of rows as any[]) {
        item.technologies = JSON.stringify([])
      }
    }
    
    return rows
  } catch (error: any) {
    console.error('❌ getPortfolioItemsCore - Error:', error)
    throw error
  }
}

