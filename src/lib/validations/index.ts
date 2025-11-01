import { z } from 'zod'

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Judul harus diisi').max(200, 'Judul terlalu panjang (maksimal 200 karakter)'),
  content: z.string().min(1, 'Konten harus diisi'),
  excerpt: z.string().max(500, 'Ringkasan terlalu panjang (maksimal 500 karakter)').optional().or(z.literal('')),
  slug: z.string().min(1, 'Slug harus diisi').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featuredImage: z.string().refine((val) => {
    // Accept empty string, relative paths, or valid URLs
    if (!val || val === '') return true
    if (val.startsWith('uploads/') || val.startsWith('/uploads/')) return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL gambar tidak valid atau path tidak valid').optional().or(z.literal('')),
  featuredImageAlt: z.string().max(200, 'Alt text terlalu panjang (maksimal 200 karakter)').optional().or(z.literal('')),
  metaTitle: z.string().max(60, 'Meta title terlalu panjang (maksimal 60 karakter)').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description terlalu panjang (maksimal 160 karakter)').optional().or(z.literal('')),
  metaKeywords: z.string().max(200, 'Meta keywords terlalu panjang (maksimal 200 karakter)').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  category: z.string().optional(), // ✅ Add category field (string, not array)
  tagIds: z.array(z.string()).optional()
})

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().min(1, 'Post ID is required')
})

// Portfolio validation schemas
export const createPortfolioSchema = z.object({
  title: z.string().min(1, 'Judul harus diisi').max(200, 'Judul terlalu panjang (maksimal 200 karakter)'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  isActive: z.boolean().default(true),
  imageUrl: z.string().refine((val) => {
    // Accept empty string, relative paths, or valid URLs
    if (!val || val === '') return true
    if (val.startsWith('uploads/') || val.startsWith('/uploads/')) return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL gambar tidak valid atau path tidak valid').optional().or(z.literal('')),
  projectUrl: z.string().url('URL proyek tidak valid').optional().or(z.literal('')),
  category: z.string().min(1, 'Kategori harus dipilih'),
  projectType: z.string().min(1, 'Project type harus dipilih').max(100, 'Project type terlalu panjang')
})

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  id: z.string().min(1, 'Portfolio ID is required')
})

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  ),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR')
})

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().min(1, 'User ID is required')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description too long').optional()
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'Category ID is required')
})

// Tag validation schemas
export const createTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(100, 'Tag name too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
})

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.string().min(1, 'Tag ID is required')
})

// API query validation schemas
export const postsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z.coerce.boolean().optional()
})

export const portfolioQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional()
})

// Type exports
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type PostsQueryInput = z.infer<typeof postsQuerySchema>
export type PortfolioQueryInput = z.infer<typeof portfolioQuerySchema>
