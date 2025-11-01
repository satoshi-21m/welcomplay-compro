'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { BlogPost } from '@/types/blog'
import { cache, CACHE_KEYS, CACHE_TTL, generateCacheKey } from '@/lib/cache'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPublicBlogPost, getPublicBlogPosts, getRecentPublicBlogPosts, getRelatedPublicBlogPosts, getBlogCategories as getBlogCategoriesService } from '@/lib/services/blog-service'

// --- Lightweight schema cache (lazy, process-level) ---
let blogSchemaCached: null | {
  cols: Record<string, boolean>
  hasCategoriesTable: boolean
  hasUsersTable: boolean
  hasUserNameCol: boolean
} = null

async function getBlogSchemaInfo() {
  if (blogSchemaCached) return blogSchemaCached
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const colNames = ['featured_image', 'status', 'is_featured', 'published_at', 'created_at', 'updated_at', 'content', 'category_id', 'category'] as const
  const cols: Record<string, boolean> = {}
  for (const name of colNames) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'posts' AND COLUMN_NAME = ?`,
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
  const [usersTableExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
    [dbName]
  ) as any
  const hasUsersTable = Number(usersTableExists?.[0]?.cnt || 0) > 0
  const [userNameColExists] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'`,
    [dbName]
  ) as any
  const hasUserNameCol = Number(userNameColExists?.[0]?.cnt || 0) > 0
  blogSchemaCached = { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol }
  return blogSchemaCached
}

// Function untuk pagination dengan offset
export async function getAllBlogPostsWithPagination(offset: number = 0): Promise<{ posts: BlogPost[], total: number }> {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(CACHE_KEYS.POSTS, { offset })
    const cached = cache.get<{ posts: BlogPost[], total: number }>(cacheKey)
    
    if (cached) {
      console.log(`✅ getAllBlogPostsWithPagination - Cache hit for offset: ${offset}`)
      return cached
    }

    console.log(`🔄 getAllBlogPostsWithPagination - Cache miss, fetching from database for offset: ${offset}`)
    const pool = getPool()
    
    // ⚡ OPTIMIZED: Use cached schema info instead of querying every time
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol } = schema

    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      cols['featured_image'] ? 'p.featured_image AS featuredImage' : 'NULL as featuredImage',
      cols['featured_image'] ? 'COALESCE(p.featured_image_alt, p.title) AS featuredImageAlt' : 'NULL as featuredImageAlt',
      cols['is_featured'] ? 'p.is_featured AS isFeatured' : 'FALSE as isFeatured',
      cols['published_at'] ? 'p.published_at AS publishedAt' : 'p.created_at AS publishedAt',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt',
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS category" : 
        cols['category'] ? 'p.category' : "'General' AS category",
      hasUsersTable && hasUserNameCol ? 'COALESCE(a.name, "Admin") AS authorName' : '"Admin" AS authorName'
    ]

    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (hasUsersTable) {
      joinClauses.push('LEFT JOIN users a ON p.author_id = a.id')
    }

    const whereClause = cols['status'] ? 'WHERE p.status = ?' : ''
    const queryParams = cols['status'] ? ['PUBLISHED'] : []

    // Query untuk mendapatkan total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      ${whereClause}
    `
    
    const [countRows] = await pool.execute(countQuery, queryParams) as any
    const total = countRows[0].total

    // Query untuk mendapatkan posts dengan pagination
    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      ${whereClause}
      ORDER BY ${cols['published_at'] ? 'COALESCE(p.published_at, p.created_at)' : 'p.created_at'} DESC
      OFFSET ?
    `
    
    queryParams.push(offset.toString())

    const [rows] = await pool.execute(query, queryParams) as any

    // Transform data to match BlogPost type
    const transformedPosts: BlogPost[] = rows.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '',
      category: post.category || 'General',
      author: {
        name: post.authorName || 'Admin'
      },
      image: post.featuredImage ? {
        url: post.featuredImage,
        alt: post.featuredImageAlt || post.title
      } : undefined,
      featured: post.isFeatured || false,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      tags: [],
      seo: {
        metaTitle: post.title,
        metaDescription: post.excerpt,
        keywords: post.category
      }
    }))

    const result = { posts: transformedPosts, total }
    console.log(`✅ getAllBlogPostsWithPagination - Found ${transformedPosts.length} posts, total: ${total}`)
    
    // Cache the result
    cache.set(cacheKey, result, CACHE_TTL.POSTS)
    console.log(`💾 getAllBlogPostsWithPagination - Cached result for offset: ${offset}`)
    
    return result
    
  } catch (error: any) {
    console.error('❌ getAllBlogPostsWithPagination - Error:', error)
    return { posts: [], total: 0 }
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.POSTS
    const cached = cache.get<BlogPost[]>(cacheKey)
    
    if (cached) {
      console.log(`✅ getAllBlogPosts - Cache hit`)
      return cached
    }

    console.log(`🔄 getAllBlogPosts - Cache miss, fetching from database`)
    const pool = getPool()
    
    // ⚡ OPTIMIZED: Use cached schema info instead of querying every time
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol } = schema

    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      cols['featured_image'] ? 'p.featured_image AS featuredImage' : 'NULL as featuredImage',
      cols['featured_image'] ? 'COALESCE(p.featured_image_alt, p.title) AS featuredImageAlt' : 'NULL as featuredImageAlt',
      cols['is_featured'] ? 'p.is_featured AS isFeatured' : 'FALSE as isFeatured',
      cols['published_at'] ? 'p.published_at AS publishedAt' : 'p.created_at AS publishedAt',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt',
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS category" : 
        cols['category'] ? 'p.category' : "'General' AS category",
      hasUsersTable && hasUserNameCol ? 'COALESCE(a.name, "Admin") AS authorName' : '"Admin" AS authorName'
    ]

    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (hasUsersTable) {
      joinClauses.push('LEFT JOIN users a ON p.author_id = a.id')
    }

    const whereClause = cols['status'] ? 'WHERE p.status = ?' : ''
    const queryParams = cols['status'] ? ['PUBLISHED'] : []

    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      ${whereClause}
      ORDER BY ${cols['published_at'] ? 'COALESCE(p.published_at, p.created_at)' : 'p.created_at'} DESC
    `
    
    const [rows] = await pool.execute(query, queryParams) as any

    // Transform data to match BlogPost type
    const transformedPosts: BlogPost[] = rows.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '',
      category: post.category || 'General',
      author: {
        name: post.authorName || 'Admin'
      },
      image: post.featuredImage ? {
        url: post.featuredImage,
        alt: post.featuredImageAlt || post.title
      } : undefined,
      featured: post.isFeatured || false,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      tags: [],
      seo: {
        metaTitle: post.title,
        metaDescription: post.excerpt,
        keywords: post.category
      }
    }))

    console.log(`✅ getAllBlogPosts - Found ${transformedPosts.length} posts`)
    
    // Cache the result
    cache.set(cacheKey, transformedPosts, CACHE_TTL.POSTS)
    console.log(`💾 getAllBlogPosts - Cached result`)
    
    return transformedPosts
    
  } catch (error: any) {
    console.error('❌ getAllBlogPosts - Error:', error)
    return []
  }
}

// ⚡ Cache schema info once (process-level, same as getBlogSchemaInfo)
let landingBlogSchemaCached: { hasPublishedAt: boolean; hasIsFeatured: boolean; hasUserName: boolean } | null = null

// Helper function untuk retry database operations
async function executeWithRetry(pool: any, query: string, params: any[], maxRetries: number = 2): Promise<any> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await pool.execute(query, params)
      return result
    } catch (error: any) {
      lastError = error
      
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
        if (attempt < maxRetries) {
          console.log(`⚠️ Connection error (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`)
          // Wait sebelum retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100))
          continue
        }
      }
      
      // Jika bukan connection error atau sudah max retries, throw error
      throw error
    }
  }
  
  throw lastError
}

// Cached variants for landing pages with tag-based revalidation
// ✅ REFACTORED: Use shared service layer
async function getLandingBlogPostsLimited(limit: number = 24): Promise<BlogPost[]> {
  try {
    return await getPublicBlogPosts(limit)
  } catch (error: any) {
    console.error('❌ getLandingBlogPostsLimited - Error:', error.message)
    return []
  }
}

// Runtime version without build-time skip
async function getLandingBlogPostsRuntime(limit: number = 24): Promise<BlogPost[]> {
  try {
    return await getPublicBlogPosts(limit)
  } catch (error: any) {
    console.error('❌ getLandingBlogPostsRuntime - Error:', error.message)
    return []
  }
}

// ⚡ OPTIMIZED: Landing page hanya butuh 3 posts, bukan 24!
// ✅ ISR + On-Demand Revalidation: Cache di edge/CDN, update saat admin ubah konten
export async function getLandingBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  // Use direct service call during build time to avoid caching empty results
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time detected - using direct blog posts call')
    try {
      return await getLandingBlogPostsRuntime(limit)
    } catch (error) {
      console.log('🔧 Build time blog posts fetch failed, returning empty array')
      return []
    }
  }
  
  // Use cached version for runtime
  return await getCachedLandingBlogPosts(limit)
}

// Cached version for runtime
const getCachedLandingBlogPosts = unstableCache(
  async (limit: number = 3): Promise<BlogPost[]> => {
    return getLandingBlogPostsRuntime(limit)
  },
  ['blog:landing:posts'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:landing:list', 'blog:posts'] // Tags untuk on-demand revalidation
  }
)

// Untuk blog page - fetch all published posts dengan caching
// Client-side pagination akan handle display (9 posts per page)
export async function getAllBlogPostsForPage(limit: number = 200): Promise<BlogPost[]> {
  // Use direct service call during build time to avoid caching empty results
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time detected - using direct all blog posts call')
    try {
      return await getLandingBlogPostsRuntime(limit)
    } catch (error) {
      console.log('🔧 Build time all blog posts fetch failed, returning empty array')
      return []
    }
  }
  
  // Use cached version for runtime
  return await getCachedAllBlogPostsForPage(limit)
}

// Cached version for runtime
const getCachedAllBlogPostsForPage = unstableCache(
  async (limit: number = 200): Promise<BlogPost[]> => {
    return getLandingBlogPostsRuntime(limit)
  },
  ['blog:landing:list'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:landing:list', 'blog:posts'] // Tags untuk on-demand revalidation
  }
)

// ✅ REFACTORED: Use shared service layer
async function getLandingRecentLimited(currentSlug: string, limit: number = 12): Promise<BlogPost[]> {
  try {
    return await getRecentPublicBlogPosts(currentSlug, limit)
  } catch (error: any) {
    console.error('❌ getLandingRecentLimited - Error:', error.message)
    return []
  }
}

// ⚡ OPTIMIZED: Detail page hanya butuh 5 posts untuk sidebar
// ✅ ISR + On-Demand Revalidation untuk recent posts
export const getLandingRecentBlogPosts = unstableCache(
  async (currentSlug: string, limit: number = 5): Promise<BlogPost[]> => getLandingRecentLimited(currentSlug, limit),
  ['blog:recent:sidebar'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:recent', 'blog:posts'] // Tags untuk on-demand revalidation
  }
)

// ✅ ISR + On-Demand Revalidation untuk categories
export async function getLandingBlogCategories() {
  // Use direct service call during build time to avoid caching empty results
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time detected - using direct blog categories call')
    try {
      return await getBlogCategoriesService()
    } catch (error) {
      console.log('🔧 Build time category fetch failed, returning empty array')
      return []
    }
  }
  
  // Use cached version for runtime
  return await getCachedBlogCategories()
}

// Cached version for runtime
const getCachedBlogCategories = unstableCache(
  async () => {
    return await getBlogCategoriesService()
  },
  ['blog:categories'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:categories'] // Tags untuk on-demand revalidation
  }
)

// ✅ REFACTORED: Use shared service layer
// Internal function tanpa cache - now uses shared service
async function getBlogPostBySlugInternal(slug: string): Promise<BlogPost | null> {
  try {
    return await getPublicBlogPost(slug)
  } catch (error: any) {
    console.error('❌ getBlogPostBySlug - Error:', error)
    return null
  }
}

// ⚡ OPTIMIZED: Cached wrapper untuk detail page
// ✅ ISR + On-Demand Revalidation untuk detail page
export const getBlogPostBySlug = unstableCache(
  async (slug: string): Promise<BlogPost | null> => getBlogPostBySlugInternal(slug),
  ['blog:detail'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:posts', 'blog:detail'] // Tags untuk on-demand revalidation
  }
)

// ✅ REFACTORED: Use shared service layer
export async function getBlogCategories(): Promise<Array<{ id: number; name: string; post_count?: number }>> {
  return await getBlogCategoriesService()
}

// ✅ REFACTORED: Use shared service layer
async function getRelatedBlogPostsInternal(currentSlug: string, category: string): Promise<BlogPost[]> {
  try {
    return await getRelatedPublicBlogPosts(currentSlug, category)
  } catch (error: any) {
    console.error('❌ getRelatedBlogPosts - Error:', error)
    return []
  }
}

// ✅ ISR + On-Demand Revalidation untuk related posts
export const getRelatedBlogPosts = unstableCache(
  async (currentSlug: string, category: string): Promise<BlogPost[]> => getRelatedBlogPostsInternal(currentSlug, category),
  ['blog:related'],
  { 
    revalidate: 3600, // 1 hour - lebih lama karena ada on-demand revalidation
    tags: ['blog:posts', 'blog:related'] // Tags untuk on-demand revalidation
  }
)

export async function getRecentBlogPosts(currentSlug: string): Promise<BlogPost[]> {
  try {
    const pool = getPool()
    
    // ⚡ OPTIMIZED: Use cached schema info instead of querying every time
    const schema = await getBlogSchemaInfo()
    const { cols, hasCategoriesTable, hasUsersTable, hasUserNameCol } = schema

    // Build dynamic SELECT query
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      cols['featured_image'] ? 'p.featured_image AS featuredImage' : 'NULL as featuredImage',
      cols['featured_image'] ? 'COALESCE(p.featured_image_alt, p.title) AS featuredImageAlt' : 'NULL as featuredImageAlt',
      cols['is_featured'] ? 'p.is_featured AS isFeatured' : 'FALSE as isFeatured',
      cols['published_at'] ? 'p.published_at AS publishedAt' : 'p.created_at AS publishedAt',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt',
      cols['category_id'] && hasCategoriesTable ? "COALESCE(c.name, 'General') AS category" : 
        cols['category'] ? 'p.category' : "'General' AS category",
      hasUsersTable && hasUserNameCol ? 'COALESCE(a.name, "Admin") AS authorName' : '"Admin" AS authorName'
    ]

    // Build JOIN clauses
    const joinClauses = []
    if (cols['category_id'] && hasCategoriesTable) {
      joinClauses.push('LEFT JOIN categories c ON p.category_id = c.id')
    }
    if (hasUsersTable) {
      joinClauses.push('LEFT JOIN users a ON p.author_id = a.id')
    }

    // Build WHERE conditions
    const whereConditions = ['p.slug != ?']
    const queryParams: any[] = [currentSlug]
    
    if (cols['status']) {
      whereConditions.push('p.status = ?')
      queryParams.push('PUBLISHED')
    }

    const query = `
      SELECT ${selectParts.join(', ')}
      FROM ${TABLES.POSTS} p
      ${joinClauses.join(' ')}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${cols['published_at'] ? 'COALESCE(p.published_at, p.created_at)' : 'p.created_at'} DESC
    `
    
    const [rows] = await pool.execute(query, queryParams) as any

    // Transform data to match BlogPost type
    const transformedPosts: BlogPost[] = rows.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '',
      category: post.category || 'General',
      author: {
        name: post.authorName || 'Admin'
      },
      image: post.featuredImage ? {
        url: post.featuredImage,
        alt: post.featuredImageAlt || post.title
      } : undefined,
      featured: post.isFeatured || false,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      tags: [],
      seo: {
        metaTitle: post.title,
        metaDescription: post.excerpt,
        keywords: post.category
      }
    }))

    console.log(`✅ getRecentBlogPosts - Found ${transformedPosts.length} recent posts`)
    return transformedPosts
    
  } catch (error: any) {
    console.error('❌ getRecentBlogPosts - Error:', error)
    return []
  }
}
