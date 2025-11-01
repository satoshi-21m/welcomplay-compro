'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Upload, X, Image as ImageIcon, FileImage, Plus, Loader2, CheckCircle, Camera } from 'lucide-react'
import { showSuccess, showError } from '@/lib/toast'

// Utility function untuk robust logging
const logToBoth = (level: 'log' | 'warn' | 'error', message: string, data?: any) => {
  // Logging disabled for production
}

// Utility untuk debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface ModernImageUploadProps {
  onUploadSuccess: (filePath: string, filename: string) => void
  onUploadError?: (error: string) => void
  onRemove?: () => void
  className?: string
  maxFiles?: number
  title?: string
  description?: string
  uploadType?: 'single' | 'multiple'
  showPreview?: boolean
  accept?: string
  currentImage?: string
  currentImageAlt?: string
  showAltInput?: boolean
  onAltChange?: (alt: string) => void
  compact?: boolean
}

export function ModernImageUpload({
  onUploadSuccess,
  onUploadError,
  onRemove,
  className = "",
  maxFiles = 1,
  title,
  description,
  uploadType = 'single',
  showPreview = true,
  accept = "image/*",
  currentImage,
  currentImageAlt,
  showAltInput = false,
  onAltChange,
  compact = false
}: ModernImageUploadProps) {
  
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ path: string; filename: string; preview?: string; status: 'uploading' | 'success' | 'error' }>>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Retry tracking untuk mencegah spam
  const retryCountRef = useRef<Map<string, number>>(new Map())
  const maxRetries = 2 // Maximum retry attempts per image
  const retryDelay = 1000 // 1 second delay between retries

  const displayTitle = title || 'Upload Images'
  const canUploadMore = uploadedFiles.length < maxFiles

  // Handle file upload dengan backend API
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)
    
    try {
      if (uploadType === 'single' || maxFiles === 1) {
        // Single file upload
        const file = files[0]
        const preview = URL.createObjectURL(file)
        
        // Add file to list with uploading status
        const tempFile = {
          path: '',
          filename: file.name,
          preview,
          status: 'uploading' as const
        }
        
        setUploadedFiles(prev => [...prev, tempFile])
        
        const formData = new FormData()
        formData.append('file', file)
        
        // Upload to backend
        const response = await fetch(`/api/upload`, {
          method: 'POST',
          body: formData,
          // Jangan set Content-Type header, biarkan browser set otomatis
        })
        
        const result = await response.json()
        
        if (result.success && result.path) {
          // Update file with success status and clear preview
          setUploadedFiles(prev => prev.map(f => 
            f.filename === file.name 
              ? { ...f, path: result.path, status: 'success' as const, preview: undefined }
              : f
          ))
          
          // Cleanup preview URL
          URL.revokeObjectURL(preview)
          
          onUploadSuccess(result.path, result.filename || file.name)
          showSuccess('Image berhasil diupload!')
        } else {
          // Update file with error status
          setUploadedFiles(prev => prev.map(f => 
            f.filename === file.name 
              ? { ...f, status: 'error' as const }
              : f
          ))
          
          // Cleanup preview URL on error
          URL.revokeObjectURL(preview)
          
          const errorMsg = result.error || 'Upload gagal'
          
          onUploadError?.(errorMsg)
          showError(errorMsg)
        }
      } else {
        // Multiple files upload
        for (let i = 0; i < Math.min(files.length, maxFiles - uploadedFiles.length); i++) {
          const file = files[i]
          const preview = URL.createObjectURL(file)
          
          // Add file to list with uploading status
          const tempFile = {
            path: '',
            filename: file.name,
            preview,
            status: 'uploading' as const
          }
          
          setUploadedFiles(prev => [...prev, tempFile])
          
          const formData = new FormData()
          formData.append('file', file)
          
          try {
            const response = await fetch(`/api/upload`, {
              method: 'POST',
              body: formData,
              // Jangan set Content-Type header, biarkan browser set otomatis
            })
            
            const result = await response.json()
            
            if (result.success && result.path) {
              // Update file with success status and clear preview
              setUploadedFiles(prev => prev.map(f => 
                f.filename === file.name 
                  ? { ...f, path: result.path, status: 'success' as const, preview: undefined }
                  : f
              ))
              
              // Cleanup preview URL
              URL.revokeObjectURL(preview)
              
              onUploadSuccess(result.path, result.filename || file.name)
            } else {
              // Update file with error status
              setUploadedFiles(prev => prev.map(f => 
                f.filename === file.name 
                  ? { ...f, status: 'error' as const }
                  : f
              ))
              
              // Cleanup preview URL on error
              URL.revokeObjectURL(preview)
              
              const errorMsg = result.error || 'Upload gagal'
              onUploadError?.(errorMsg)
            }
          } catch (error) {
            // Update file with error status
            setUploadedFiles(prev => prev.map(f => 
              f.filename === file.name 
                ? { ...f, status: 'error' as const }
                : f
            ))
            
            // Cleanup preview URL on error
            URL.revokeObjectURL(preview)
            
            onUploadError?.(`${file.name}: Upload gagal`)
          }
        }
      }

    } catch (error) {
      const errorMsg = 'Terjadi kesalahan saat upload'
      onUploadError?.(errorMsg)
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }, [uploadType, maxFiles, onUploadSuccess, onUploadError, uploadedFiles.length])

  // React Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles)
  }, [handleFileUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !canUploadMore || isUploading
  })

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      const removedFile = newFiles.splice(index, 1)[0]
      
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }
      
      return newFiles
    })
  }, [])

  // Helper function untuk mendapatkan URL gambar dari folder public
  const getImageUrl = (originalPath: string) => {
    if (!originalPath) return ''
    let path = originalPath.trim()
    if (path.startsWith('http')) return path
    // Normalisasi awalan 'public/' karena Next melayani file public pada root '/'
    if (path.startsWith('/public/')) path = path.replace('/public/', '/')
    if (path.startsWith('public/')) path = path.replace('public/', '/')
    // Pastikan selalu berawalan '/'
    if (!path.startsWith('/')) path = `/${path}`
    // Jika path mengandung segmen 'uploads/YYYY/MM/DD/...' ambil dari sana
    if (path.includes('/uploads/')) {
      const match = path.match(/\/uploads\/\d{4}\/\d{2}\/\d{2}\/[^\/]+$/)
      if (match) return match[0]
    }
    // Jika dimulai dengan '/uploads/' sudah benar
    if (path.startsWith('/uploads/')) return path
    // Jika dimulai dengan 'uploads/' tambahkan '/'
    if (path.startsWith('uploads/')) return `/${path}`
    // Fallback: kembalikan path yang sudah dibersihkan
    return path
  }

  // Function untuk handle image loading dengan retry limit
  const handleImageLoad = useCallback((path: string, onSuccess: () => void, onError: (error: any) => void) => {
    const imageKey = path
    const currentRetries = retryCountRef.current.get(imageKey) || 0
    
    if (currentRetries >= maxRetries) {
      // Show error state
      onError(new Error('Max retries reached'))
      return
    }
    
    // Increment retry count
    retryCountRef.current.set(imageKey, currentRetries + 1)
    
    // Debounced retry
    const debouncedRetry = debounce(() => {
      onError(new Error('Retry attempt'))
    }, retryDelay)
    
    debouncedRetry()
  }, [maxRetries, retryDelay])

  // Compact mode untuk single image - ✅ WITH DRAG & DROP SUPPORT
  if (compact && uploadType === 'single' && maxFiles === 1) {
    return (
      <div className={className}>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
            isDragActive 
              ? isDragReject
                ? 'border-red-500 bg-red-50 scale-[1.02]' 
                : 'border-blue-500 bg-blue-50 scale-[1.02]'
              : currentImage || uploadedFiles.length > 0
                ? 'border-green-300 hover:border-green-400'
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
          }`}
        >
          <input {...getInputProps()} />
          
          {currentImage ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img 
                  src={getImageUrl(currentImage)} 
                  alt={currentImageAlt || "Preview"} 
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    
                    // Check retry limit
                    const imageKey = currentImage
                    const currentRetries = retryCountRef.current.get(imageKey) || 0
                    
                    if (currentRetries >= maxRetries) {
                      // Show error state permanently
                      target.style.display = 'none'
                      return
                    }
                    
                    // Try fallback URL with retry limit
                    const fallbackUrl = getImageUrl(currentImage)
                    
                    // Increment retry count
                    retryCountRef.current.set(imageKey, currentRetries + 1)
                    
                    // Set fallback URL with delay to prevent spam
                    setTimeout(() => {
                      target.src = fallbackUrl
                    }, retryDelay)
                  }}
                  onLoad={() => {
                    // Reset retry count on success
                    retryCountRef.current.delete(currentImage)
                  }}
                />
              </div>
              {!isDragActive && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove?.()
                    }}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 rounded-lg px-2 py-1 text-xs"
                  >
                    Hapus
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1 text-xs"
                  >
                    Ganti
                  </Button>
                </div>
              )}
              {isDragActive && (
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                  {isDragReject ? '❌ File tidak didukung!' : '📤 Drop untuk mengganti image'}
                </p>
              )}
            </div>
          ) : uploadedFiles.length > 0 ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                {uploadedFiles[0].status === 'uploading' ? (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : uploadedFiles[0].status === 'success' ? (
                  <img 
                    src={getImageUrl(uploadedFiles[0].path)} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      
                      // Check retry limit
                      const imageKey = uploadedFiles[0].path
                      const currentRetries = retryCountRef.current.get(imageKey) || 0
                      
                      if (currentRetries >= maxRetries) {
                        // Show error state permanently
                        target.style.display = 'none'
                        return
                      }
                      
                      // Try fallback URL with retry limit
                      const fallbackUrl = getImageUrl(uploadedFiles[0].path)
                      
                      // Increment retry count
                      retryCountRef.current.set(imageKey, currentRetries + 1)
                      
                      // Set fallback URL with delay to prevent spam
                      setTimeout(() => {
                        target.src = fallbackUrl
                      }, retryDelay)
                    }}
                    onLoad={() => {
                      // Reset retry count on success
                      retryCountRef.current.delete(uploadedFiles[0].path)
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                )}
              </div>
              {!isDragActive && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadedFiles([])
                    }}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 rounded-lg px-2 py-1 text-xs"
                  >
                    Hapus
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1 text-xs"
                  >
                    Ganti
                  </Button>
                </div>
              )}
              {isDragActive && (
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                  {isDragReject ? '❌ File tidak didukung!' : '📤 Drop image di sini'}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-200 ${
                isDragActive 
                  ? 'bg-blue-100 scale-110' 
                  : 'bg-gray-100'
              }`}>
                <Camera className={`w-6 h-6 transition-colors duration-200 ${
                  isDragActive ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className={`text-xs font-medium transition-colors duration-200 ${
                  isDragActive ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {isDragActive 
                    ? isDragReject 
                      ? '❌ File tidak didukung!' 
                      : '📤 Drop image di sini'
                    : '🖱️ Drag & drop atau klik untuk upload'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 10MB</p>
              </div>
              {!isDragActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 rounded-lg px-3 py-1 text-xs"
                >
                  Pilih File
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Full mode untuk multiple files atau advanced features
  return (
    <div className={className}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileImage className="h-5 w-5 text-gray-600" />
            {displayTitle}
          </CardTitle>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>JPG, PNG, GIF, WebP, SVG • Max 10MB</span>
            <span>{uploadedFiles.length}/{maxFiles} images</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag & Drop Area */}
          {canUploadMore && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                isDragActive 
                  ? isDragReject
                    ? 'border-red-500 bg-red-50' 
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />

              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <div>
                  <p className="text-base font-medium text-gray-700">
                    {isDragActive 
                      ? isDragReject 
                        ? 'File tidak didukung!' 
                        : 'Drop images di sini'
                      : 'Drag & drop images atau klik untuk pilih file'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload {maxFiles - uploadedFiles.length} image lagi
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="flex items-center justify-center gap-2 text-blue-600 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Mengupload images...</span>
            </div>
          )}

          {/* Uploaded Files Grid */}
          {showPreview && uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Images yang diupload</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  disabled={!canUploadMore}
                  className="h-8 px-3 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Tambah
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.status === 'uploading' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        </div>
                      ) : file.status === 'success' ? (
                        <>
                          <img
                            src={getImageUrl(file.path)}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback jika image gagal load
                              const target = e.target as HTMLImageElement
                              
                              // Check retry limit
                              const imageKey = file.path
                              const currentRetries = retryCountRef.current.get(imageKey) || 0
                              
                              if (currentRetries >= maxRetries) {
                                // Show error state permanently
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                                return
                              }
                              
                              // Try fallback URL with retry limit
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
                              const fallbackUrl = `${apiUrl}/api/images/${file.path.replace('uploads/', '')}`
                              
                              // Increment retry count
                              retryCountRef.current.set(imageKey, currentRetries + 1)
                              
                              // Set fallback URL with delay to prevent spam
                              setTimeout(() => {
                                target.src = fallbackUrl
                              }, retryDelay)
                            }}
                            onLoad={() => {
                              // Reset retry count on success
                              retryCountRef.current.delete(file.path)
                            }}
                          />
                          <div className="hidden absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <X className="h-8 w-8 text-red-500" />
                        </div>
                      )}
                    </div>
                    
                    {/* Status Indicator */}
                    {file.status === 'success' && (
                      <div className="absolute top-2 left-2 p-1 bg-green-500 text-white rounded-full">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                      title="Hapus image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    
                    {/* Filename */}
                    <p className="text-xs text-gray-500 mt-1 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alt Text Input */}
          {showAltInput && onAltChange && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={currentImageAlt || ''}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Deskripsi gambar untuk accessibility dan SEO"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-400 focus:ring-0 focus:outline-none transition-all duration-200"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Export alias untuk backward compatibility
export const ImageUpload = ModernImageUpload
