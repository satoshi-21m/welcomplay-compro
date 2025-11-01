import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SEOSettingsProps {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  onInputChange: (field: string, value: string) => void
}

export const SEOSettings = ({
  metaTitle,
  metaDescription,
  metaKeywords,
  onInputChange
}: SEOSettingsProps) => {
  return (
    <div className="space-y-4">
      {/* Meta Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Title</label>
        <Input
          value={metaTitle}
          onChange={(e) => onInputChange('metaTitle', e.target.value)}
          placeholder="Judul untuk search engine (kosongkan untuk gunakan judul artikel)"
          className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Description</label>
        <Textarea
          value={metaDescription}
          onChange={(e) => onInputChange('metaDescription', e.target.value)}
          placeholder="Deskripsi untuk search engine (kosongkan untuk gunakan excerpt)"
          rows={3}
          className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Keywords</label>
        <Input
          value={metaKeywords}
          onChange={(e) => onInputChange('metaKeywords', e.target.value)}
          placeholder="Kata kunci dipisahkan dengan koma"
          className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
        />
      </div>
    </div>
  )
}
