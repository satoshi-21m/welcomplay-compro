import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { getTokenFromRequest, verifyJwt } from '@/lib/auth'

function toSlug(input: string): string {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const { id } = await context.params
    const projectTypeId = Number(id)
    if (!projectTypeId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })

    const body = await req.json()
    const name = String(body?.name || '').trim()
    const slug = String(body?.slug || toSlug(name)).trim()
    const icon = String(body?.icon || '🌐')
    const color = String(body?.color || '#3B82F6')

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'name and slug are required' }, { status: 400 })
    }

    const pool = getPool()
    // Conflict check (exclude current id)
    const [dup] = await pool.query(
      `SELECT id FROM project_types WHERE (name = ? OR slug = ?) AND id <> ? LIMIT 1`,
      [name, slug, projectTypeId]
    ) as any
    if ((dup as any[])?.length > 0) {
      return NextResponse.json({ success: false, message: 'Project type already exists' }, { status: 409 })
    }

    await pool.execute(
      `UPDATE project_types SET name = ?, slug = ?, icon = ?, color = ? WHERE id = ?`,
      [name, slug, icon, color, projectTypeId]
    )

    // Revalidate cache
    const { revalidateTag } = await import('next/cache')
    revalidateTag('portfolio:project-types')
    revalidateTag('portfolio:landing:list')

    return NextResponse.json({ success: true, message: 'Project type updated' })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to update project type' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const { id } = await context.params
    const projectTypeId = Number(id)
    if (!projectTypeId) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })

    const pool = getPool()
    // Cek penggunaan di portfolio
    // Prefer kolom project_type_id, fallback ke project_type string
    const [hasIdCol] = await pool.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'project_type_id'`,
      [process.env.DB_NAME as string]
    ) as any
    const hasProjectTypeId = Number(hasIdCol?.[0]?.cnt || 0) > 0

    if (hasProjectTypeId) {
      const [c] = await pool.query(`SELECT COUNT(*) AS cnt FROM portfolio WHERE project_type_id = ?`, [projectTypeId]) as any
      if (Number(c?.[0]?.cnt || 0) > 0) {
        return NextResponse.json({ success: false, message: 'Cannot delete: project type in use' }, { status: 400 })
      }
    } else {
      // Fallback: check by name
      const [row] = await pool.query(`SELECT name FROM project_types WHERE id = ?`, [projectTypeId]) as any
      const name = row?.[0]?.name
      if (name) {
        const [c] = await pool.query(`SELECT COUNT(*) AS cnt FROM portfolio WHERE project_type = ?`, [name]) as any
        if (Number(c?.[0]?.cnt || 0) > 0) {
          return NextResponse.json({ success: false, message: 'Cannot delete: project type in use' }, { status: 400 })
        }
      }
    }

    await pool.execute(`DELETE FROM project_types WHERE id = ?`, [projectTypeId])
    
    // Revalidate cache
    const { revalidateTag } = await import('next/cache')
    revalidateTag('portfolio:project-types')
    revalidateTag('portfolio:landing:list')
    
    return NextResponse.json({ success: true, message: 'Project type deleted' })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to delete project type' }, { status: 500 })
  }
}


