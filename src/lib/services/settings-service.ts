import { getPool } from '../db'
import { unstable_cache as unstableCache } from 'next/cache'
import { revalidateTag } from 'next/cache'

export interface SiteSettings {
  google_analytics_id?: string
  google_tag_manager_id?: string
  facebook_pixel_id?: string
  custom_head_scripts?: string
  custom_body_scripts?: string
}

// Direct database call without build-time conditional logic
async function fetchSiteSettingsFromDB(): Promise<SiteSettings> {
  try {
    const pool = getPool()
    
    const [rows] = await pool.query(
      `SELECT setting_key, setting_value FROM settings WHERE category = 'third_party_scripts'`
    ) as any
    
    const settings: SiteSettings = {}
    
    if (rows && Array.isArray(rows)) {
      rows.forEach((row: any) => {
        settings[row.setting_key as keyof SiteSettings] = row.setting_value || ''
      })
    }
    
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {}
  }
}

// Main function using unstable_cache directly like portfolio and blog
export const getSiteSettings = unstableCache(
  fetchSiteSettingsFromDB,
  ['site-settings'],
  {
    revalidate: 3600, // 1 hour
    tags: ['settings']
  }
)

export function invalidateSiteSettingsCache() {
  revalidateTag('settings', "")
}

