'use server'

import { getPool } from '@/lib/db'
import { revalidateTag } from 'next/cache'

/**
 * Server Actions untuk Portfolio Categories CRUD
 * Direct DB access - lebih cepat dari API routes
 */

interface CategoryFormData {
  name: string
  slug: string
  description?: string
  icon?: string
  is_active?: boolean
  sort_order?: number
}

/**
 * Get all categories (non-cached untuk modal - always fresh)
 */
export async function getPortfolioCategoriesForModal() {
  try {
    const pool = getPool()
    
    const [rows] = await pool.execute(
      `SELECT 
        id, 
        name, 
        slug, 
        description, 
        icon, 
        is_active, 
        sort_order,
        created_at,
        updated_at
       FROM portfolio_categories
       ORDER BY sort_order ASC, name ASC`
    ) as any
    
    return {
      success: true,
      data: rows || []
    }
  } catch (error: any) {
    console.error('❌ getPortfolioCategoriesForModal error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch categories',
      data: []
    }
  }
}

/**
 * Create new category
 */
export async function createPortfolioCategory(data: CategoryFormData) {
  try {
    const { name, slug, description = '', icon = 'Folder', is_active = true, sort_order = 0 } = data
    
    if (!name || !slug) {
      return {
        success: false,
        message: 'Name dan slug harus diisi'
      }
    }
    
    const pool = getPool()
    
    // Check duplicate slug
    const [existing] = await pool.execute(
      'SELECT id FROM portfolio_categories WHERE slug = ?',
      [slug]
    ) as any
    
    if (existing.length > 0) {
      return {
        success: false,
        message: 'Slug sudah digunakan'
      }
    }
    
    // Insert new category
    const [result] = await pool.execute(
      `INSERT INTO portfolio_categories (name, slug, description, icon, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, slug, description, icon, is_active ? 1 : 0, sort_order]
    ) as any
    
    // Revalidate cache
    revalidateTag('portfolio:categories')
    revalidateTag('portfolio:landing:list')
    revalidateTag('admin:portfolio-categories')
    
    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: { id: result.insertId }
    }
  } catch (error: any) {
    console.error('❌ createPortfolioCategory error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create category'
    }
  }
}

/**
 * Update existing category
 */
export async function updatePortfolioCategory(id: number, data: CategoryFormData) {
  try {
    const { name, slug, description = '', icon = 'Folder', is_active = true, sort_order = 0 } = data
    
    if (!name || !slug) {
      return {
        success: false,
        message: 'Name dan slug harus diisi'
      }
    }
    
    const pool = getPool()
    
    // Check duplicate slug (except current)
    const [existing] = await pool.execute(
      'SELECT id FROM portfolio_categories WHERE slug = ? AND id != ?',
      [slug, id]
    ) as any
    
    if (existing.length > 0) {
      return {
        success: false,
        message: 'Slug sudah digunakan'
      }
    }
    
    // Update category
    await pool.execute(
      `UPDATE portfolio_categories 
       SET name = ?, slug = ?, description = ?, icon = ?, is_active = ?, sort_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, slug, description, icon, is_active ? 1 : 0, sort_order, id]
    )
    
    // Revalidate cache
    revalidateTag('portfolio:categories')
    revalidateTag('portfolio:landing:list')
    revalidateTag('admin:portfolio-categories')
    
    return {
      success: true,
      message: 'Kategori berhasil diupdate'
    }
  } catch (error: any) {
    console.error('❌ updatePortfolioCategory error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update category'
    }
  }
}

/**
 * Delete category
 */
export async function deletePortfolioCategory(id: number) {
  try {
    const pool = getPool()
    
    // Check if category is being used
    const [portfolios] = await pool.execute(
      'SELECT COUNT(*) as count FROM portfolio WHERE category_id = ?',
      [id]
    ) as any
    
    if (portfolios[0].count > 0) {
      return {
        success: false,
        message: `Kategori ini masih digunakan oleh ${portfolios[0].count} portfolio. Tidak dapat dihapus.`
      }
    }
    
    // Delete category
    await pool.execute('DELETE FROM portfolio_categories WHERE id = ?', [id])
    
    // Revalidate cache
    revalidateTag('portfolio:categories')
    revalidateTag('portfolio:landing:list')
    revalidateTag('admin:portfolio-categories')
    
    return {
      success: true,
      message: 'Kategori berhasil dihapus'
    }
  } catch (error: any) {
    console.error('❌ deletePortfolioCategory error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete category'
    }
  }
}

