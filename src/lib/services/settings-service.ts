import { getPool } from '../db'
import { cache } from '../cache'

const CACHE_KEY = 'site_settings'
const CACHE_TTL = 300000 // 5 minutes

export interface SiteSettings {
  google_analytics_id?: string
  google_tag_manager_id?: string
  facebook_pixel_id?: string
  custom_head_scripts?: string
  custom_body_scripts?: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // Check cache first
    const cached = cache.get<SiteSettings>(CACHE_KEY)
    if (cached) {
      return cached
    }

    // Add timeout for build-time safety
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000) // 5 second timeout
    })

    const pool = getPool()
    
    const queryPromise = pool.query(
      `SELECT setting_key, setting_value FROM settings WHERE category = 'third_party_scripts'`
    )

    const [rows] = await Promise.race([queryPromise, timeoutPromise]) as any
    
    const settings: SiteSettings = {}
    
    if (rows && Array.isArray(rows)) {
      rows.forEach((row: any) => {
        settings[row.setting_key as keyof SiteSettings] = row.setting_value || ''
      })
    }
    
    // Cache the settings
    cache.set(CACHE_KEY, settings, CACHE_TTL)
    
    return settings
  } catch (error) {
    // Silently return empty settings during build time or when DB is unavailable
    if (process.env.NODE_ENV === 'production' && !process.env.SKIP_BUILD_PRODUCT_REDIRECTS) {
      // Only log during actual runtime, not during build
      console.error('Error fetching site settings:', error)
    }
    return {}
  }
}

export function invalidateSiteSettingsCache() {
  cache.delete(CACHE_KEY)
}

