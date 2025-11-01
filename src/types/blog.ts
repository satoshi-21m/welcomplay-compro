export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt?: string
  tags: string[]
  category: string
  featured?: boolean
  image?: {
    url: string
    alt: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface BlogPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface BlogListResponse {
  posts: BlogPost[]
  pagination: BlogPagination
  categories: BlogCategory[]
  featuredPosts?: BlogPost[]
}

export interface BlogPostResponse {
  post: BlogPost
  relatedPosts: BlogPost[]
}
