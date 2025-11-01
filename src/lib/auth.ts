import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization')
  const bearer = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null
  const cookieHeader = req.headers.get('cookie') || ''
  const cookiePair = cookieHeader.split(';').find(c => c.trim().startsWith('jwt_token='))
  const tokenFromCookie = cookiePair ? decodeURIComponent(cookiePair.split('=')[1]) : null
  return tokenFromCookie || bearer || null
}

export function getTokenFromNextRequest(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  const bearer = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null
  const cookieHeader = req.headers.get('cookie') || ''
  const cookiePair = cookieHeader.split(';').find(c => c.trim().startsWith('jwt_token='))
  const tokenFromCookie = cookiePair ? decodeURIComponent(cookiePair.split('=')[1]) : null
  return tokenFromCookie || bearer || null
}

export function verifyJwt<T = any>(token: string): T {
  const secret = process.env.JWT_SECRET as string
  return jwt.verify(token, secret) as T
}

export async function verifyJWT(req: NextRequest): Promise<any> {
  const token = getTokenFromNextRequest(req)
  if (!token) {
    throw new Error('No token provided')
  }
  
  try {
    return verifyJwt(token)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
