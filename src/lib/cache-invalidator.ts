// Cache invalidation utilities
import { cache, CACHE_KEYS, generateCacheKey } from './cache'
import { revalidatePath } from 'next/cache'
import { invalidateSiteSettingsCache } from './services/settings-service'

export class CacheInvalidator {
  // Invalidate blog-related cache
  static invalidateBlogCache() {
    console.log('🗑️ Invalidating blog cache...')
    
    // Invalidate all blog post list caches
    cache.delete(CACHE_KEYS.POSTS) // For getAllBlogPosts()
    
    cache.delete(CACHE_KEYS.CATEGORIES) // Invalidate categories cache
    
    // Revalidate Next.js data cache for blog paths
    revalidatePath('/blog', 'page')
    revalidatePath('/blog/[slug]', 'page') // Invalidate all detail pages
    console.log('✅ Blog cache invalidated and paths revalidated.')
  }
  
  // Invalidate portfolio-related cache
  static invalidatePortfolioCache() {
    console.log('🗑️ Invalidating portfolio cache...')
    
    // Invalidate all portfolio list caches
    cache.delete(CACHE_KEYS.PORTFOLIO) // For getAllPortfolioItems()
    
    // Revalidate Next.js data cache for portfolio paths
    revalidatePath('/portfolio', 'page')
    revalidatePath('/portfolio/[slug]', 'page') // Invalidate all detail pages with type parameter
    console.log('✅ Portfolio cache invalidated and paths revalidated.')
  }
  
  // Invalidate settings cache
  static invalidateSettingsCache() {
    console.log('🗑️ Invalidating settings cache...')
    invalidateSiteSettingsCache()
    revalidatePath('/', 'layout') // Revalidate root layout to reload scripts
    console.log('✅ Settings cache invalidated and layout revalidated.')
  }
  
  // Invalidate all cache
  static invalidateAllCache() {
    console.log('🗑️ Invalidating all application cache...')
    cache.clear()
    invalidateSiteSettingsCache()
    revalidatePath('/', 'layout') // Revalidate all pages
    console.log('✅ All application cache cleared and paths revalidated.')
  }
  
  // Get cache statistics
  static getCacheStats() {
    return cache.getStats()
  }
}
