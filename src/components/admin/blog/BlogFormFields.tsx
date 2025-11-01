import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Category } from '@/hooks/useBlogEdit'
import DynamicRichTextEditor from '@/components/admin/blog/DynamicRichTextEditor'

interface BlogFormFieldsProps {
  formData: {
    title: string
    excerpt: string
    slug: string
    category: string
    content: string
  }
  categories: Category[]
  onInputChange: (field: string, value: string) => void
  onGenerateSlug: () => void
}

export const BlogFormFields = ({
  formData,
  categories,
  onInputChange,
  onGenerateSlug
}: BlogFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Judul Artikel *</label>
        <Input
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Masukkan judul artikel yang menarik"
          className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Slug URL</label>
        <div className="flex gap-2">
          <Input
            value={formData.slug}
            onChange={(e) => onInputChange('slug', e.target.value)}
            placeholder="slug-artikel-anda"
            className="rounded-2xl border-0 bg-gray-50 focus:ring-0 focus:outline-none transition-all duration-200"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={onGenerateSlug}
            className="rounded-2xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 px-4 py-2"
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Excerpt</label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => onInputChange('excerpt', e.target.value)}
          placeholder="Ringkasan singkat artikel (akan ditampilkan di preview)"
          rows={3}
          className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Pilih Kategori</label>
        <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
          <SelectTrigger className="w-full rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-0 bg-white/90 backdrop-blur-md shadow-lg">
            <SelectItem value="NO_CATEGORY">Tanpa Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name} className="rounded-xl hover:bg-blue-50 focus:bg-blue-50">
                {cat.name} ({cat.post_count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Konten Artikel</label>
        <DynamicRichTextEditor
          value={formData.content}
          onChange={(value) => onInputChange('content', value)}
          placeholder="Tulis konten artikel Anda di sini..."
        />
      </div>
    </div>
  )
}
