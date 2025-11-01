'use server'

import { cookies } from 'next/headers'
import { getPool } from '@/lib/db'
import { verifyJwt } from '@/lib/auth'

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt_token')?.value
  if (!token) throw new Error('Unauthorized')
  const payload = verifyJwt<any>(token)
  if (!payload?.userId) throw new Error('Unauthorized')
}

export async function addCategoryAction(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') || '').trim()
  if (!name) throw new Error('Nama kategori harus diisi')

  const pool = getPool()
  const dbName = process.env.DB_NAME as string

  // Ensure table exists
  await pool.query(
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      color VARCHAR(7) DEFAULT '#3B82F6',
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_name (name),
      INDEX idx_slug (slug),
      INDEX idx_sort_order (sort_order)
    )`
  )

  // Normalized slug
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  // Duplicate check by name OR slug (idempotent)
  const [dup] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM categories WHERE name = ? OR slug = ?`,
    [name, slug]
  ) as any
  if (Number(dup?.[0]?.cnt || 0) > 0) {
    // Kategori sudah ada: treat as success (idempotent), jangan throw error
    return
  }

  await pool.query(`INSERT INTO categories (name, slug) VALUES (?, ?)`, [name, slug])
}

export type ActionResult = { success: boolean; message?: string }

export async function addCategoryActionSafe(prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  try {
    await addCategoryAction(formData)
    return { success: true, message: 'Kategori berhasil ditambahkan' }
  } catch (error: any) {
    return { success: false, message: error?.message || 'Gagal menambah kategori' }
  }
}
export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') || '').trim()
  if (!name) throw new Error('Nama kategori tidak valid')

  const pool = getPool()
  const dbName = process.env.DB_NAME as string

  // Ensure table categories exists
  const [tableExists] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'`,
    [dbName]
  ) as any
  const hasCategoriesTable = Number(tableExists?.[0]?.cnt || 0) > 0
  if (!hasCategoriesTable) throw new Error('Tabel categories tidak tersedia')

  // Get category id by name or slug fallback
  const slugFallback = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const [catRows] = await pool.query(
    `SELECT id FROM categories WHERE name = ? OR slug = ? LIMIT 1`,
    [name, slugFallback]
  ) as any
  const categoryId = catRows?.[0]?.id
  if (!categoryId) throw new Error('Kategori tidak ditemukan')

  // Check posts.category_id usage
  const [colExists] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'posts' AND COLUMN_NAME = 'category_id'`,
    [dbName]
  ) as any
  const hasCategoryIdColumn = Number(colExists?.[0]?.cnt || 0) > 0

  if (hasCategoryIdColumn) {
    const [posts] = await pool.query(`SELECT COUNT(*) AS cnt FROM posts WHERE category_id = ? AND status != 'DRAFT'`, [categoryId]) as any
    if (Number(posts?.[0]?.cnt || 0) > 0) throw new Error('Tidak bisa menghapus kategori yang masih digunakan oleh artikel')
    await pool.query(`DELETE FROM posts WHERE category_id = ? AND status = 'DRAFT'`, [categoryId])
  }

  const [result] = await pool.query(`DELETE FROM categories WHERE id = ?`, [categoryId]) as any
  if (result.affectedRows === 0) throw new Error('Gagal menghapus kategori')
}

export async function deleteCategoryActionSafe(prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  try {
    await deleteCategoryAction(formData)
    return { success: true, message: 'Kategori berhasil dihapus' }
  } catch (error: any) {
    return { success: false, message: error?.message || 'Gagal menghapus kategori' }
  }
}

// Blog create via Server Action + redirect
import { createPost } from '@/lib/actions/blog'
import { redirect } from 'next/navigation'

export async function createPostAndRedirect(prevState: ActionResult | undefined, formData: FormData): Promise<ActionResult | void> {
  'use server'
  const res = await createPost(formData)
  if (res?.success) {
    redirect('/admin-g30spki/blog')
  }
  return { success: false, message: res?.message || 'Gagal membuat artikel' }
}

export async function createPostAction(formData: FormData): Promise<void> {
  'use server'
  const res = await createPost(formData)
  if (res?.success) {
    redirect('/admin-g30spki/blog')
  }
  throw new Error(res?.message || 'Gagal membuat artikel')
}


