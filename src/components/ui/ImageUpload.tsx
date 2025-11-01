'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Upload, X, Image as ImageIcon, FileImage, Plus, Loader2, CheckCircle } from 'lucide-react'
import { showSuccess, showError } from '@/lib/toast'

// ===== IMAGE UPLOAD COMPONENTS =====

interface ImageUploadProps {
  onUploadSuccess: (filePath: string, filename: string) => void
  onUploadError?: (error: string) => void
  className?: string
  maxFiles?: number
  title?: string
  description?: string
  uploadType?: 'single' | 'multiple'
  showPreview?: boolean
  accept?: string
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  className = "",
  maxFiles = 1,
  title,
  description,
  uploadType = 'single',
  showPreview = true,
  accept = "image/*"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ path: string; filename: string; preview?: string; status: 'uploading' | 'success' | 'error' }>>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
        const response = await fetch(`${apiUrl}/api/upload`, {
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
            const response = await fetch(`${apiUrl}/api/upload`, {
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
              showError(`${file.name}: ${errorMsg}`)
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
            
            showError(`${file.name}: Upload gagal`)
          }
        }
        
        const successCount = files.filter((_, index) => {
          const file = uploadedFiles.find(f => f.filename === files[index]?.name)
          return file?.status === 'success'
        }).length
        
        if (successCount > 0) {
          showSuccess(`${successCount} images berhasil diupload!`)
        }
      }

    } catch (error) {
      setIsUploading(false)
      setUploadProgress({})
      const errorMsg = 'Terjadi kesalahan saat upload'
      onUploadError?.(errorMsg)
      showError(errorMsg)
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

  // Helper function untuk mendapatkan URL gambar dari backend
  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
    return `${apiUrl}/public/${path}`
  }

  // Single file upload (simple) - ✅ WITH DRAG & DROP SUPPORT
  if (uploadType === 'single' && maxFiles === 1) {
    return (
      <div className={className}>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
            isDragActive 
              ? isDragReject
                ? 'border-red-500 bg-red-50 scale-[1.02]' 
                : 'border-blue-500 bg-blue-50 scale-[1.02]'
              : uploadedFiles.length > 0
                ? 'border-green-300 hover:border-green-400'
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadedFiles.length > 0 ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                {uploadedFiles[0].status === 'uploading' ? (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : uploadedFiles[0].status === 'success' ? (
                  <img 
                    src={uploadedFiles[0].preview || getImageUrl(uploadedFiles[0].path)} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg mx-auto"
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
                    onClick={(e) => e.stopPropagation()}
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
          ) : (
            <div className="space-y-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-200 ${
                isDragActive 
                  ? 'bg-blue-100 scale-110' 
                  : 'bg-gray-100'
              }`}>
                <Upload className={`w-6 h-6 transition-colors duration-200 ${
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
                  onClick={(e) => e.stopPropagation()}
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

  // Multiple files upload (advanced)
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
              <Loader2 className="w-4 h-4 animate-spin" />
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
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-gray-400 text-center">
                              <div className="text-2xl mb-1">📷</div>
                              <div className="text-xs">Image</div>
                            </div>
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
        </CardContent>
      </Card>
    </div>
  )
}

// ===== LEGACY COMPONENTS (for backward compatibility) =====

// Alias untuk PortfolioImageUpload (legacy)
export const PortfolioImageUpload = ImageUpload
