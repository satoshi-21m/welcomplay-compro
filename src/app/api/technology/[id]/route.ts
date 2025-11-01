import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { tableExists } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { getTokenFromRequest, verifyJwt } from '@/lib/auth'

// tableExists now imported from db-utils

export async function PUT(req: Request, context: any) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const id = Number((context?.params || {}).id)
    if (!id) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })

    const hasTech = await tableExists(TABLES.TECHNOLOGIES)
    if (!hasTech) return NextResponse.json({ success: false, message: 'technologies table not available' }, { status: 405 })

    const body = await req.json()
    const name = String(body?.name || '').trim()
    const slug = String(body?.slug || '').trim() || (name ? name.toLowerCase().replace(/\s+/g, '-') : '')
    const color = String(body?.color || '#3B82F6')

    if (!name || !slug) return NextResponse.json({ success: false, message: 'name and slug are required' }, { status: 400 })

    const pool = getPool()
    await pool.execute(`UPDATE technologies SET name = ?, slug = ?, color = ? WHERE id = ?`, [name, slug, color, id])

    return NextResponse.json({ success: true, message: 'Technology updated' })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Failed to update technology' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const id = Number((context?.params || {}).id)
    if (!id) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })

    const pool = getPool()
    const hasTech = await tableExists(TABLES.TECHNOLOGIES)
    const hasPortfolio = await tableExists(TABLES.PORTFOLIO)
    if (!hasTech) return NextResponse.json({ success: false, message: 'technologies table not available' }, { status: 405 })

    // Constraint check: apakah teknologi ini dipakai di portfolio.technologies
    if (hasPortfolio) {
      // Cek JSON atau CSV
      const [rows] = await pool.query(`SELECT technologies FROM ${TABLES.PORTFOLIO} WHERE technologies IS NOT NULL`) as any
      let usedCount = 0
      for (const r of rows as any[]) {
        const t = r.technologies
        if (!t) continue
        if (typeof t === 'string') {
          try {
            const parsed = JSON.parse(t)
            if (Array.isArray(parsed) && parsed.includes(id)) usedCount++
          } catch {
            // CSV
            const arr = String(t).split(',').map((s: string) => Number(String(s).trim())).filter((n: number) => !Number.isNaN(n))
            if (arr.includes(id)) usedCount++
          }
        } else if (Array.isArray(t)) {
          if (t.includes(id)) usedCount++
        }
      }
      if (usedCount > 0) {
        return NextResponse.json({ success: false, message: `Cannot delete technology because it is used in ${usedCount} portfolio(s)` }, { status: 400 })
      }
    }

    await pool.execute(`DELETE FROM ${TABLES.TECHNOLOGIES} WHERE id = ?`, [id])
    return NextResponse.json({ success: true, message: 'Technology deleted' })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Failed to delete technology' }, { status: 500 })
  }
}
