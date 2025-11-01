import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return ''
  const raw = imagePath.trim()
  // Full URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw

  // Normalisasi untuk Next public (tanpa 'public/' di URL)
  let path = raw
  if (path.startsWith('/public/')) path = path.replace('/public/', '/')
  if (path.startsWith('public/')) path = path.replace('public/', '/')

  // Ambil segmen uploads jika ada
  if (path.includes('/uploads/')) {
    const match = path.match(/\/uploads\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/)
    if (match) return match[0]
  }

  // Pastikan berawalan '/'
  if (!path.startsWith('/')) path = `/${path}`

  // Jika sudah '/uploads/...', pakai langsung
  if (path.startsWith('/uploads/')) return path

  // Fallback: kembalikan path yang sudah dibersihkan
  return path
}

/**
 * Memotong slug yang terlalu panjang dan memastikan valid untuk sistem file
 * @param slug - Slug asli dari API
 * @param maxLength - Panjang maksimum slug (default: 100 karakter)
 * @returns Slug yang sudah dipotong dan valid
 */
/**
 * ⚡ ENHANCED: Sanitize slug dengan handling special characters
 * Converts special characters dan ensure URL-safe slug
 */
export function sanitizeSlug(slug: string, maxLength: number = 100): string {
  if (!slug) return 'untitled'
  
  let sanitized = slug
    // Decode URL entities jika ada
    .replace(/%20/g, ' ')
    .replace(/%26/g, 'and')  // & → and
    .replace(/&amp;/g, 'and') // &amp; → and
    .replace(/&/g, 'and')     // & → and
    
    // Normalize unicode characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    
    // Convert common symbols to words
    .replace(/\+/g, 'plus')
    .replace(/@/g, 'at')
    .replace(/#/g, 'sharp')
    .replace(/\$/g, 'dollar')
    .replace(/€/g, 'euro')
    .replace(/£/g, 'pound')
    .replace(/%/g, 'percent')
    
    // Remove all special characters except spaces and dash
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    
    // Convert spaces to dash
    .replace(/\s+/g, '-')
    
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    .trim()
  
  // Fallback jika masih kosong
  if (!sanitized) return 'untitled'
  
  // Potong jika terlalu panjang
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
    // Pastikan tidak berakhir dengan dash
    if (sanitized.endsWith('-')) {
      sanitized = sanitized.slice(0, -1)
    }
  }
  
  return sanitized
}

/**
 * ⚡ ENHANCED: Generate slug yang aman dari judul dengan symbol conversion
 * @param title - Judul artikel
 * @param maxLength - Panjang maksimum slug (default: 100 karakter)
 * @returns Slug yang aman dan SEO-friendly
 */
export function generateSafeSlug(title: string, maxLength: number = 100): string {
  if (!title) return 'untitled'
  
  let slug = title
    // Convert common symbols to readable words
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/@/g, 'at')
    .replace(/#/g, 'sharp')
    .replace(/\$/g, 'dollar')
    .replace(/€/g, 'euro')
    .replace(/£/g, 'pound')
    .replace(/%/g, 'percent')
    
    // Normalize unicode characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    
    // Convert to lowercase and remove special characters
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, '')
    
    // Convert spaces to dash
    .replace(/\s+/g, '-')
    
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    .trim()
  
  // Fallback jika masih kosong
  if (!slug) return 'untitled'
  
  // Potong jika terlalu panjang
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength)
    // Pastikan tidak berakhir dengan dash
    if (slug.endsWith('-')) {
      slug = slug.slice(0, -1)
    }
  }
  
  return slug
}
