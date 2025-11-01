'use server'

import { getPool } from '@/lib/db'
import { TABLES } from '@/lib/db-constants'
import { revalidateTag } from 'next/cache'
import { getAdminBlogPost, getAdminBlogPosts } from '@/lib/services/blog-service'
import { revalidateBlog } from '@/lib/revalidate-webhook'

/**
 * Server Actions for Admin Blog Operations
 * Direct database access - No REST API needed
 */

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get blog post by slug (Admin view - includes all statuses)
 */
export async function getAdminBlogPostBySlug(slug: string) {
  try {
    const post = await getAdminBlogPost(slug)
    return {
      success: true,
      data: post
    }
  } catch (error: any) {
    console.error('❌ getAdminBlogPostBySlug - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch blog post'
    }
  }
}

/**
 * Get all blog posts (Admin view - includes all statuses)
 */
export async function getAdminAllBlogPosts(options?: {
  limit?: number
  offset?: number
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | null
}) {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🔧 Build time detected - skipping database call for admin blog posts')
      return { success: true, data: [] }
    }

    const posts = await getAdminBlogPosts(options)
    return {
      success: true,
      data: posts
    }
  } catch (error: any) {
    console.error('❌ getAdminAllBlogPosts - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch blog posts',
      data: []
    }
  }
}

// Alias for compatibility
export const getCachedAdminBlogPosts = getAdminAllBlogPosts

// ============================================
// CREATE OPERATION
// ============================================

/**
 * Create new blog post
 */
export async function createBlogPost(data: {
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featuredImage?: string
  featuredImageAlt?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  isFeatured?: boolean
}) {
  try {
    const pool = getPool()

    // Get category_id from category name
    let categoryId = null
    if (data.category && data.category !== 'NO_CATEGORY') {
      const [categoryRows] = await pool.execute(
        'SELECT id FROM categories WHERE name = ?',
        [data.category]
      ) as any
      
      if (categoryRows && categoryRows.length > 0) {
        categoryId = categoryRows[0].id
      }
    }

    // Insert blog post
    const [result] = await pool.execute(
      `INSERT INTO ${TABLES.POSTS} (
        title, content, excerpt, slug, category_id, status,
        featured_image, featured_image_alt,
        meta_title, meta_description, meta_keywords,
        is_featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.title,
        data.content,
        data.excerpt,
        data.slug,
        categoryId,
        data.status,
        data.featuredImage || null,
        data.featuredImageAlt || null,
        data.metaTitle || null,
        data.metaDescription || null,
        data.metaKeywords || null,
        data.isFeatured || false
      ]
    ) as any

    // Revalidate cache (local)
    revalidateTag('blog:posts')
    revalidateTag('blog:landing:list')
    revalidateTag('blog:recent')

    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidateBlog(data.slug).catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )

    return {
      success: true,
      message: 'Blog post created successfully',
      data: { id: result.insertId, slug: data.slug }
    }
  } catch (error: any) {
    console.error('❌ createBlogPost - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create blog post'
    }
  }
}

// ============================================
// UPDATE OPERATION
// ============================================

/**
 * Update blog post by slug
 */
export async function updateBlogPostBySlug(slug: string, data: {
  title?: string
  content?: string
  excerpt?: string
  newSlug?: string
  category?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featuredImage?: string
  featuredImageAlt?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  isFeatured?: boolean
}) {
  try {
    const pool = getPool()

    // Build UPDATE query
    const updateParts: string[] = []
    const values: any[] = []

    if (data.title !== undefined) {
      updateParts.push('title = ?')
      values.push(data.title)
    }

    if (data.newSlug !== undefined) {
      updateParts.push('slug = ?')
      values.push(data.newSlug)
    }

    if (data.excerpt !== undefined) {
      updateParts.push('excerpt = ?')
      values.push(data.excerpt)
    }

    if (data.status !== undefined) {
      updateParts.push('status = ?')
      values.push(data.status)
    }

    if (data.featuredImage !== undefined) {
      updateParts.push('featured_image = ?')
      values.push(data.featuredImage)
    }

    if (data.featuredImageAlt !== undefined) {
      updateParts.push('featured_image_alt = ?')
      values.push(data.featuredImageAlt)
    }

    if (data.isFeatured !== undefined) {
      updateParts.push('is_featured = ?')
      values.push(data.isFeatured)
    }

    if (data.content !== undefined) {
      updateParts.push('content = ?')
      values.push(data.content)
    }

    if (data.metaTitle !== undefined) {
      updateParts.push('meta_title = ?')
      values.push(data.metaTitle)
    }

    if (data.metaDescription !== undefined) {
      updateParts.push('meta_description = ?')
      values.push(data.metaDescription)
    }

    if (data.metaKeywords !== undefined) {
      updateParts.push('meta_keywords = ?')
      values.push(data.metaKeywords)
    }

    // Handle category
    if (data.category !== undefined) {
      if (data.category === 'NO_CATEGORY' || !data.category) {
        updateParts.push('category_id = NULL')
      } else {
        const [categoryRows] = await pool.execute(
          'SELECT id FROM categories WHERE name = ?',
          [data.category]
        ) as any

        if (categoryRows && categoryRows.length > 0) {
          updateParts.push('category_id = ?')
          values.push(categoryRows[0].id)
        } else {
          updateParts.push('category_id = NULL')
        }
      }
    }

    // Add updated_at
    updateParts.push('updated_at = NOW()')

    if (updateParts.length === 0) {
      return {
        success: false,
        message: 'No fields to update'
      }
    }

    values.push(slug)

    const query = `UPDATE ${TABLES.POSTS} SET ${updateParts.join(', ')} WHERE slug = ?`
    const [result] = await pool.execute(query, values) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Blog post not found'
      }
    }

    // Revalidate cache (local)
    revalidateTag('blog:posts')
    revalidateTag('blog:detail')
    revalidateTag('blog:landing:list')
    revalidateTag('blog:recent')

    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidateBlog(data.newSlug || slug).catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )

    return {
      success: true,
      message: 'Blog post updated successfully',
      data: { slug: data.newSlug || slug }
    }
  } catch (error: any) {
    console.error('❌ updateBlogPostBySlug - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update blog post'
    }
  }
}

// ============================================
// DELETE OPERATION
// ============================================

/**
 * Delete blog post by ID
 */
export async function deleteBlogPost(id: string) {
  try {
    const pool = getPool()

    const [result] = await pool.execute(
      `DELETE FROM ${TABLES.POSTS} WHERE id = ?`,
      [id]
    ) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Blog post not found'
      }
    }

    // Revalidate cache (local)
    revalidateTag('blog:posts')
    revalidateTag('blog:landing:list')
    revalidateTag('blog:recent')

    // Trigger webhook revalidation untuk Vercel production (global cache)
    await revalidateBlog().catch(err => 
      console.error('⚠️ Revalidation webhook failed:', err)
    )

    return {
      success: true,
      message: 'Blog post deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ deleteBlogPost - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete blog post'
    }
  }
}

// ============================================
// CATEGORY OPERATIONS
// ============================================

/**
 * Get all categories
 */
export async function getBlogCategoriesAdmin() {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🔧 Build time detected - skipping database call for blog categories')
      return { success: true, data: [] }
    }

    const pool = getPool()
    const dbName = process.env.DB_NAME as string

    // Check if categories table exists
    const [tableExists] = await pool.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
      [dbName]
    ) as any

    const hasCategoriesTable = Number(tableExists?.[0]?.cnt || 0) > 0

    if (!hasCategoriesTable) {
      return {
        success: true,
        data: []
      }
    }

    const [rows] = await pool.execute(
      `SELECT c.id, c.name, COUNT(p.id) AS post_count
       FROM categories c
       LEFT JOIN posts p ON c.id = p.category_id
       GROUP BY c.id, c.name
       ORDER BY c.name ASC`
    ) as any

    return {
      success: true,
      data: rows
    }
  } catch (error: any) {
    console.error('❌ getBlogCategoriesAdmin - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch categories',
      data: []
    }
  }
}

// Alias for compatibility
export const getCachedAdminBlogCategories = getBlogCategoriesAdmin

/**
 * Add new category
 */
export async function addBlogCategory(name: string) {
  try {
    const pool = getPool()

    const [result] = await pool.execute(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    ) as any

    return {
      success: true,
      message: 'Category added successfully',
      data: { id: result.insertId, name }
    }
  } catch (error: any) {
    console.error('❌ addBlogCategory - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to add category'
    }
  }
}

/**
 * Delete category by name
 */
export async function deleteBlogCategory(name: string) {
  try {
    const pool = getPool()

    // Get category ID
    const [categoryRows] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    ) as any

    if (!categoryRows || categoryRows.length === 0) {
      return {
        success: false,
        message: 'Category not found'
      }
    }

    const categoryId = categoryRows[0].id

    // Set category_id to NULL for posts using this category
    await pool.execute(
      'UPDATE posts SET category_id = NULL WHERE category_id = ?',
      [categoryId]
    )

    // Delete category
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [categoryId]
    ) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Category not found'
      }
    }

    // Revalidate cache
    revalidateTag('blog:categories')

    return {
      success: true,
      message: 'Category deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ deleteBlogCategory - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete category'
    }
  }
}
