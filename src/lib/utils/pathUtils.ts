/**
 * Utility functions untuk handling path gambar upload - PRODUCTION READY
 */

/**
 * Memperbaiki path gambar agar sesuai dengan folder uploads
 * Output: URL absolut jika NEXT_PUBLIC_API_URL tersedia, jika tidak fallback ke welcomplay.com
 */
export function fixImagePath(path: string): string {
  if (!path) return ''

  // Jika sudah absolute URL, kembalikan apa adanya
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Normalize path - hapus leading slashes dan trailing slashes
  let cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '')
  
  // Jika path kosong setelah cleaning, return empty
  if (!cleanPath) return ''
  
  // Jika path sudah dimulai dengan uploads/, gunakan langsung
  if (cleanPath.startsWith('uploads/')) {
    const absolutePath = `/${cleanPath}`
    return withBaseUrl(absolutePath)
  }
  
  // Jika path tidak dimulai dengan uploads/, tambahkan prefix
  const normalizedPath = `uploads/${cleanPath}`
  const absolutePath = `/${normalizedPath}`
  return withBaseUrl(absolutePath)
}

function withBaseUrl(absolutePath: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL
  
  if (!base) {
    // Fallback ke welcomplay.com jika tidak ada environment variable
    return `https://welcomplay.com${absolutePath}`
  }
  
  const baseNoSlash = base.replace(/\/$/, '')
  return `${baseNoSlash}${absolutePath}`
}

/**
 * Memvalidasi apakah path sesuai dengan format uploads/filename
 */
export function validateUploadPath(path: string): { isValid: boolean; error?: string } {
  const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '')
  
  // Format harus: uploads/filename
  if (!cleanPath || cleanPath.includes('/')) {
    return { 
      isValid: false, 
      error: 'Path harus dalam format: uploads/filename' 
    }
  }
  
  return { isValid: true }
}

/**
 * Generate path yang benar untuk upload
 * Output: /uploads/filename (relative), pemanggil bisa gunakan fixImagePath untuk absolut
 */
export function generateUploadPath(filename: string): string {
  return `/uploads/${filename}`
}

/**
 * Clean path untuk database storage
 * Format: uploads/filename (tanpa leading slash)
 */
export function cleanPathForStorage(path: string): string {
  return path.replace(/^\/+/, '')
}
