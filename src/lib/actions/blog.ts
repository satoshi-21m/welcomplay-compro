'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createPostSchema, updatePostSchema } from '@/lib/validations'
import { revalidateTag } from 'next/cache'
import { verifyJwt } from '@/lib/auth'
import { getPool } from '@/lib/db'
// Lightweight schema cache (process-level) to avoid probing per request
let blogAdminSchemaCache: null | {
  exists: Record<string, boolean>
} = null

async function getBlogAdminSchema() {
  if (blogAdminSchemaCache) return blogAdminSchemaCache
  const pool = getPool()
  const dbName = process.env.DB_NAME as string
  const colNames = ['category', 'featured_image_alt', 'is_featured', 'published_at', 'content', 'meta_title', 'meta_description', 'meta_keywords', 'author_id'] as const
  const exists: Record<string, boolean> = {}
  for (const name of colNames) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'posts' AND COLUMN_NAME = ?`,
      [dbName, name]
    ) as any
    exists[name] = Number(rows?.[0]?.cnt || 0) > 0
  }
  blogAdminSchemaCache = { exists }
  return blogAdminSchemaCache
}

export async function getPosts(limit?: number, offset?: number) {
  try {
    // Pastikan user sudah login (cookie dipakai untuk proteksi halaman, tapi fetch DB tidak perlu token)
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const { exists } = await getBlogAdminSchema()

    // Gunakan JOIN dengan tabel categories untuk mendapatkan nama kategori
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      'c.name as category', // Ambil nama kategori dari tabel categories
      'p.status',
      'p.featured_image AS featuredImage',
      exists['featured_image_alt'] ? 'p.featured_image_alt AS featuredImageAlt' : 'NULL as featuredImageAlt',
      exists['is_featured'] ? 'p.is_featured AS isFeatured' : 'NULL as isFeatured',
      exists['published_at'] ? 'p.published_at AS publishedAt' : 'NULL as publishedAt',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt'
    ]

    const orderBy = exists['published_at'] ? 'ORDER BY COALESCE(p.published_at, p.created_at) DESC' : 'ORDER BY p.created_at DESC'

    const pagination = (typeof limit === 'number' && typeof offset === 'number') ? ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}` : ''
    const [rows] = await pool.query(
      `SELECT ${selectParts.join(', ')} 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${orderBy}${pagination}`
    ) as any

    return { success: true, posts: rows }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch posts' }
  }
}

export async function getPost(slug: string) {
  try {
    const cookieStore = await cookies()
    if (!cookieStore.get('jwt_token')) {
      return { success: false, message: 'Unauthorized' }
    }

    const pool = getPool()
    const { exists } = await getBlogAdminSchema()

    // Gunakan JOIN dengan tabel categories untuk mendapatkan nama kategori
    const selectParts = [
      'p.id',
      'p.title',
      'p.slug',
      'p.excerpt',
      exists['content'] ? 'p.content' : 'NULL as content',
      'c.name as category', // Ambil nama kategori dari tabel categories
      'p.status',
      'p.featured_image AS featuredImage',
      exists['featured_image_alt'] ? 'p.featured_image_alt AS featuredImageAlt' : 'NULL as featuredImageAlt',
      exists['is_featured'] ? 'p.is_featured AS isFeatured' : 'NULL as isFeatured',
      exists['meta_title'] ? 'p.meta_title AS metaTitle' : 'NULL as metaTitle',
      exists['meta_description'] ? 'p.meta_description AS metaDescription' : 'NULL as metaDescription',
      exists['meta_keywords'] ? 'p.meta_keywords AS metaKeywords' : 'NULL as metaKeywords',
      'p.created_at AS createdAt',
      'p.updated_at AS updatedAt'
    ]

    const [rows] = await pool.query(
      `SELECT ${selectParts.join(', ')} 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.slug = ?`,
      [slug]
    ) as any

    if (!rows || rows.length === 0) {
      return { success: false, message: 'Post not found' }
    }

    const post = rows[0]
    console.log('Database post data:', post)
    
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Error in getPost action:', error)
    return { success: false, message: error.message || 'Failed to fetch post' }
  }
}

export async function createPost(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    // Parse form data (server-side)
    const rawData = {
      title: (formData.get('title') as string || '').trim(),
      content: (formData.get('content') as string || '').trim(),
      excerpt: (formData.get('excerpt') as string || '').trim(),
      slug: (formData.get('slug') as string || '').trim(),
      status: (formData.get('status') as string || 'DRAFT').toUpperCase(),
      featuredImage: (formData.get('featuredImage') as string || '').trim(),
      featuredImageAlt: (formData.get('featuredImageAlt') as string || '').trim(),
      metaTitle: (formData.get('metaTitle') as string || '').trim(),
      metaDescription: (formData.get('metaDescription') as string || '').trim(),
      metaKeywords: (formData.get('metaKeywords') as string || '').trim(),
      isFeatured: formData.get('isFeatured') === 'true',
      category: (formData.get('category') as string || '').trim(),
    }

    // Validate data
    const validatedFields = createPostSchema.safeParse(rawData)
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Insert langsung ke database (tanpa fetch eksternal)
    const pool = getPool()
    const { exists } = await getBlogAdminSchema()

    // Dapatkan category_id dari nama kategori jika tabel categories ada
    let categoryId: number | null = null
    if (validatedFields.data.category) {
      const [catRows] = await pool.query(
        `SELECT id FROM categories WHERE name = ? LIMIT 1`,
        [validatedFields.data.category]
      ) as any
      categoryId = catRows?.[0]?.id ?? null
    }

    const cols: string[] = ['title', 'slug', 'excerpt', 'status', 'created_at', 'updated_at']
    const vals: any[] = [
      validatedFields.data.title,
      validatedFields.data.slug,
      validatedFields.data.excerpt,
      validatedFields.data.status,
      new Date(),
      new Date(),
    ]

    if (exists['content']) { cols.push('content'); vals.push(validatedFields.data.content) }
    if (exists['featured_image_alt'] || validatedFields.data.featuredImage) {
      cols.push('featured_image'); vals.push(validatedFields.data.featuredImage)
    }
    if (exists['featured_image_alt']) { cols.push('featured_image_alt'); vals.push(validatedFields.data.featuredImageAlt) }
    if (exists['is_featured']) { cols.push('is_featured'); vals.push(validatedFields.data.isFeatured ? 1 : 0) }
    if (exists['meta_title']) { cols.push('meta_title'); vals.push(validatedFields.data.metaTitle) }
    if (exists['meta_description']) { cols.push('meta_description'); vals.push(validatedFields.data.metaDescription) }
    if (exists['meta_keywords']) { cols.push('meta_keywords'); vals.push(validatedFields.data.metaKeywords) }
    if (categoryId) { cols.push('category_id'); vals.push(categoryId) }
    // Hindari FK author_id null dengan mencoba ambil userId dari token jika schema mendukung
    try {
      const tokenPayload: any = verifyJwt(token!)
      const maybeUserId = tokenPayload?.userId ?? tokenPayload?.id ?? tokenPayload?.sub
      const { exists } = await getBlogAdminSchema()
      if (exists['author_id']) {
        if (maybeUserId) {
          cols.push('author_id'); vals.push(Number(maybeUserId))
        } else {
          // fallback author_id = 1 (admin) agar tidak melanggar FK
          cols.push('author_id'); vals.push(1)
        }
      }
    } catch {
      const { exists } = await getBlogAdminSchema()
      if (exists['author_id']) {
        cols.push('author_id'); vals.push(1)
      }
    }

    const placeholders = cols.map(() => '?').join(', ')
    const sql = `INSERT INTO posts (${cols.join(', ')}) VALUES (${placeholders})`
    await pool.execute(sql, vals)

    // ✅ On-Demand Revalidation: Invalidate caches saat create
    revalidateTag('blog:landing:list')
    revalidateTag('blog:posts')
    revalidateTag('blog:recent')
    revalidateTag('blog:categories')
    revalidateTag('blog:detail')
    revalidateTag('blog:related')
    return { success: true, message: 'Post created successfully' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create post' }
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    // Parse form data
    const rawData = {
      id,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      slug: formData.get('slug') as string,
      status: formData.get('status') as string,
      category: formData.get('category') as string, // ✅ Add missing category field
      featuredImage: formData.get('featuredImage') as string,
      featuredImageAlt: formData.get('featuredImageAlt') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      metaKeywords: formData.get('metaKeywords') as string,
      isFeatured: formData.get('isFeatured') === 'true',
    }

    // Validate data
    const validatedFields = updatePostSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: 'Validation failed', 
        errors: validatedFields.error.flatten().fieldErrors 
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
    const response = await fetch(`${apiUrl}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 401) {
        redirect('/admin-g30spki/login')
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // ✅ On-Demand Revalidation: Invalidate caches saat update
    revalidateTag('blog:landing:list')
    revalidateTag('blog:posts')
    revalidateTag('blog:recent')
    revalidateTag('blog:categories')
    revalidateTag('blog:detail')
    revalidateTag('blog:related')
    return { success: true, data: data.data, message: 'Post updated successfully' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update post' }
  }
}

export async function deletePost(id: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    // Hapus langsung di database (tanpa fetch eksternal)
    const pool = getPool()
    await pool.execute(`DELETE FROM posts WHERE id = ?`, [id])

    // ✅ On-Demand Revalidation: Invalidate caches saat delete
    revalidateTag('blog:landing:list')
    revalidateTag('blog:posts')
    revalidateTag('blog:recent')
    revalidateTag('blog:categories')
    revalidateTag('blog:detail')
    revalidateTag('blog:related')
    return { success: true, message: 'Post deleted successfully' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete post' }
  }
}

export async function getPostsStats() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt_token')?.value

    if (!token) {
      return { success: false, message: 'Unauthorized' }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
    const response = await fetch(`${apiUrl}/api/posts/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        redirect('/admin-g30spki/login')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data: data.data }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch posts stats' }
  }
}
