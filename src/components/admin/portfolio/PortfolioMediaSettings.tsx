import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ModernImageUpload } from "@/components/ui/ModernImageUpload"
import { useEffect, useState } from "react"

interface PortfolioMediaSettingsProps {
  featuredImage: string
  featuredImageAlt: string
  onImageChange: (imagePath: string) => void
  onImageRemove: () => void
  onAltTextChange: (altText: string) => void
}

export function PortfolioMediaSettings({
  featuredImage,
  featuredImageAlt,
  onImageChange,
  onImageRemove,
  onAltTextChange
}: PortfolioMediaSettingsProps) {
  
  // Local state untuk memastikan component bisa mengontrol image
  const [localImage, setLocalImage] = useState<string>(featuredImage)
  
  // Sync local state dengan props
  useEffect(() => {
    setLocalImage(featuredImage)
  }, [featuredImage])

  const handleImageChange = (filePath: string, filename: string) => {
    console.log('🔍 [PortfolioMediaSettings] Image changed to:', filePath)
    // Simpan path dalam format yang bisa dibaca oleh Next public (tanpa awalan 'public/')
    const clean = filePath.replace(/^\/public\//, '/')
    setLocalImage(clean)
    onImageChange(clean)
  }

  const handleImageRemove = () => {
    setLocalImage('')  // Update local state first
    onImageRemove()    // Then notify parent
  }

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const altText = e.target.value
    onAltTextChange(altText)
  }

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl">
      <CardHeader className="pb-3">
        <CardDescription>Upload dan pengaturan media</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Featured Image</label>
          
          <ModernImageUpload
            currentImage={localImage}  // Use local state for display
            onUploadSuccess={handleImageChange}
            onRemove={handleImageRemove}
            uploadType="single"
            maxFiles={1}
            title="Upload Featured Image"
            description="Drag & drop image atau klik untuk memilih file"
            className="mt-2"
            compact={true}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Alt Text Image</label>
          <Input
            value={featuredImageAlt}
            onChange={handleAltTextChange}
            placeholder="Masukkan alt text untuk gambar (e.g., Logo perusahaan, Screenshot aplikasi)"
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          />
        </div>
      </CardContent>
    </Card>
  )
}
