import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PortfolioBasicInfo } from "./PortfolioBasicInfo"
import { PortfolioMediaSettings } from "./PortfolioMediaSettings"
import { PortfolioPublishSettings } from "./PortfolioPublishSettings"
import { PortfolioSEOSettings } from "./PortfolioSEOSettings"
import { PortfolioFormActions } from "./PortfolioFormActions"
import { PortfolioFormState } from "@/hooks/usePortfolioForm"

interface PortfolioFormProps {
  formState: PortfolioFormState
  onFieldChange: (field: keyof PortfolioFormState, value: any) => void
  onFeaturedImageChange: (image: string) => void
  onFeaturedImageRemove: () => void
  onTechnologiesChange: (techIds: number[]) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export function PortfolioForm({
  formState,
  onFieldChange,
  onFeaturedImageChange,
  onFeaturedImageRemove,
  onTechnologiesChange,
  onSubmit,
  onBack
}: PortfolioFormProps) {
  return (
    <div className="space-y-4 p-2 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-left">Update portfolio yang menarik untuk showcase proyek Anda</p>
        </div>
        
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-3xl transition-all duration-200 px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <form onSubmit={onSubmit} className="portfolio-form space-y-4">
        {/* Main Content */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-4">
            <PortfolioBasicInfo
              formData={{
                title: formState.title || '',
                description: formState.description || '',
                projectUrl: formState.projectUrl || '',
                categoryId: formState.categoryId || '',
                projectTypeId: formState.projectTypeId || null,
                technologies: formState.technologies || []
              }}
              onInputChange={onFieldChange}
              onProjectTypeChange={(projectTypeId) => onFieldChange('projectTypeId', projectTypeId)}
              onTechnologiesChange={onTechnologiesChange}
            />
          </div>

          {/* Right Column - Settings & Media */}
          <div className="space-y-4">
            <PortfolioMediaSettings
              featuredImage={formState.featuredImage || ''}
              featuredImageAlt={formState.featuredImageAlt || ''}
              onImageChange={onFeaturedImageChange}
              onImageRemove={onFeaturedImageRemove}
              onAltTextChange={(altText) => onFieldChange('featuredImageAlt', altText)}
            />

            <PortfolioPublishSettings
              isActive={formState.isActive ?? true}
              onActiveChange={(active) => onFieldChange('isActive', active)}
            />

            <PortfolioSEOSettings
              metaTitle={formState.metaTitle || ''}
              metaDescription={formState.metaDescription || ''}
              metaKeywords={formState.metaKeywords || ''}
              onMetaTitleChange={(title) => onFieldChange('metaTitle', title)}
              onMetaDescriptionChange={(description) => onFieldChange('metaDescription', description)}
              onMetaKeywordsChange={(keywords) => onFieldChange('metaKeywords', keywords)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <PortfolioFormActions
          isSubmitting={formState.isSubmitting}
          onCancel={onBack}
          submitText="Update Portfolio"
          submitIcon="Save"
          loadingText="Mengupdate..."
        />
      </form>
    </div>
  )
}
