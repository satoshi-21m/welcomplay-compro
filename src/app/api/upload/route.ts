import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { getTokenFromRequest, verifyJwt } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function makeUploadPath(filename: string) {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const ext = path.extname(filename).toLowerCase()
  const base = path.basename(filename, ext)
  const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 40) || 'file'
  const rand = crypto.randomBytes(6).toString('hex')
  const finalName = `${safeBase}-${Date.now()}-${rand}${ext}`
  const relDir = path.join('uploads', year, month, day)
  const relPath = path.join(relDir, finalName).replace(/\\/g, '/')
  const publicRoot = path.join(process.cwd(), 'public')
  const absDir = path.join(publicRoot, relDir)
  const absPath = path.join(publicRoot, relPath)
  return { relPath, absDir, absPath }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const form = await req.formData()
    const file = form.get('file') as unknown as File
    if (!file) return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'File must be an image' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File too large (max 10MB)' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const { relPath, absDir, absPath } = makeUploadPath(file.name)

    await mkdir(absDir, { recursive: true })
    await writeFile(absPath, buffer)

    // Return relative path served by Next public folder
    return NextResponse.json({ success: true, path: `/${relPath}`, filename: path.basename(absPath) })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const body = await req.json().catch(() => ({}))
    let imagePath: string = body?.imagePath || body?.path || ''
    if (!imagePath) return NextResponse.json({ success: false, message: 'imagePath is required' }, { status: 400 })

    // Only allow deletion within /public/uploads
    // Accept paths starting with '/uploads' or 'uploads'
    if (imagePath.startsWith('public/')) imagePath = imagePath.slice('public/'.length)
    if (imagePath.startsWith('/')) imagePath = imagePath.slice(1)
    if (!imagePath.startsWith('uploads/')) {
      return NextResponse.json({ success: false, message: 'Invalid image path' }, { status: 400 })
    }

    const absPath = path.join(process.cwd(), 'public', imagePath)
    await unlink(absPath)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    // If file not found, consider it already deleted
    if (e?.code === 'ENOENT') return NextResponse.json({ success: true })
    return NextResponse.json({ success: false, message: e?.message || 'Delete failed' }, { status: 500 })
  }
}


