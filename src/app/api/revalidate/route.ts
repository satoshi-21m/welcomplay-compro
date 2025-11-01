import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Webhook endpoint untuk revalidate cache secara real-time
 * Digunakan oleh Vercel webhooks atau manual trigger untuk invalidate cache global
 * 
 * Security: Dilindungi dengan secret token
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ SECURITY: Cek secret token
    const authHeader = request.headers.get('authorization')
    const secretToken = process.env.REVALIDATE_SECRET
    
    if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
      console.log('🚫 Revalidate API - Unauthorized access attempt')
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, slug, tags } = body

    console.log('🔄 Revalidate API - Processing request:', { type, slug, tags })

    // Handle different revalidation types
    switch (type) {
      case 'blog':
        // Invalidate blog specific caches
        revalidateTag('blog:posts', "")
        revalidateTag('blog:landing:list', "")
        revalidateTag('blog:recent', "")
        revalidateTag('blog:categories', "")
        revalidateTag('blog:detail', "")
        revalidateTag('blog:related', "")
        
        // Invalidate paths
        revalidatePath('/blog', 'page')
        revalidatePath('/') // Homepage juga perlu di-revalidate karena menampilkan blog posts
        
        if (slug) {
          revalidatePath(`/blog/${slug}`, 'page')
        } else {
          revalidatePath('/blog/[slug]', 'page') // Invalidate all blog detail pages
        }
        break

      case 'portfolio':
        // Invalidate portfolio specific caches
        revalidateTag('portfolio:posts', "")
        revalidateTag('portfolio:landing:list', "")
        revalidateTag('portfolio:items', "")
        revalidateTag('portfolio:detail', "")
        revalidateTag('portfolio:related', "")
        
        // Invalidate paths
        revalidatePath('/portfolio', 'page')
        revalidatePath('/') // Homepage juga perlu di-revalidate karena menampilkan portfolio
        
        if (slug) {
          revalidatePath(`/portfolio/${slug}`, 'page')
        } else {
          revalidatePath('/portfolio/[slug]', 'page') // Invalidate all portfolio detail pages
        }
        break

      case 'tag':
        // Revalidate by specific tags
        if (tags && Array.isArray(tags)) {
          tags.forEach((tag: string) => {
            revalidateTag(tag, "")
          })
        }
        break

      case 'path':
        // Revalidate by specific path
        if (slug) {
          revalidatePath(slug, 'page')
        }
        break

      case 'all':
        // Nuclear option: revalidate everything
        revalidatePath('/', 'layout')
        revalidatePath('/blog', 'page')
        revalidatePath('/portfolio', 'page')
        revalidateTag('blog:posts', "")
        revalidateTag('blog:landing:list', "")
        revalidateTag('blog:recent', "")
        revalidateTag('blog:categories', "")
        revalidateTag('blog:detail', "")
        revalidateTag('blog:related', "")
        revalidateTag('portfolio:posts', "")
        revalidateTag('portfolio:landing:list', "")
        revalidateTag('portfolio:items', "")
        revalidateTag('portfolio:detail', "")
        revalidateTag('portfolio:related', "")
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid revalidation type' },
          { status: 400 }
        )
    }

    console.log('✅ Revalidate API - Successfully revalidated:', { type, slug })
    
    return NextResponse.json({
      success: true,
      message: `Successfully revalidated ${type}${slug ? ` - ${slug}` : ''}`,
      revalidatedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Revalidate API - Error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to revalidate' },
      { status: 500 }
    )
  }
}

// GET endpoint untuk testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidate API endpoint is active',
    usage: {
      method: 'POST',
      url: '/api/revalidate',
      headers: {
        'Authorization': 'Bearer <REVALIDATE_SECRET>',
        'Content-Type': 'application/json'
      },
      body: {
        type: 'blog | portfolio | tag | path | all',
        slug: 'optional-slug-for-specific-pages',
        tags: ['tag1', 'tag2']
      }
    },
    examples: [
      {
        description: 'Revalidate all blog caches',
        body: { type: 'blog' }
      },
      {
        description: 'Revalidate specific blog post',
        body: { type: 'blog', slug: 'my-blog-post' }
      },
      {
        description: 'Revalidate all portfolio caches',
        body: { type: 'portfolio' }
      },
      {
        description: 'Revalidate by tags',
        body: { type: 'tag', tags: ['blog:posts', 'portfolio:items'] }
      },
      {
        description: 'Revalidate everything',
        body: { type: 'all' }
      }
    ]
  })
}

