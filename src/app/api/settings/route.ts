import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { verifyJwt } from '@/lib/auth'
import { cookies } from 'next/headers'

// GET - Fetch all settings or specific category
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const pool = getPool()
    
    let query = 'SELECT setting_key, setting_value, setting_type, category FROM settings'
    const params: string[] = []
    
    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    }
    
    const [rows] = await pool.query(query, params) as any
    
    // Transform to key-value pairs
    const settings: Record<string, any> = {}
    rows.forEach((row: any) => {
      let value = row.setting_value
      
      // Parse value based on type
      if (row.setting_type === 'number') {
        value = value ? parseFloat(value) : null
      } else if (row.setting_type === 'boolean') {
        value = value === 'true' || value === '1'
      } else if (row.setting_type === 'json') {
        try {
          value = value ? JSON.parse(value) : null
        } catch (e) {
          value = null
        }
      }
      
      settings[row.setting_key] = value
    })
    
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('GET settings error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const payload = verifyJwt(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { settings } = body
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid settings data' },
        { status: 400 }
      )
    }
    
    const pool = getPool()
    
    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      let stringValue = ''
      
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          stringValue = JSON.stringify(value)
        } else {
          stringValue = String(value)
        }
      }
      
      await pool.query(
        `UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?`,
        [stringValue, key]
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })
  } catch (error: any) {
    console.error('PUT settings error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}

