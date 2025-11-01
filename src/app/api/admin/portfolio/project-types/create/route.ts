import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description = '', icon = '', color = '#10b981', is_active = true, sort_order = 0 } = body
    
    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        message: 'Name dan slug harus diisi'
      }, { status: 400 })
    }
    
    const pool = getPool()
    
    // Check duplicate slug
    const [existing] = await pool.execute(
      'SELECT id FROM project_types WHERE slug = ?',
      [slug]
    ) as any
    
    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Slug sudah digunakan'
      }, { status: 400 })
    }
    
    // Insert new project type
    const [result] = await pool.execute(
      `INSERT INTO project_types (name, slug, description, icon, color, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, slug, description, icon, color, is_active ? 1 : 0, sort_order]
    ) as any
    
    // Revalidate cache
    revalidateTag('portfolio:project-types', "")
    revalidateTag('portfolio:landing:list', "")
    
    return NextResponse.json({
      success: true,
      message: 'Project type berhasil ditambahkan',
      data: { id: result.insertId }
    })
  } catch (error: any) {
    console.error('❌ Create project type error:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create project type'
    }, { status: 500 })
  }
}

