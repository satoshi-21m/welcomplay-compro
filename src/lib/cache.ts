// Simple in-memory cache for development
// In production, consider using Redis or other external cache services

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<unknown>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cache keys
export const CACHE_KEYS = {
  POSTS: 'posts',
  PORTFOLIO: 'portfolio',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  FEATURED_POSTS: 'featured_posts',
  FEATURED_PORTFOLIO: 'featured_portfolio'
} as const

// Cache TTL values (in milliseconds)
export const CACHE_TTL = {
  POSTS: 10 * 60 * 1000,        // 10 minutes
  PORTFOLIO: 15 * 60 * 1000,    // 15 minutes
  CATEGORIES: 60 * 60 * 1000,   // 1 hour
  TAGS: 60 * 60 * 1000,         // 1 hour
  FEATURED: 5 * 60 * 1000       // 5 minutes
} as const

// Helper function to generate cache keys with parameters
export function generateCacheKey(baseKey: string, params: Record<string, unknown> = {}): string {
  if (Object.keys(params).length === 0) return baseKey
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  
  return `${baseKey}:${sortedParams}`
}

// Cache decorator for functions
export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  cacheKey: string,
  ttl: number = CACHE_TTL.POSTS
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = generateCacheKey(cacheKey, { args: JSON.stringify(args) })
    const cached = cache.get<ReturnType<T>>(key)
    
    if (cached) {
      return cached
    }
    
    const result = await fn(...args)
    cache.set(key, result, ttl)
    
    return result as ReturnType<T>
  }) as T
}
