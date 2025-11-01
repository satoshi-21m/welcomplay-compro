'use server'

import { getPool } from '@/lib/db'
import { revalidateTag } from 'next/cache'

/**
 * Server Actions for Technology Operations
 */

/**
 * Get all technologies
 */
export async function getTechnologies() {
  try {
    const pool = getPool()
    
    const [rows] = await pool.execute(
      `SELECT id, name, slug, color, icon, is_active, sort_order
       FROM technologies
       WHERE is_active = 1
       ORDER BY sort_order ASC, name ASC`
    ) as any

    return {
      success: true,
      data: rows
    }
  } catch (error: any) {
    console.error('❌ getTechnologies - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch technologies',
      data: []
    }
  }
}

/**
 * Create technology
 */
export async function createTechnology(data: {
  name: string
  slug: string
  color: string
  icon?: string
}) {
  try {
    const pool = getPool()

    const [result] = await pool.execute(
      `INSERT INTO technologies (name, slug, color, icon, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [data.name, data.slug, data.color, data.icon || '']
    ) as any

    return {
      success: true,
      message: 'Technology created successfully',
      data: { id: result.insertId, ...data }
    }
  } catch (error: any) {
    console.error('❌ createTechnology - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create technology'
    }
  }
}

/**
 * Update technology
 */
export async function updateTechnology(id: number, data: {
  name?: string
  slug?: string
  color?: string
  icon?: string
}) {
  try {
    const pool = getPool()

    const updateParts: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updateParts.push('name = ?')
      values.push(data.name)
    }

    if (data.slug !== undefined) {
      updateParts.push('slug = ?')
      values.push(data.slug)
    }

    if (data.color !== undefined) {
      updateParts.push('color = ?')
      values.push(data.color)
    }

    if (data.icon !== undefined) {
      updateParts.push('icon = ?')
      values.push(data.icon)
    }

    updateParts.push('updated_at = NOW()')

    if (updateParts.length === 0) {
      return {
        success: false,
        message: 'No fields to update'
      }
    }

    values.push(id)

    const query = `UPDATE technologies SET ${updateParts.join(', ')} WHERE id = ?`
    const [result] = await pool.execute(query, values) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Technology not found'
      }
    }

    return {
      success: true,
      message: 'Technology updated successfully'
    }
  } catch (error: any) {
    console.error('❌ updateTechnology - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update technology'
    }
  }
}

/**
 * Delete technology
 */
export async function deleteTechnology(id: number) {
  try {
    const pool = getPool()

    const [result] = await pool.execute(
      `DELETE FROM technologies WHERE id = ?`,
      [id]
    ) as any

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Technology not found'
      }
    }

    return {
      success: true,
      message: 'Technology deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ deleteTechnology - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete technology'
    }
  }
}

