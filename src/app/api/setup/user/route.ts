import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()
    if (!email || !password || !username) {
      return NextResponse.json({ success: false, message: 'Email, password, dan username diperlukan' }, { status: 400 })
    }

    const pool = getPool()
    
    // Check if user already exists
    const [existingRows] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    ) as any
    
    if (existingRows.length > 0) {
      return NextResponse.json({ success: false, message: 'User dengan email ini sudah ada' }, { status: 400 })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [email, username, passwordHash, 'ADMIN', 1]
    ) as any

    const userId = result.insertId

    return NextResponse.json({
      success: true,
      message: 'User berhasil dibuat',
      user: {
        id: userId,
        email,
        username,
        role: 'ADMIN',
        isActive: true
      }
    })
  } catch (e: any) {
    console.error('Setup user error:', e)
    return NextResponse.json({ success: false, message: e.message || 'Setup user error' }, { status: 500 })
  }
}
