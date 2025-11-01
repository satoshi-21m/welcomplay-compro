import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email dan password diperlukan' }, { status: 400 })
    }

    const pool = getPool()
    const [rows] = await pool.query(
      'SELECT id, email, username, role, is_active, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    ) as any
    const user = rows[0]

    if (!user || user.is_active === 0) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    const normalizeBcrypt = (hash: string) => {
      if (!hash) return hash
      if (hash.startsWith('$2y$')) return '$2a$' + hash.slice(4)
      return hash
    }

    const hashedCandidate = normalizeBcrypt(user.password_hash)
    const ok = hashedCandidate ? await bcrypt.compare(password, hashedCandidate) : false
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    const payload = { userId: user.id, email: user.email, role: user.role }
    const secret = process.env.JWT_SECRET as string
    if (!secret) {
      return NextResponse.json({ success: false, message: 'Server misconfigured: JWT_SECRET missing' }, { status: 500 })
    }
    const access = jwt.sign(payload, secret, { expiresIn: '1d' })
    const refresh = jwt.sign(payload, secret, { expiresIn: '7d' })

    const res = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.is_active === 1
      }
    })

    const isLocal = process.env.NODE_ENV !== 'production'
    res.cookies.set('jwt_token', access, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24
    })
    res.cookies.set('refresh_token', refresh, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return res
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Login error' }, { status: 500 })
  }
}
