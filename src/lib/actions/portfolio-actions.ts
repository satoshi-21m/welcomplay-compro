'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { cache, CACHE_KEYS, CACHE_TTL, generateCacheKey } from '@/lib/cache'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPublicPortfolioItem, getPublicPortfolioItems, getRelatedPublicPortfolioItems } from '@/lib/services/portfolio-service-shared'

// --- Lightweight schema cache (lazy, process-level) ---
let portfolioSchemaCached: null | {
  cols: Record<string, boolean>
  hasCategoriesTable: boolean
  hasProjectTypesTable: boolean
  hasCategoryColor: boolean
  hasProjectTypeColor: boolean
} = null

async function getPortfolioSchemaInfo() {
  if (portfolioSchemaCached) return portfolioSchemaCached
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const colNames = ['featured_image', 'status', 'is_featured', 'created_at', 'updated_at', 'project_type_id', 'category_id', 'category', 'technologies'] as const
  const cols: Record<string, boolean> = {}
  for (const name of colNames) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = ?`,
      [dbName, name]
    ) as any
    cols[name] = Number(rows?.[0]?.cnt || 0) > 0
  }
  const [categoriesTableExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
    [dbName]
  ) as any
  const hasCategoriesTable = Number(categoriesTableExists?.[0]?.cnt || 0) > 0
  const [projectTypesTableExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types'`,
    [dbName]
  ) as any
  const hasProjectTypesTable = Number(projectTypesTableExists?.[0]?.cnt || 0) > 0
  
  // ⚡ Check color columns in categories and project_types tables
  const [categoryColorExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'color'`,
    [dbName]
  ) as any
  const hasCategoryColor = Number(categoryColorExists?.[0]?.cnt || 0) > 0
  
  const [projectTypeColorExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types' AND COLUMN_NAME = 'color'`,
    [dbName]
  ) as any
  const hasProjectTypeColor = Number(projectTypeColorExists?.[0]?.cnt || 0) > 0
  
  portfolioSchemaCached = { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor }
  return portfolioSchemaCached
}

export async function getAllPortfolioItems(): Promise<any[]> {
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.PORTFOLIO
    const cached = cache.get<any[]>(cacheKey)
    
    if (cached) {
      console.log(`✅ getAllPortfolioItems - Cache hit`)
      return cached
    }

    console.log(`🔄 getAllPortfolioItems - Cache miss, fetching from database`)
    const pool = getPool()
    
    // ⚡ OPTIMIZED: Use cached schema info (including color columns check)
    const { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor } = await getPortfolioSchemaInfo()

    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.description',
      'p.content',
      cols['featured_image'] ? 'p.featured_image AS image' : 'NULL as image',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt',
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS category" : 
        cols['category'] ? 'p.category' : "'General' AS category",
      cols['category_id'] && hasCategoriesTable && hasCategoryColor ? 'COALESCE(c.color, "#dc2626") AS categoryColor' : '"#dc2626" AS categoryColor',
      cols['project_type_id'] && hasProjectTypesTable ? 'COALESCE(pt.name, "Web Development") AS projectTypeName' : '"Web Development" AS projectTypeName',
      cols['project_type_id'] && hasProjectTypesTable && hasProjectTypeColor ? 'COALESCE(pt.color, "#6b7280") AS projectTypeColor' : '"#6b7280" AS projectTypeColor',
      // ⚠️ Technologies tidak di-SELECT (kolom tidak ada, fetch dari pivot table portfolio_technologies)
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS categoryName" : 
        cols['category'] ? 'p.category AS categoryName' : "'General' AS categoryName"
    ]

    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (cols['project_type_id'] && hasProjectTypesTable) {
      joinClauses.push('LEFT JOIN project_types pt ON p.project_type_id = pt.id')
    }

    // Build WHERE conditions
    const whereConditions: string[] = []
    const queryParams: (string | number)[] = []
    
    // Only filter by status if status column exists and we want to show only published items
    // For now, let's get all items to see what's available
    // if (cols['status']) {
    //   whereConditions.push('p.status = ?')
    //   queryParams.push('PUBLISHED')
    // }

    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.PORTFOLIO} p
      ${joinClauses.join(' ')}
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
      ORDER BY ${cols['created_at'] ? 'p.created_at' : 'p.id'} DESC
    `
    
    const [rows] = await pool.execute(query, queryParams) as any

    // Transform data
    const transformedItems = rows.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      image: item.image,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      categoryColor: item.categoryColor,
      projectTypeName: item.projectTypeName,
      projectTypeColor: item.projectTypeColor,
      technologies: item.technologies ? JSON.parse(item.technologies) : [],
      categoryName: item.categoryName
    }))

    console.log(`✅ getAllPortfolioItems - Found ${transformedItems.length} portfolio items`)
    
    // Cache the result
    cache.set(cacheKey, transformedItems, CACHE_TTL.PORTFOLIO)
    console.log(`💾 getAllPortfolioItems - Cached result`)
    
    return transformedItems
  } catch (error: any) {
    console.error('❌ getAllPortfolioItems - Error:', error)
    return []
  }
}

// ⚡ Process-level cache untuk schema info
let landingPortfolioSchemaCache: { hasTechnologies: boolean } | null = null

// Cached variant for landing usage with tag-based revalidation
// ⚡ OPTIMIZED: Minimal schema check dengan process-level cache
export const getLandingPortfolioItems = unstableCache(
  async (limit: number = 6): Promise<any[]> => {
    try {
      const pool = getPool()
      
      // ⚡ FAST: One-time schema check per server restart
      if (!landingPortfolioSchemaCache) {
        try {
          const dbName = process.env.DB_NAME as string
          const [techColExists] = await pool.execute(
            `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'technologies'`,
            [dbName]
          ) as any
          const hasTechnologies = Number(techColExists?.[0]?.cnt || 0) > 0
          landingPortfolioSchemaCache = { hasTechnologies }
          console.log('📋 Landing portfolio schema cached:', landingPortfolioSchemaCache)
        } catch (schemaError) {
          console.error('⚠️ Schema check failed, using safe defaults:', schemaError)
          landingPortfolioSchemaCache = { hasTechnologies: false }
        }
      }
      
      const { hasTechnologies } = landingPortfolioSchemaCache
      
      // ⚡ FAST: Optimized query untuk landing page
      const query = `
        SELECT 
          p.id, 
          p.title, 
          p.slug, 
          p.description,
          p.featured_image AS image,
          p.created_at AS createdAt,
          p.updated_at AS updatedAt,
          COALESCE(c.name, 'General') AS category,
          COALESCE(c.slug, '') AS categorySlug,
          COALESCE(c.icon, 'Folder') AS categoryIcon,
          COALESCE(pt.name, '') AS projectTypeName,
          COALESCE(pt.slug, '') AS projectTypeSlug
        FROM ${TABLES.PORTFOLIO} p
        LEFT JOIN portfolio_categories c ON c.id = p.category_id
        LEFT JOIN project_types pt ON pt.id = p.project_type_id
        WHERE p.is_active = 1
        ORDER BY p.created_at DESC
        LIMIT ?
      `
      
      const [rows] = await pool.execute(query, [limit]) as any
      return rows as any[]
    } catch (error: any) {
      console.error('❌ getLandingPortfolioItems - Error:', error.message)
      // Return empty array on error instead of throwing
      return []
    }
  },
  ['portfolio:landing:list'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['portfolio:landing:list', 'portfolio:posts'] // Tags untuk on-demand revalidation
  }
)

// ✅ REFACTORED: Use shared service layer
async function getPortfolioItemBySlugInternal(slug: string): Promise<any | null> {
  try {
    return await getPublicPortfolioItem(slug)
    
  } catch (error: any) {
    console.error('❌ getPortfolioItemBySlug - Error:', error)
    return null
  }
}

// ⚡ OPTIMIZED: Cached wrapper untuk detail page
// ✅ ISR + On-Demand Revalidation untuk detail page
export const getPortfolioItemBySlug = unstableCache(
  async (slug: string): Promise<any | null> => getPortfolioItemBySlugInternal(slug),
  ['portfolio:detail'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['portfolio:posts', 'portfolio:detail'] // Tags untuk on-demand revalidation
  }
)

// ⚡ Process-level cache untuk related portfolio schema
let relatedPortfolioSchemaCache: {
  cols: Record<string, boolean>
  hasCategoriesTable: boolean
  hasProjectTypesTable: boolean
  hasCategoryColor: boolean
  hasProjectTypeColor: boolean
} | null = null

// Internal function untuk related portfolio items
async function getRelatedPortfolioItemsInternal(currentSlug: string, currentCategory: string, limit: number = 3): Promise<any[]> {
  try {
    const pool = getPool()
    
    // ⚡ FAST: One-time schema check per server restart
    if (!relatedPortfolioSchemaCache) {
      try {
        const dbName = process.env.DB_NAME as string
        const colNames = ['featured_image', 'status', 'project_type_id', 'category_id', 'category', 'technologies'] as const
        const cols: Record<string, boolean> = {}
        
        for (const name of colNames) {
          const [rows] = await pool.execute(
            `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = ?`,
            [dbName, name]
          ) as any
          cols[name] = Number(rows?.[0]?.cnt || 0) > 0
        }

        const [categoriesTableExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
          [dbName]
        ) as any
        const hasCategoriesTable = Number(categoriesTableExists?.[0]?.cnt || 0) > 0

        const [projectTypesTableExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types'`,
          [dbName]
        ) as any
        const hasProjectTypesTable = Number(projectTypesTableExists?.[0]?.cnt || 0) > 0

        const [categoryColorExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'color'`,
          [dbName]
        ) as any
        const hasCategoryColor = Number(categoryColorExists?.[0]?.cnt || 0) > 0

        const [projectTypeColorExists] = await pool.execute(
          `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'project_types' AND COLUMN_NAME = 'color'`,
          [dbName]
        ) as any
        const hasProjectTypeColor = Number(projectTypeColorExists?.[0]?.cnt || 0) > 0
        
        relatedPortfolioSchemaCache = { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor }
        console.log('📋 Related portfolio schema cached:', relatedPortfolioSchemaCache)
      } catch (schemaError) {
        console.error('⚠️ Schema check failed, using safe defaults:', schemaError)
        relatedPortfolioSchemaCache = {
          cols: { featured_image: true, status: false, project_type_id: true, category_id: true, category: false, technologies: false },
          hasCategoriesTable: true,
          hasProjectTypesTable: true,
          hasCategoryColor: false,
          hasProjectTypeColor: false
        }
      }
    }
    
    const { cols, hasCategoriesTable, hasProjectTypesTable, hasCategoryColor, hasProjectTypeColor } = relatedPortfolioSchemaCache

    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.description',
      'p.content',
      cols['featured_image'] ? 'p.featured_image AS image' : 'NULL as image',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt',
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS category" : 
        cols['category'] ? 'p.category' : "'General' AS category",
      cols['category_id'] && hasCategoriesTable && hasCategoryColor ? 'COALESCE(c.color, "#dc2626") AS categoryColor' : '"#dc2626" AS categoryColor',
      cols['project_type_id'] && hasProjectTypesTable ? 'COALESCE(pt.name, "Web Development") AS projectTypeName' : '"Web Development" AS projectTypeName',
      cols['project_type_id'] && hasProjectTypesTable && hasProjectTypeColor ? 'COALESCE(pt.color, "#6b7280") AS projectTypeColor' : '"#6b7280" AS projectTypeColor'
      // ⚠️ Technologies tidak di-SELECT (kolom tidak ada, fetch dari pivot table)
    ]

    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (cols['project_type_id'] && hasProjectTypesTable) {
      joinClauses.push('LEFT JOIN project_types pt ON p.project_type_id = pt.id')
    }

    // Build WHERE conditions
    const whereConditions = ['p.slug != ?']
    const queryParams: any[] = [currentSlug]
    
    if (cols['status']) {
      whereConditions.push('p.status = ?')
      queryParams.push('PUBLISHED')
    }

    // Filter by category
    if (cols['category_id'] && hasCategoriesTable) {
      whereConditions.push('c.name = ?')
      queryParams.push(currentCategory)
    } else {
      whereConditions.push('p.category = ?')
      queryParams.push(currentCategory)
    }

    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.PORTFOLIO} p
      ${joinClauses.join(' ')}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${cols['created_at'] ? 'p.created_at' : 'p.id'} DESC
      LIMIT ?
    `
    
    queryParams.push(limit)
    const [rows] = await pool.execute(query, queryParams) as any

    // Transform data
    const transformedItems = rows.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content || '',
      image: item.image,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      categoryColor: item.categoryColor,
      projectTypeName: item.projectTypeName,
      projectTypeColor: item.projectTypeColor,
      technologies: item.technologies ? JSON.parse(item.technologies) : []
    }))

    console.log(`✅ getRelatedPortfolioItems - Found ${transformedItems.length} related portfolio items for category: ${currentCategory}`)
    return transformedItems
    
  } catch (error: any) {
    console.error('❌ getRelatedPortfolioItems - Error:', error)
    return []
  }
}

// ✅ ISR + On-Demand Revalidation untuk related portfolio items
export const getRelatedPortfolioItems = unstableCache(
  async (currentSlug: string, currentCategory: string, limit: number = 3): Promise<any[]> => 
    getRelatedPortfolioItemsInternal(currentSlug, currentCategory, limit),
  ['portfolio:related'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['portfolio:posts', 'portfolio:related'] // Tags untuk on-demand revalidation
  }
)
