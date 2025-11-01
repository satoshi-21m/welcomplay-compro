import { NextResponse } from 'next/server'

export async function POST() {
  const isLocal = process.env.NODE_ENV !== 'production'
  const res = NextResponse.json({ success: true, message: 'Logout berhasil' })
  res.cookies.set('jwt_token', '', { httpOnly: true, secure: !isLocal, sameSite: isLocal ? 'lax' : 'none', path: '/', maxAge: 0 })
  res.cookies.set('refresh_token', '', { httpOnly: true, secure: !isLocal, sameSite: isLocal ? 'lax' : 'none', path: '/', maxAge: 0 })
  return res
}
