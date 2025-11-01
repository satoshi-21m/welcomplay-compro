'use server'

import { getPortfolioItemBySlugCore, getPortfolioItemsCore } from '@/lib/db/queries/portfolio-queries'
import { getPool } from '@/lib/db'

/**
 * Portfolio Service Layer
 * Provides different views of the same data for Landing Page and Admin Side
 */

/**
 * Transform raw database row to Portfolio type (for Landing Page)
 * Only includes public-facing data
 */
function transformToPublicPortfolio(raw: any): any {
  // ✅ Use technology names if available, otherwise parse IDs
  let technologies = []
  
  if (raw.technology_names && Array.isArray(raw.technology_names)) {
    // Use resolved technology names
    technologies = raw.technology_names
  } else {
    // Fallback: Parse technology IDs
    try {
      technologies = typeof raw.technologies === 'string' 
        ? JSON.parse(raw.technologies) 
        : (Array.isArray(raw.technologies) ? raw.technologies : [])
    } catch (e) {
      technologies = []
    }
  }

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    image: raw.featured_image || '',
    category: raw.category_name || 'General',
    categoryColor: raw.category_color || '#dc2626',
    projectTypeName: raw.project_type_name || '',
    projectTypeColor: raw.project_type_color || '#6b7280',
    technologies,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at
  }
}

/**
 * Transform raw database row to Admin format
 * Includes all fields including internal/admin-only data
 */
function transformToAdminPortfolio(raw: any): any {
  // Parse technologies if it's a string
  let technologies = []
  try {
    technologies = typeof raw.technologies === 'string' 
      ? JSON.parse(raw.technologies) 
      : (Array.isArray(raw.technologies) ? raw.technologies : [])
  } catch (e) {
    technologies = []
  }

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    content: raw.content || '',
    
    // ✅ Both snake_case (for API) and camelCase (for UI compatibility)
    category_id: raw.category_id,
    categoryId: raw.category_id,
    project_type_id: raw.project_type_id,
    projectTypeId: raw.project_type_id,
    project_url: raw.project_url || '',
    projectUrl: raw.project_url || '',
    
    // ✅ Image fields - multiple formats for compatibility
    featured_image: raw.featured_image || '',
    featuredImage: raw.featured_image || '',
    imageUrl: raw.featured_image || '',
    featured_image_alt: raw.featured_image_alt || '',
    featuredImageAlt: raw.featured_image_alt || '',
    
    // ✅ Active status - both formats
    is_active: Boolean(raw.is_active),
    isActive: Boolean(raw.is_active),
    
    // SEO
    meta_title: raw.meta_title || '',
    metaTitle: raw.meta_title || '',
    meta_description: raw.meta_description || '',
    metaDescription: raw.meta_description || '',
    meta_keywords: raw.meta_keywords || '',
    metaKeywords: raw.meta_keywords || '',
    
    // Technologies
    technologies,
    technologyNames: [],
    technologySlugs: [],
    
    // Category info - both formats
    categoryName: raw.category_name || 'General',
    category_name: raw.category_name || 'General',
    categorySlug: raw.category_slug || '',
    category_slug: raw.category_slug || '',
    categoryColor: raw.category_color || '#dc2626',
    category_color: raw.category_color || '#dc2626',
    
    // Project Type info - both formats
    projectTypeName: raw.project_type_name || '',
    project_type_name: raw.project_type_name || '',
    projectTypeSlug: raw.project_type_slug || '',
    project_type_slug: raw.project_type_slug || '',
    projectTypeColor: raw.project_type_color || '#6b7280',
    project_type_color: raw.project_type_color || '#6b7280',
    
    // Timestamps
    createdAt: raw.created_at,
    updatedAt: raw.updated_at
  }
}

/**
 * ============================================
 * PUBLIC API - For Landing Page
 * ============================================
 */

/**
 * Get portfolio item by slug (for Landing Page)
 * ⚡ Fetches technology names from database
 */
export async function getPublicPortfolioItem(slug: string): Promise<any | null> {
  try {
    const raw = await getPortfolioItemBySlugCore(slug)
    
    if (!raw) {
      return null
    }
    
    // ⚡ Fetch technology names if technologies exist
    if (raw.technologies) {
      const pool = getPool()
      let techIds: number[] = []
      
      try {
        techIds = typeof raw.technologies === 'string' 
          ? JSON.parse(raw.technologies) 
          : (Array.isArray(raw.technologies) ? raw.technologies : [])
      } catch (e) {
        techIds = []
      }
      
      if (techIds.length > 0) {
        const placeholders = techIds.map(() => '?').join(',')
        const [techRows] = await pool.execute(
          `SELECT id, name FROM technologies WHERE id IN (${placeholders}) ORDER BY name ASC`,
          techIds
        ) as any
        
        // Create map of id -> name
        const techMap = new Map()
        for (const tech of techRows as any[]) {
          techMap.set(tech.id, tech.name)
        }
        
        // Replace IDs with names in order
        raw.technology_names = techIds.map((id: number) => techMap.get(id)).filter(Boolean)
      }
    }
    
    return transformToPublicPortfolio(raw)
  } catch (error) {
    console.error('❌ getPublicPortfolioItem - Error:', error)
    return null
  }
}

/**
 * Get portfolio items (for Landing Page)
 * ⚡ Fetches technology names for all items efficiently
 */
export async function getPublicPortfolioItems(limit?: number): Promise<any[]> {
  try {
    const rows = await getPortfolioItemsCore({ limit })
    
    // ⚡ Fetch all technology names in one query for better performance
    const pool = getPool()
    const allTechIds = new Set<number>()
    
    // Collect all unique technology IDs
    for (const row of rows) {
      if (row.technologies) {
        try {
          const techIds = typeof row.technologies === 'string' 
            ? JSON.parse(row.technologies) 
            : (Array.isArray(row.technologies) ? row.technologies : [])
          techIds.forEach((id: number) => allTechIds.add(id))
        } catch (e) {
          // Skip invalid technologies
        }
      }
    }
    
    // Fetch all technology names in one query
    const techMap = new Map<number, string>()
    if (allTechIds.size > 0) {
      const techIdsArray = Array.from(allTechIds)
      const placeholders = techIdsArray.map(() => '?').join(',')
      const [techRows] = await pool.execute(
        `SELECT id, name FROM technologies WHERE id IN (${placeholders})`,
        techIdsArray
      ) as any
      
      for (const tech of techRows as any[]) {
        techMap.set(tech.id, tech.name)
      }
    }
    
    // Assign technology names to each row
    for (const row of rows) {
      if (row.technologies) {
        try {
          const techIds = typeof row.technologies === 'string' 
            ? JSON.parse(row.technologies) 
            : (Array.isArray(row.technologies) ? row.technologies : [])
          row.technology_names = techIds.map((id: number) => techMap.get(id)).filter(Boolean)
        } catch (e) {
          row.technology_names = []
        }
      }
    }
    
    return rows.map(transformToPublicPortfolio)
  } catch (error) {
    console.error('❌ getPublicPortfolioItems - Error:', error)
    return []
  }
}

/**
 * Get related portfolio items by category
 * Note: Technology names not needed for related items (only show title & image)
 */
export async function getRelatedPublicPortfolioItems(
  currentSlug: string, 
  category: string, 
  limit: number = 3
): Promise<any[]> {
  try {
    const rows = await getPortfolioItemsCore({
      excludeSlug: currentSlug,
      category,
      limit
    })
    
    // No need to fetch technology names for related items (not displayed)
    return rows.map(transformToPublicPortfolio)
  } catch (error) {
    console.error('❌ getRelatedPublicPortfolioItems - Error:', error)
    return []
  }
}

/**
 * ============================================
 * ADMIN API - For Admin Panel
 * ============================================
 */

/**
 * Get portfolio item by slug (for Admin - includes all fields)
 */
export async function getAdminPortfolioItem(slug: string): Promise<any | null> {
  try {
    const raw = await getPortfolioItemBySlugCore(slug)
    
    if (!raw) {
      return null
    }
    
    const transformed = transformToAdminPortfolio(raw)
    
    // ⚡ Resolve technology IDs to names untuk admin panel
    if (transformed.technologies && transformed.technologies.length > 0) {
      const pool = getPool()
      const techIds = transformed.technologies
      const placeholders = techIds.map(() => '?').join(',')
      
      const [techRows] = await pool.execute(
        `SELECT id, name, slug, color FROM technologies WHERE id IN (${placeholders}) ORDER BY name ASC`,
        techIds
      ) as any
      
      // Create map of id -> tech details
      const techMap = new Map()
      for (const tech of techRows as any[]) {
        techMap.set(tech.id, {
          name: tech.name,
          slug: tech.slug,
          color: tech.color || '#6B7280'
        })
      }
      
      // Resolve IDs to names in order
      transformed.technologyNames = techIds
        .map((id: number) => techMap.get(id)?.name)
        .filter(Boolean)
      
      transformed.technologySlugs = techIds
        .map((id: number) => techMap.get(id)?.slug)
        .filter(Boolean)
      
      transformed.technologyObjects = techIds
        .map((id: number) => {
          const tech = techMap.get(id)
          return tech ? { id, ...tech } : null
        })
        .filter(Boolean)
    }
    
    return transformed
  } catch (error) {
    console.error('❌ getAdminPortfolioItem - Error:', error)
    return null
  }
}

/**
 * Get all portfolio items (for Admin - includes all fields)
 */
export async function getAdminPortfolioItems(options?: {
  limit?: number
  offset?: number
}): Promise<any[]> {
  try {
    const queryOptions = {
      limit: options?.limit,
      offset: options?.offset || 0,
      excludeSlug: undefined,
      category: undefined
    }
    
    const rows = await getPortfolioItemsCore(queryOptions)
    
    // ⚡ Resolve technology IDs to names untuk admin panel
    const pool = getPool()
    const allTechIds = new Set<number>()
    
    // Collect all unique technology IDs
    for (const row of rows) {
      if (row.technologies) {
        try {
          const techIds = typeof row.technologies === 'string' 
            ? JSON.parse(row.technologies) 
            : (Array.isArray(row.technologies) ? row.technologies : [])
          techIds.forEach((id: number) => allTechIds.add(id))
        } catch (e) {
          // Skip invalid technologies
        }
      }
    }
    
    // Fetch all technology details in one query
    const techMap = new Map<number, { name: string; slug: string; color: string }>()
    if (allTechIds.size > 0) {
      const techIdsArray = Array.from(allTechIds)
      const placeholders = techIdsArray.map(() => '?').join(',')
      const [techRows] = await pool.execute(
        `SELECT id, name, slug, color FROM technologies WHERE id IN (${placeholders}) ORDER BY name ASC`,
        techIdsArray
      ) as any
      
      for (const tech of techRows as any[]) {
        techMap.set(tech.id, {
          name: tech.name,
          slug: tech.slug,
          color: tech.color || '#6B7280'
        })
      }
    }
    
    // Transform rows and resolve technology names
    return rows.map(row => {
      const transformed = transformToAdminPortfolio(row)
      
      // Resolve technology IDs to names, slugs, and objects
      if (transformed.technologies && transformed.technologies.length > 0) {
        transformed.technologyNames = transformed.technologies
          .map((id: number) => techMap.get(id)?.name)
          .filter(Boolean)
        
        transformed.technologySlugs = transformed.technologies
          .map((id: number) => techMap.get(id)?.slug)
          .filter(Boolean)
        
        transformed.technologyObjects = transformed.technologies
          .map((id: number) => {
            const tech = techMap.get(id)
            return tech ? { id, ...tech } : null
          })
          .filter(Boolean)
      }
      
      return transformed
    })
  } catch (error) {
    console.error('❌ getAdminPortfolioItems - Error:', error)
    return []
  }
}

