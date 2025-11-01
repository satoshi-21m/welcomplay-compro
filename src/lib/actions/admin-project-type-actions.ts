'use server'

import { getPool } from '@/lib/db'
import { revalidateTag } from 'next/cache'

// ============================================
// CREATE PROJECT TYPE
// ============================================

export async function createProjectType(data: {
  name: string
  slug?: string
  description?: string
  icon?: string
  color?: string
}) {
  try {
    const pool = getPool()
    
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const [result] = await pool.execute(
      `INSERT INTO project_types (name, slug, description, icon, color, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, 1, 999)`,
      [
        data.name,
        slug,
        data.description || '',
        data.icon || '🌐',
        data.color || '#3B82F6'
      ]
    ) as any

    // ⚡ Invalidate cache
    revalidateTag('project-types', "")
    revalidateTag('admin:project-types', "")

    return {
      success: true,
      message: 'Project type created successfully',
      data: { id: result.insertId, slug }
    }
  } catch (error: any) {
    console.error('❌ createProjectType - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to create project type'
    }
  }
}

// ============================================
// UPDATE PROJECT TYPE
// ============================================

export async function updateProjectType(id: number, data: {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  is_active?: boolean
  sort_order?: number
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

    if (data.description !== undefined) {
      updateParts.push('description = ?')
      values.push(data.description)
    }

    if (data.icon !== undefined) {
      updateParts.push('icon = ?')
      values.push(data.icon)
    }

    if (data.color !== undefined) {
      updateParts.push('color = ?')
      values.push(data.color)
    }

    if (data.is_active !== undefined) {
      updateParts.push('is_active = ?')
      values.push(data.is_active ? 1 : 0)
    }

    if (data.sort_order !== undefined) {
      updateParts.push('sort_order = ?')
      values.push(data.sort_order)
    }

    if (updateParts.length === 0) {
      return {
        success: false,
        message: 'No fields to update'
      }
    }

    values.push(id)

    await pool.execute(
      `UPDATE project_types SET ${updateParts.join(', ')} WHERE id = ?`,
      values
    )

    // ⚡ Invalidate cache
    revalidateTag('project-types', "")
    revalidateTag('admin:project-types', "")
    revalidateTag('portfolio:items', "")

    return {
      success: true,
      message: 'Project type updated successfully'
    }
  } catch (error: any) {
    console.error('❌ updateProjectType - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update project type'
    }
  }
}

// ============================================
// DELETE PROJECT TYPE
// ============================================

export async function deleteProjectType(id: number) {
  try {
    const pool = getPool()
    
    // Check if project type is in use
    const [portfolios] = await pool.execute(
      'SELECT COUNT(*) as count FROM portfolio WHERE project_type_id = ?',
      [id]
    ) as any

    if (portfolios[0].count > 0) {
      return {
        success: false,
        message: `Cannot delete project type. It is used by ${portfolios[0].count} portfolio item(s).`
      }
    }

    await pool.execute('DELETE FROM project_types WHERE id = ?', [id])

    // ⚡ Invalidate cache
    revalidateTag('project-types', "")
    revalidateTag('admin:project-types', "")

    return {
      success: true,
      message: 'Project type deleted successfully'
    }
  } catch (error: any) {
    console.error('❌ deleteProjectType - Error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete project type'
    }
  }
}

