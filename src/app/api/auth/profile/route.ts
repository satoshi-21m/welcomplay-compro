import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    const cookieHeader = req.headers.get('cookie') || ''
    
    const cookie = cookieHeader.split(';').find(c => c.trim().startsWith('jwt_token='))
    const tokenFromCookie = cookie ? decodeURIComponent(cookie.split('=')[1]) : null
    const bearer = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null
    const token = tokenFromCookie || bearer

    if (!token) {
      return NextResponse.json({ success: false, message: 'Access token required' }, { status: 401 })
    }

    const secret = process.env.JWT_SECRET as string
    
    if (!secret) {
      return NextResponse.json({ success: false, message: 'Server misconfigured: JWT_SECRET missing' }, { status: 500 })
    }
    
    const decoded = jwt.verify(token, secret) as any

    const pool = getPool()
    const [rows] = await pool.query(
      'SELECT id, email, username, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    ) as any
    const user = rows[0]

    if (!user) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.is_active === 1,
        createdAt: user.created_at,
        lastLogin: user.updated_at
      }
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 })
  }
}
