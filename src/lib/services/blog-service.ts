'use server'

import { getBlogPostBySlugCore, getBlogPostsCore, getBlogCategoriesCore } from '@/lib/db/queries/blog-queries'
import { BlogPost } from '@/types/blog'

/**
 * Blog Service Layer
 * Provides different views of the same data for Landing Page and Admin Side
 */

/**
 * Transform raw database row to BlogPost type (for Landing Page)
 * Only includes public-facing data
 */
function transformToPublicBlogPost(raw: any): BlogPost {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt || '',
    content: raw.content || '',
    category: raw.category_name || 'General',
    author: {
      name: raw.author_name || 'Admin'
    },
    image: raw.featured_image ? {
      url: raw.featured_image,
      alt: raw.featured_image_alt || raw.title
    } : undefined,
    featured: Boolean(raw.is_featured),
    publishedAt: raw.published_at,
    updatedAt: raw.updated_at,
    tags: [],
    seo: {
      metaTitle: raw.meta_title || raw.title,
      metaDescription: raw.meta_description || raw.excerpt,
      keywords: raw.meta_keywords || raw.category_name
    }
  }
}

/**
 * Transform raw database row to Admin format
 * Includes all fields including internal/admin-only data
 */
function transformToAdminBlogPost(raw: any): any {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt || '',
    content: raw.content || '',
    status: raw.status || 'DRAFT',
    
    // Category - both formats
    category: raw.category_name || 'General',
    categoryId: raw.category_id,
    category_id: raw.category_id,
    
    // Image - both formats
    featuredImage: raw.featured_image || '',
    featured_image: raw.featured_image || '',
    imageUrl: raw.featured_image || '',
    featuredImageAlt: raw.featured_image_alt || '',
    featured_image_alt: raw.featured_image_alt || '',
    
    // Featured status
    isFeatured: Boolean(raw.is_featured),
    is_featured: Boolean(raw.is_featured),
    
    // SEO - both formats
    metaTitle: raw.meta_title || '',
    meta_title: raw.meta_title || '',
    metaDescription: raw.meta_description || '',
    meta_description: raw.meta_description || '',
    metaKeywords: raw.meta_keywords || '',
    meta_keywords: raw.meta_keywords || '',
    
    // Author - both formats
    author: raw.author_name || 'Admin',
    authorId: raw.author_id,
    author_id: raw.author_id,
    authorName: raw.author_name || 'Admin',
    
    // Timestamps
    publishedAt: raw.published_at,
    published_at: raw.published_at,
    createdAt: raw.created_at,
    created_at: raw.created_at,
    updatedAt: raw.updated_at,
    updated_at: raw.updated_at
  }
}

/**
 * ============================================
 * PUBLIC API - For Landing Page
 * ============================================
 */

/**
 * Get published blog post by slug (for Landing Page)
 * Returns null if post is not published
 */
export async function getPublicBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await getBlogPostBySlugCore(slug)
    
    if (!raw) {
      return null
    }
    
    // Only return if status is PUBLISHED
    if (raw.status && raw.status !== 'PUBLISHED') {
      return null
    }
    
    return transformToPublicBlogPost(raw)
  } catch (error) {
    console.error('❌ getPublicBlogPost - Error:', error)
    return null
  }
}

/**
 * Get published blog posts (for Landing Page)
 */
export async function getPublicBlogPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const rows = await getBlogPostsCore({
      limit,
      status: 'PUBLISHED'
    })
    
    return rows.map(transformToPublicBlogPost)
  } catch (error) {
    console.error('❌ getPublicBlogPosts - Error:', error)
    return []
  }
}

/**
 * Get recent published blog posts (for sidebar, excluding current)
 */
export async function getRecentPublicBlogPosts(currentSlug: string, limit: number = 5): Promise<BlogPost[]> {
  try {
    const rows = await getBlogPostsCore({
      limit,
      status: 'PUBLISHED',
      excludeSlug: currentSlug
    })
    
    return rows.map(transformToPublicBlogPost)
  } catch (error) {
    console.error('❌ getRecentPublicBlogPosts - Error:', error)
    return []
  }
}

/**
 * Get related blog posts by category
 */
export async function getRelatedPublicBlogPosts(currentSlug: string, category: string): Promise<BlogPost[]> {
  try {
    const rows = await getBlogPostsCore({
      status: 'PUBLISHED',
      excludeSlug: currentSlug,
      category
    })
    
    return rows.map(transformToPublicBlogPost)
  } catch (error) {
    console.error('❌ getRelatedPublicBlogPosts - Error:', error)
    return []
  }
}

/**
 * ============================================
 * ADMIN API - For Admin Panel
 * ============================================
 */

/**
 * Get blog post by slug (for Admin - includes all statuses)
 */
export async function getAdminBlogPost(slug: string): Promise<any | null> {
  try {
    const raw = await getBlogPostBySlugCore(slug)
    
    if (!raw) {
      return null
    }
    
    return transformToAdminBlogPost(raw)
  } catch (error) {
    console.error('❌ getAdminBlogPost - Error:', error)
    return null
  }
}

/**
 * Get all blog posts (for Admin - includes all statuses)
 */
export async function getAdminBlogPosts(options?: {
  limit?: number
  offset?: number
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | null
}): Promise<any[]> {
  try {
    const queryOptions = {
      limit: options?.limit,
      offset: options?.offset || 0,
      status: options?.status || null,
      excludeSlug: undefined,
      category: undefined
    }
    
    const rows = await getBlogPostsCore(queryOptions)
    return rows.map(transformToAdminBlogPost)
  } catch (error) {
    console.error('❌ getAdminBlogPosts - Error:', error)
    return []
  }
}

/**
 * ============================================
 * SHARED API - For Both Landing and Admin
 * ============================================
 */

/**
 * Get blog categories (shared by both)
 */
export async function getBlogCategories(): Promise<Array<{ id: number; name: string; post_count?: number }>> {
  try {
    return await getBlogCategoriesCore()
  } catch (error) {
    console.error('❌ getBlogCategories - Error:', error)
    return []
  }
}

