import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { detectColumns, tableExists, columnExists } from '@/lib/db-utils'
import { TABLES } from '@/lib/db-constants'
import { getTokenFromRequest, verifyJwt } from '@/lib/auth'
import { CacheInvalidator } from '@/lib/cache-invalidator'

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    verifyJwt(token)

    const contentType = req.headers.get('content-type') || ''
    let body: any = {}
    if (contentType.includes('application/json')) {
      body = await req.json()
    } else if (contentType.includes('form-data')) {
      const form = await req.formData()
      const obj: any = {}
      for (const [k, v] of form.entries()) {
        if (k === 'technologies') {
          try { obj[k] = JSON.parse(String(v)) } catch { obj[k] = String(v) }
        } else {
          obj[k] = typeof v === 'string' ? v : (v as File).name
        }
      }
      body = obj
    } else {
      // fallback
      try { body = await req.json() } catch { body = {} }
    }

    const title: string = body.title || ''
    const description: string | null = body.description ?? body.content ?? null
    const contentField: string | null = body.content ?? null
    const technologies = body.technologies ?? []
    const categoryName: string | null = body.category ?? null
    const categoryIdRaw = body.category_id ?? body.portfolio_category_id ?? body.categoryId ?? null
    const projectTypeIdRaw = body.project_type_id ?? body.projectTypeId ?? null
    const projectUrl: string | null = body.projectUrl ?? body.project_url ?? null
    const featuredImage: string | null = (body.featuredImage ?? body.featured_image ?? null)?.toString().replace(/^\/public\//, '/')
    const featuredImageAlt: string | null = body.featuredImageAlt ?? body.featured_image_alt ?? null
    const isFeatured: any = body.isFeatured ?? body.is_featured ?? body.isfeatured
    const isActive: any = body.isActive ?? body.is_active
    const sortOrder = body.sortOrder ?? body.sort_order ?? null
    const metaTitle: string | null = body.metaTitle ?? body.meta_title ?? null
    const metaDescription: string | null = body.metaDescription ?? body.meta_description ?? null
    const metaKeywords: string | null = body.metaKeywords ?? body.meta_keywords ?? null

    const pool = getPool()
    // Deteksi kolom sebelum insert
    async function has(name: string) {
      const dbName = process.env.DB_NAME as string
      const [r] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = ?`,
        [dbName, name]
      ) as any
      return Number(r?.[0]?.cnt || 0) > 0
    }
    const cols: string[] = ['title']
    const vals: any[] = [title]

    if (await has('description')) { cols.push('description'); vals.push(description) }
    if (await has('content')) { cols.push('content'); vals.push(contentField) }

    // Handle technologies
    if (await has('technologies')) {
      cols.push('technologies')
      vals.push(Array.isArray(technologies) ? technologies.join(',') : technologies)
    }

    // Handle category
    if (categoryName && await has('category')) {
      cols.push('category')
      vals.push(categoryName)
    } else if (categoryIdRaw && await has('category_id')) {
      cols.push('category_id')
      vals.push(Number(categoryIdRaw))
    }

    // Handle project type
    if (projectTypeIdRaw && await has('project_type_id')) {
      cols.push('project_type_id')
      vals.push(Number(projectTypeIdRaw))
    } else if (body.project_type && await has('project_type')) {
      cols.push('project_type')
      vals.push(body.project_type)
    }

    if (await has('project_url')) { cols.push('project_url'); vals.push(projectUrl) }
    if (await has('featured_image')) { cols.push('featured_image'); vals.push(featuredImage) }
    if (await has('featured_image_alt')) { cols.push('featured_image_alt'); vals.push(featuredImageAlt) }
    if (await has('is_featured')) { cols.push('is_featured'); vals.push(!!isFeatured) }
    if (await has('is_active')) { cols.push('is_active'); vals.push(isActive !== false) }
    if (await has('sort_order')) { cols.push('sort_order'); vals.push(sortOrder || 0) }
    if (await has('meta_title')) { cols.push('meta_title'); vals.push(metaTitle) }
    if (await has('meta_description')) { cols.push('meta_description'); vals.push(metaDescription) }
    if (await has('meta_keywords')) { cols.push('meta_keywords'); vals.push(metaKeywords) }

    // Generate slug from title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }

    let slug = generateSlug(title)
    
    // Check if slug already exists and make it unique
    let counter = 1
    let originalSlug = slug
    while (true) {
      const [existingSlug] = await pool.execute(
        'SELECT id FROM portfolio WHERE slug = ?',
        [slug]
      ) as any
      
      if (existingSlug.length === 0) {
        break
      }
      
      slug = `${originalSlug}-${counter}`
      counter++
    }

    if (await has('slug')) { cols.push('slug'); vals.push(slug) }

    const [result] = await pool.execute(
      `INSERT INTO portfolio (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      vals
    ) as any

    // Invalidate portfolio cache after creation
    CacheInvalidator.invalidatePortfolioCache()
    console.log('🗑️ Portfolio Create API - Portfolio cache invalidated')

    return NextResponse.json({ success: true, id: result.insertId, slug })
  } catch (e: any) {
    console.error('Error creating portfolio:', e)
    return NextResponse.json({ success: false, message: e.message || 'Error' }, { status: 500 })
  }
}
