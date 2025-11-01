import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { revalidateTag } from 'next/cache'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { name, slug, description = '', icon = 'Folder', is_active = true, sort_order = 0 } = body
    
    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        message: 'Name dan slug harus diisi'
      }, { status: 400 })
    }
    
    const pool = getPool()
    
    // Check duplicate slug (except current category)
    const [existing] = await pool.execute(
      'SELECT id FROM portfolio_categories WHERE slug = ? AND id != ?',
      [slug, id]
    ) as any
    
    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Slug sudah digunakan'
      }, { status: 400 })
    }
    
    // Update category
    await pool.execute(
      `UPDATE portfolio_categories 
       SET name = ?, slug = ?, description = ?, icon = ?, is_active = ?, sort_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, slug, description, icon, is_active ? 1 : 0, sort_order, id]
    )
    
    // Revalidate cache with Next.js 16 syntax
    revalidateTag('portfolio:categories', '')
    revalidateTag('portfolio:landing:list', '')
    
    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil diupdate'
    })
  } catch (error: any) {
    console.error('❌ Update portfolio category error:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update category'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const pool = getPool()
    
    // Check if category is being used
    const [portfolios] = await pool.execute(
      'SELECT COUNT(*) as count FROM portfolio WHERE category_id = ?',
      [id]
    ) as any
    
    if (portfolios[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: `Kategori ini masih digunakan oleh ${portfolios[0].count} portfolio. Tidak dapat dihapus.`
      }, { status: 400 })
    }
    
    // Delete category
    await pool.execute('DELETE FROM portfolio_categories WHERE id = ?', [id])
    
    // Revalidate cache with Next.js 16 syntax
    revalidateTag('portfolio:categories', '')
    revalidateTag('portfolio:landing:list', '')
    
    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    })
  } catch (error: any) {
    console.error('❌ Delete portfolio category error:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete category'
    }, { status: 500 })
  }
}

