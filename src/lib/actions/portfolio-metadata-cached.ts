'use server'

import { unstable_cache as unstableCache } from 'next/cache'
import { getPortfolioCategories, getProjectTypes } from './portfolio'

/**
 * Cached Portfolio Metadata untuk Admin Panel
 * Mengurangi schema queries yang berulang saat load create/edit page
 */

// ⚡ OPTIMIZED: Cached portfolio categories
export const getCachedPortfolioCategories = unstableCache(
  async () => {
    return await getPortfolioCategories()
  },
  ['portfolio:admin:categories'],
  { 
    revalidate: 3600, // 1 hour cache
    tags: ['portfolio:categories']
  }
)

// ⚡ OPTIMIZED: Cached project types
export const getCachedProjectTypes = unstableCache(
  async () => {
    return await getProjectTypes()
  },
  ['portfolio:admin:project-types'],
  { 
    revalidate: 3600, // 1 hour cache
    tags: ['portfolio:project-types']
  }
)

