'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { executeWithMonitoring } from '@/lib/query-monitor'

/**
 * Core Database Queries for Blog
 * Shared by both Landing Page and Admin Side
 * ⚡ Includes query performance monitoring for slow query detection
 */

// Schema info cache (process-level)
let blogSchemaCache: null | {
  cols: Record<string, boolean>
  hasCategoriesTable: boolean
  hasUsersTable: boolean
  hasUserNameCol: boolean
} = null

/**
 * Get blog schema information (cached)
 * ⚡ OPTIMIZED: Single query instead of 16 queries!
 */
async function getBlogSchemaInfo() {
  if (blogSchemaCache) return blogSchemaCache
  
  // Skip database calls during build time
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time detected - returning default blog schema')
    blogSchemaCache = {
      cols: {
        'featured_image': true,
        'featured_image_alt': true,
        'status': true,
        'is_featured': true,
        'published_at': false,  // This column doesn't exist
        'created_at': true,
        'updated_at': true,
        'content': true,
        'excerpt': true,
        'category_id': true,
        'category': false,      // Use categories table instead
        'meta_title': true,
        'meta_description': true,
        'meta_keywords': true,
        'author_id': true
      },
      hasCategoriesTable: true,
      hasUsersTable: false,       // Users table doesn't exist or name column is different
      hasUserNameCol: false       // Name column doesn't exist in users table
    }
    return blogSchemaCache
  }
  
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  
  try {
    // ⚡ OPTIMIZATION: Single query untuk check semua columns
    const [columnRows] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'posts'`,
      [dbName]
    ) as any
    
    const existingColumns = new Set((columnRows as any[]).map(row => row.COLUMN_NAME))
    
    const cols: Record<string, boolean> = {
      'featured_image': existingColumns.has('featured_image'),
      'featured_image_alt': existingColumns.has('featured_image_alt'),
      'status': existingColumns.has('status'),
      'is_featured': existingColumns.has('is_featured'),
      'published_at': existingColumns.has('published_at'),
      'created_at': existingColumns.has('created_at'),
      'updated_at': existingColumns.has('updated_at'),
      'content': existingColumns.has('content'),
      'category_id': existingColumns.has('category_id'),
      'category': existingColumns.has('category'),
      'meta_title': existingColumns.has('meta_title'),
      'meta_description': existingColumns.has('meta_description'),
      'meta_keywords': existingColumns.has('meta_keywords')
    }
    
    // ⚡ OPTIMIZATION: Single query untuk check semua tables
    const [tableRows] = await pool.execute(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('categories', 'users')`,
      [dbName]
    ) as any
    
    const existingTables = new Set((tableRows as any[]).map(row => row.TABLE_NAME))
    const hasCategoriesTable = existingTables.has('categories')
    const hasUsersTable = existingTables.has('users')
    
    // Check user name column if users table exists
    let hasUserNameCol = false
    if (hasUsersTable) {
      const [userColRows] = await pool.execute(
        `SELECT COLUMN_NAME 
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'`,
        [dbName]
      ) as any
      hasUserNameCol = userColRows.length > 0
    }
    
    blogSchemaCache = { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol }
    return blogSchemaCache
  } catch (error) {
    console.error('❌ getBlogSchemaInfo error:', error)
    // Fallback to safe defaults
    blogSchemaCache = {
      cols: {
        'featured_image': true,
        'featured_image_alt': true,
        'status': true,
        'is_featured': true,
        'published_at': true,
        'created_at': true,
        'updated_at': true,
        'content': true,
        'category_id': true,
        'category': false,
        'meta_title': true,
        'meta_description': true,
        'meta_keywords': true
      },
      hasCategoriesTable: true,
      hasUsersTable: true,
      hasUserNameCol: true
    }
    return blogSchemaCache
  }
}

/**
 * Core Query: Get blog post by slug (RAW data from database)
 * This is the single source of truth for fetching blog posts
 */
export async function getBlogPostBySlugCore(slug: string): Promise<any | null> {
  try {
    const pool = getPool()
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol } = schema
    
    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      cols['content'] ? 'p.content' : 'NULL as content',
      cols['status'] ? 'p.status' : '"PUBLISHED" as status',
      cols['featured_image'] ? 'p.featured_image' : 'NULL as featured_image',
      cols['featured_image_alt'] ? 'p.featured_image_alt' : 'NULL as featured_image_alt',
      cols['is_featured'] ? 'p.is_featured' : 'FALSE as is_featured',
      cols['meta_title'] ? 'p.meta_title' : 'NULL as meta_title',
      cols['meta_description'] ? 'p.meta_description' : 'NULL as meta_description',
      cols['meta_keywords'] ? 'p.meta_keywords' : 'NULL as meta_keywords',
      cols['published_at'] ? 'p.published_at' : 'p.created_at as published_at',
      'p.created_at',
      'p.updated_at',
      'p.author_id',
      cols['category_id'] ? 'p.category_id' : 'NULL as category_id'
    ]
    
    // Add category name
    if (cols['category_id'] && hasCategoriesTable) {
      selectParts.push("COALESCE(c.name, 'General') AS category_name")
    } else if (cols['category']) {
      selectParts.push('p.category AS category_name')
    } else {
      selectParts.push("'General' AS category_name")
    }
    
    // Add author name
    if (hasUsersTable && hasUserNameCol) {
      selectParts.push('COALESCE(a.name, "Admin") AS author_name')
    } else {
      selectParts.push('"Admin" AS author_name')
    }
    
    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (hasUsersTable) {
      joinClauses.push('LEFT JOIN users a ON p.author_id = a.id')
    }
    
    const query = `
      SELECT ${selectParts.join(', ')} 
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      WHERE p.slug = ?
      LIMIT 1
    `
    
    // ⚡ Execute with performance monitoring
    const [rows] = await executeWithMonitoring(pool, query, [slug], 'getBlogPostBySlugCore') as any
    
    if (!rows || rows.length === 0) {
      return null
    }
    
    return rows[0]
  } catch (error: any) {
    console.error('❌ getBlogPostBySlugCore - Error:', error)
    throw error
  }
}

/**
 * Core Query: Get multiple blog posts with filters
 */
export async function getBlogPostsCore(options: {
  limit?: number
  offset?: number
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | null
  excludeSlug?: string
  category?: string
}): Promise<any[]> {
  try {
    const pool = getPool()
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol } = schema
    
    const { limit, offset = 0, status, excludeSlug, category } = options
    
    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      cols['featured_image'] ? 'p.featured_image' : 'NULL as featured_image',
      cols['featured_image_alt'] ? 'p.featured_image_alt' : 'NULL as featured_image_alt',
      cols['is_featured'] ? 'p.is_featured' : 'FALSE as is_featured',
      cols['published_at'] ? 'COALESCE(p.published_at, p.created_at) as published_at' : 'p.created_at as published_at',
      'p.created_at',
      'p.updated_at',
      cols['status'] ? 'p.status' : '"PUBLISHED" as status',
      cols['category_id'] ? 'p.category_id' : 'NULL as category_id',
      'p.author_id'
    ]
    
    // Add category name
    if (cols['category_id'] && hasCategoriesTable) {
      selectParts.push("COALESCE(c.name, 'General') AS category_name")
    } else if (cols['category']) {
      selectParts.push('p.category AS category_name')
    } else {
      selectParts.push("'General' AS category_name")
    }
    
    // Add author name
    if (hasUsersTable && hasUserNameCol) {
      selectParts.push('COALESCE(a.name, "Admin") AS author_name')
    } else {
      selectParts.push('"Admin" AS author_name')
    }
    
    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (hasUsersTable) {
      joinClauses.push('LEFT JOIN users a ON p.author_id = a.id')
    }
    
    // Build WHERE conditions
    const whereConditions = []
    const queryParams: any[] = []
    
    if (status && cols['status']) {
      whereConditions.push('p.status = ?')
      queryParams.push(status)
    }
    
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
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      ${whereClause}
      ORDER BY ${cols['published_at'] ? 'COALESCE(p.published_at, p.created_at)' : 'p.created_at'} DESC
      ${limit ? `LIMIT ${limit}` : ''}
      ${offset ? `OFFSET ${offset}` : ''}
    `
    
    // ⚡ Execute with performance monitoring
    const [rows] = await executeWithMonitoring(pool, query, queryParams, 'getBlogPostsCore') as any
    return rows
  } catch (error: any) {
    console.error('❌ getBlogPostsCore - Error:', error)
    throw error
  }
}

/**
 * Core Query: Get blog categories
 */
export async function getBlogCategoriesCore(): Promise<Array<{ id: number; name: string; post_count?: number }>> {
  try {
    const pool = getPool()
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable } = schema
    const dbName = process.env.DB_NAME as string
    
    if (hasCategoriesTable) {
      // Check for sort_order column
      const [colSort] = await pool.execute(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'sort_order'`,
        [dbName]
      ) as any
      const hasSortOrder = Number(colSort?.[0]?.cnt || 0) > 0
      
      const hasCategoryIdColumn = cols['category_id']
      const orderBy = hasSortOrder ? 'ORDER BY c.sort_order ASC, c.name ASC' : 'ORDER BY c.name ASC'
      
      if (hasCategoryIdColumn) {
        const [rows] = await pool.execute(
          `SELECT c.id, c.name, COUNT(p.id) AS post_count
           FROM categories c
           LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'PUBLISHED'
           GROUP BY c.id, c.name
           ${orderBy}`
        ) as any
        return rows
      } else {
        const [rows] = await pool.execute(
          `SELECT c.id, c.name, 0 AS post_count
           FROM categories c
           ${orderBy}`
        ) as any
        return rows
      }
    } else if (cols['category']) {
      // Fallback: use category column
      const [rows] = await pool.execute(
        `SELECT category AS name, COUNT(*) AS post_count
         FROM posts
         WHERE status = 'PUBLISHED' AND category IS NOT NULL AND category <> ''
         GROUP BY category
         ORDER BY post_count DESC`
      ) as any
      
      return rows.map((row: any, index: number) => ({
        id: index + 1,
        name: row.name,
        post_count: row.post_count
      }))
    }
    
    return []
  } catch (error: any) {
    console.error('❌ getBlogCategoriesCore - Error:', error)
    throw error
  }
}

