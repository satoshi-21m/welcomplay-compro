/**
 * Utility functions untuk upload image
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'

export interface UploadResult {
  success: boolean
  filename?: string
  path?: string
  size?: number
  type?: string
  url?: string
  error?: string
}

/**
 * Upload image ke backend server
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validasi file
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'File type not allowed. Use: JPEG, PNG, GIF, WebP'
      }
    }

    // Validasi ukuran file (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      }
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Upload ke backend
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Upload failed: ${response.status}`
      }
    }

    const result = await response.json()

    if (result.success && result.path) {
      return {
        success: true,
        filename: result.filename,
        path: result.path,
        size: result.size,
        type: result.type,
        url: result.url
      }
    } else {
      return {
        success: false,
        error: result.error || 'Upload failed'
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Validasi file sebelum upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file exists
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not allowed. Use: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}` 
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` 
    }
  }

  // Check file name
  if (!file.name || file.name.trim() === '') {
    return { isValid: false, error: 'Invalid file name' }
  }

  return { isValid: true }
}

/**
 * Generate preview URL untuk file
 */
export function generatePreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Cleanup preview URL
 */
export function cleanupPreviewUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}



// Upload utility functions

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image'
    }
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    }
  }

  return { isValid: true }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
}

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

export const compressImage = async (
  file: File, 
  maxWidth: number = 1920, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }
    
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const uploadFile = async (
  file: File, 
  uploadUrl: string, 
  token?: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Upload failed with status ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.message || 'Upload failed' }
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Upload failed' }
  }
}
