import { getPool } from '@/lib/db'
import { BlogPost } from '../../types/blog'

export interface BlogPostRaw {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  category_id?: number
  status: string
  featured_image?: string
  featured_image_alt?: string
  author_id?: number
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  created_at: string
  updated_at: string
  // Join dengan categories table
  category_name?: string
  author_name?: string
  author_avatar?: string
}

export class BlogService {
  // Get all blog posts
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const sql = `
        SELECT 
          p.id,
          p.title,
          p.slug,
          p.excerpt,
          p.content,
          p.category_id,
          p.status,
          p.featured_image,
          p.featured_image_alt,
          p.author_id,
          p.is_featured,
          p.meta_title,
          p.meta_description,
          p.meta_keywords,
          p.created_at,
          p.updated_at,
          c.name as category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'published'
        ORDER BY p.created_at DESC
      `
      
      const [rawPosts] = await getPool().execute(sql, []) as [BlogPostRaw[], any]
      return this.transformPosts(rawPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      // Return empty array for build time when database is not accessible
      return []
    }
  }

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const sql = `
        SELECT 
          p.id,
          p.title,
          p.slug,
          p.excerpt,
          p.content,
          p.category_id,
          p.status,
          p.featured_image,
          p.featured_image_alt,
          p.author_id,
          p.is_featured,
          p.meta_title,
          p.meta_description,
          p.meta_keywords,
          p.created_at,
          p.updated_at,
          c.name as category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.status = 'published'
      `
      
      const [rows] = await getPool().execute(sql, [slug]) as [BlogPostRaw[], any]
      const rawPost = rows[0]
      return rawPost ? this.transformPost(rawPost) : null
    } catch (error) {
      console.error('Error fetching blog post by slug:', error)
      return null
    }
  }

  // Get related posts by category
  async getRelatedPosts(currentSlug: string, category: string): Promise<BlogPost[]> {
    const sql = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.category_id,
        p.status,
        p.featured_image,
        p.featured_image_alt,
        p.author_id,
        p.is_featured,
        p.meta_title,
        p.meta_description,
        p.meta_keywords,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.name = ? 
        AND p.slug != ? 
        AND p.status = 'published'
      ORDER BY p.created_at DESC
    `
    
    const [rawPosts] = await getPool().execute(sql, [category, currentSlug]) as [BlogPostRaw[], any]
    return this.transformPosts(rawPosts)
  }

  // Get recent posts
  async getRecentPosts(currentSlug?: string): Promise<BlogPost[]> {
    let sql = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.category_id,
        p.status,
        p.featured_image,
        p.featured_image_alt,
        p.author_id,
        p.is_featured,
        p.meta_title,
        p.meta_description,
        p.meta_keywords,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
    `
    
    const params: any[] = []
    
    if (currentSlug) {
      sql += ' AND p.slug != ?'
      params.push(currentSlug)
    }
    
    sql += ' ORDER BY p.created_at DESC'
    
    const [rawPosts] = await getPool().execute(sql, params) as [BlogPostRaw[], any]
    return this.transformPosts(rawPosts)
  }

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const sql = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.category_id,
        p.status,
        p.featured_image,
        p.featured_image_alt,
        p.author_id,
        p.is_featured,
        p.meta_title,
        p.meta_description,
        p.meta_keywords,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.name = ? AND p.status = 'published'
      ORDER BY p.created_at DESC
    `
    
    const [rawPosts] = await getPool().execute(sql, [category]) as [BlogPostRaw[], any]
    return this.transformPosts(rawPosts)
  }

  // Get all categories with post count
  async getCategories(): Promise<Array<{ id: number; name: string; post_count: number }>> {
    try {
      const sql = `
        SELECT 
          c.id,
          c.name,
          COUNT(p.id) as post_count
        FROM categories c
        LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
        GROUP BY c.id, c.name
        ORDER BY post_count DESC, c.name ASC
      `
      
      const [categories] = await getPool().execute(sql, []) as [Array<{ id: number; name: string; post_count: number }>, any]
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Get featured posts
  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const sql = `
        SELECT 
          p.id,
          p.title,
          p.slug,
          p.excerpt,
          p.content,
          p.category_id,
          p.status,
          p.featured_image,
          p.featured_image_alt,
          p.author_id,
          p.is_featured,
          p.meta_title,
          p.meta_description,
          p.meta_keywords,
          p.created_at,
          p.updated_at,
          c.name as category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_featured = 1 AND p.status = 'published'
        ORDER BY p.created_at DESC
      `
      
      const [rawPosts] = await getPool().execute(sql, []) as [BlogPostRaw[], any]
      return this.transformPosts(rawPosts)
    } catch (error) {
      console.error('Error fetching featured posts:', error)
      return []
    }
  }

  // Transform raw database data to BlogPost format
  private transformPost(rawPost: BlogPostRaw): BlogPost {
    const tags = rawPost.meta_keywords && rawPost.meta_keywords.length > 0
      ? rawPost.meta_keywords.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const imageUrl = rawPost.featured_image 
      ? (rawPost.featured_image.startsWith('http') 
          ? rawPost.featured_image 
          : `https://welcomplay.com${rawPost.featured_image}`)
      : ''

    return {
      id: rawPost.id.toString(),
      title: rawPost.title,
      slug: rawPost.slug,
      excerpt: rawPost.excerpt || '',
      content: rawPost.content || '',
      author: {
        name: 'Welcomplay', // Default author name since author_id is not joined
        avatar: '/images/placeholder-user.jpg'
      },
      publishedAt: rawPost.created_at, // Use created_at as published date
      updatedAt: rawPost.updated_at,
      tags,
      category: rawPost.category_name || 'General',
      featured: Boolean(rawPost.is_featured),
      image: imageUrl ? {
        url: imageUrl,
        alt: rawPost.featured_image_alt || rawPost.title
      } : undefined,
      seo: {
        metaTitle: rawPost.meta_title || undefined,
        metaDescription: rawPost.meta_description || undefined,
        keywords: tags.length > 0 ? tags : undefined,
      }
    }
  }

  // Transform array of raw database data to BlogPost format
  private transformPosts(rawPosts: BlogPostRaw[]): BlogPost[] {
    return rawPosts.map(post => this.transformPost(post))
  }
}

// Export singleton instance
export const blogService = new BlogService()
