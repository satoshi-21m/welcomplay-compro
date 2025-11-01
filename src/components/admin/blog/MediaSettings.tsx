import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/ModernImageUpload'

interface MediaSettingsProps {
  featuredImage: string
  featuredImageAlt: string
  onImageChange: (field: string, value: string) => void
}

export const MediaSettings = ({
  featuredImage,
  featuredImageAlt,
  onImageChange
}: MediaSettingsProps) => {
  return (
    <div className="space-y-4">
      {/* Featured Image */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Featured Image</label>
        
        <ImageUpload
          onUploadSuccess={(path, filename) => {
            // Simpan path dalam format yang bisa dibaca oleh Next public (tanpa 'public/')
            const clean = path.replace(/^\/public\//, '/')
            onImageChange('featuredImage', clean)
          }}
          onUploadError={(error) => {
            console.error('Upload error:', error)
          }}
          onRemove={() => onImageChange('featuredImage', '')}
          uploadType="single"
          maxFiles={1}
          title="Upload Featured Image"
          description="Drag & drop image atau klik untuk memilih file"
          className="mt-2"
          compact={true}
          currentImage={featuredImage?.replace(/^\/public\//, '/')}
          showAltInput={true}
          onAltChange={(alt) => onImageChange('featuredImageAlt', alt)}
          currentImageAlt={featuredImageAlt}
        />

        {/* Alt Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Alt Text</label>
          <Input
            value={featuredImageAlt}
            onChange={(e) => onImageChange('featuredImageAlt', e.target.value)}
            placeholder="Deskripsi gambar untuk accessibility dan SEO"
            className="rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
