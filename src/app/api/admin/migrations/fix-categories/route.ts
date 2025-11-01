import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { verifyJWT } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Proteksi: butuh JWT valid
    try {
      await verifyJWT(req)
    } catch {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()
    const dbName = process.env.DB_NAME as string

    const columnsToDrop = ['description', 'is_active'] as const
    const dropped: string[] = []
    const skipped: string[] = []

    for (const col of columnsToDrop) {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories' AND COLUMN_NAME = ?`,
        [dbName, col]
      ) as any
      const exists = Number(rows?.[0]?.cnt || 0) > 0
      if (exists) {
        await pool.query(`ALTER TABLE categories DROP COLUMN ${col}`)
        dropped.push(col)
      } else {
        skipped.push(col)
      }
    }

    // Kembalikan struktur tabel setelah perubahan
    const [desc] = await pool.query(`SHOW COLUMNS FROM categories`) as any

    return NextResponse.json({ success: true, message: 'Migration executed', dropped, skipped, structure: desc })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Migration failed' }, { status: 500 })
  }
}
