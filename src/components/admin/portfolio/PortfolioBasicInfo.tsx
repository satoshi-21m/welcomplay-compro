import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CategorySelect } from "@/components/ui/CategorySelect"
import { ProjectTypeSelect } from "@/components/ui/ProjectTypeSelect"
import { TechnologySelect } from "@/components/ui/TechnologySelect"
import DynamicRichTextEditor from "@/components/admin/blog/DynamicRichTextEditor"

interface PortfolioBasicInfoProps {
  formData: {
    title: string
    description: string
    projectUrl: string
    categoryId: string
    projectTypeId: number | null
    technologies: number[]
  }
  onInputChange: (field: any, value: any) => void
  onProjectTypeChange: (projectTypeId: number | null) => void
  onTechnologiesChange: (techIds: number[]) => void
}

export function PortfolioBasicInfo({
  formData,
  onInputChange,
  onProjectTypeChange,
  onTechnologiesChange
}: PortfolioBasicInfoProps) {
  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-gray-900">Informasi Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Judul Portfolio *</label>
          <Input
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Masukkan judul portfolio yang menarik"
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">URL Project</label>
          <Input
            type="url"
            value={formData.projectUrl}
            onChange={(e) => onInputChange('projectUrl', e.target.value)}
            placeholder="https://example.com"
            className="rounded-2xl border-0 bg-gray-50 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Kategori *</label>
            <CategorySelect
              value={formData.categoryId}
              onValueChange={(value) => onInputChange('categoryId', value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Project Type *</label>
            <ProjectTypeSelect
              value={formData.projectTypeId}
              onValueChange={onProjectTypeChange}
              placeholder="Pilih project type"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Teknologi</label>
          <TechnologySelect
            selectedTechnologies={formData.technologies}
            onTechnologiesChange={onTechnologiesChange}
            placeholder="Pilih teknologi yang digunakan..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi Portfolio</label>
          <DynamicRichTextEditor
            value={formData.description}
            onChange={(value) => onInputChange('description', value)}
            placeholder="Tulis deskripsi portfolio yang detail..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
