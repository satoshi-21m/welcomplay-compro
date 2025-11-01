"use client"

import { useState } from 'react'
import Image from 'next/image'

// ===== UPLOADED IMAGE COMPONENTS =====

interface UploadedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
}

export function UploadedImage({ 
  src, 
  alt, 
  className = "w-12 h-12",
  width,
  height,
  fill = false,
  priority = false
}: UploadedImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // Validasi src yang lebih robust
  if (src === undefined || src === null || src === '') {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded`}>
        <div className="text-gray-400 text-xs text-center">
          <div>📷</div>
          <div>No Image</div>
        </div>
      </div>
    )
  }
  
  // Handle path untuk backend uploads
  let imageSrc = src
  
  // Jika sudah absolute URL, gunakan apa adanya
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    // Keep as is
  }
  // Jika path dimulai dengan uploads/, tambahkan backend URL
  else if (imageSrc.startsWith('uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
    imageSrc = `${apiUrl}/public/${imageSrc}`
  }
  // Jika path tidak dimulai dengan /, tambahkan
  else if (!imageSrc.startsWith('/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://welcomplay.com'
    imageSrc = `${apiUrl}/public/${imageSrc}`
  }
  
  // Jika tidak ada imageSrc setelah transform, tampilkan placeholder
  if (!imageSrc) {
    return (
      <div className={`${className} bg-red-100 border-2 border-red-300 flex items-center justify-center rounded`}>
        <div className="text-red-600 text-xs text-center">
          <div>🚫</div>
          <div>Path Error</div>
        </div>
      </div>
    )
  }
  
  const handleImageError = () => {
    setImageError(true)
  }
  
  const handleImageLoad = () => {
    setImageError(false)
  }
  
  // Jika ada error, tampilkan placeholder
  if (imageError) {
    return (
      <div className={`${className} bg-red-100 border-2 border-red-300 flex items-center justify-center rounded`}>
        <div className="text-red-600 text-xs text-center">
          <div>❌</div>
          <div>Load Failed</div>
        </div>
      </div>
    )
  }
  
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover rounded"
          unoptimized
          priority={priority}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 48}
        height={height || 48}
        className={`object-cover rounded ${className}`}
        unoptimized
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}

// Komponen khusus untuk thumbnail
export function ThumbnailImage({ 
  src, 
  alt, 
  className = "w-12 h-12"
}: { 
  src: string; 
  alt: string; 
  className?: string;
}) {
  return <UploadedImage src={src} alt={alt} className={className} fill />
}

// Komponen untuk gambar dengan ukuran custom
export function CustomImage({ 
  src, 
  alt, 
  width = 200, 
  height = 200, 
  className = ""
}: { 
  src: string; 
  alt: string; 
  width?: number; 
  height?: number; 
  className?: string;
}) {
  return (
    <UploadedImage 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  )
}
