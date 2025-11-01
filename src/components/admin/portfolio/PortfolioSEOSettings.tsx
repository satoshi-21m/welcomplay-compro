import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface PortfolioSEOSettingsProps {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  onMetaTitleChange: (title: string) => void
  onMetaDescriptionChange: (description: string) => void
  onMetaKeywordsChange: (keywords: string) => void
}

export function PortfolioSEOSettings({
  metaTitle,
  metaDescription,
  metaKeywords,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onMetaKeywordsChange
}: PortfolioSEOSettingsProps) {
  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl">
      <CardHeader>
        <CardDescription>Optimasi untuk search engine</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Title</label>
          <Input
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="Judul untuk search engine (kosongkan untuk gunakan judul portfolio)"
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Description</label>
          <Textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Deskripsi untuk search engine (kosongkan untuk gunakan deskripsi portfolio)"
            rows={3}
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Meta Keywords</label>
          <Input
            value={metaKeywords}
            onChange={(e) => onMetaKeywordsChange(e.target.value)}
            placeholder="Kata kunci dipisahkan dengan koma"
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          />
        </div>
      </CardContent>
    </Card>
  )
}
