import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { tableExists, columnExists, detectColumns } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Verify authentication for admin access
    const token = await verifyJWT(request as any)
    if (!token || !token.userId) {
      console.log('🚫 Admin Technology API - No valid token found')
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. Valid admin token required.' 
      }, { status: 401 })
    }

    console.log('✅ Admin Technology API - Authenticated user:', token.userId)
  } catch (authError) {
    console.log('🚫 Admin Technology API - Authentication failed:', authError)
    return NextResponse.json({ 
      success: false, 
      message: 'Access denied. Admin authentication required.' 
    }, { status: 401 })
  }

  const pool = getPool()
  
  try {
    const hasTech = await tableExists(TABLES.TECHNOLOGIES)
    if (!hasTech) return NextResponse.json({ success: true, data: [] })

    const cols = await detectColumns(TABLES.TECHNOLOGIES, ['id','name','slug','color','is_active','sort_order'])

    const selectParts = [
      cols.id ? 'id' : '0 AS id',
      cols.name ? 'name' : "'' AS name",
      cols.slug ? 'slug' : (cols.name ? "LOWER(REPLACE(name,' ','-')) AS slug" : "'' AS slug"),
      cols.color ? 'color' : "'' AS color",
      cols.is_active ? 'is_active' : '1 AS is_active',
      cols.sort_order ? 'sort_order' : '0 AS sort_order',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    ]

    const [rows] = await pool.execute(
      `SELECT ${selectParts.join(', ')} FROM ${TABLES.TECHNOLOGIES} WHERE is_active = 1 ORDER BY ${cols.sort_order ? 'sort_order ASC,' : ''} name ASC`
    ) as any

    return NextResponse.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('Error fetching technologies:', e)
    return NextResponse.json({ success: false, message: e.message || 'Failed to fetch technologies' }, { status: 500 })
  }
}