"use client"

import { useState, useCallback } from 'react'
import { BlogCreateFormFields, MediaSettings, PublishSettings, SEOSettings, BlogCreateFormActions } from '@/components/admin/blog'

type Category = { id: number; name: string; post_count?: number }

interface BlogCreateFormClientProps {
  categories: Category[]
}

export function BlogCreateFormClient({ categories }: BlogCreateFormClientProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    slug: '',
    category: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    status: 'DRAFT',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  })

  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const generateSlug = useCallback((title?: string) => {
    const source = typeof title === 'string' ? title : formData.title
    const slug = source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setFormData(prev => ({ ...prev, slug }))
  }, [formData.title])

  return (
    <>
      {/* Fields */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-md border-0 rounded-3xl">
            <div className="p-6">
              <BlogCreateFormFields
                formData={formData as any}
                categories={categories as any}
                onInputChange={handleInputChange}
                onGenerateSlug={generateSlug}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-md border-0 rounded-3xl">
            <div className="p-6">
              <MediaSettings
                featuredImage={formData.featuredImage as any}
                featuredImageAlt={formData.featuredImageAlt as any}
                onImageChange={handleInputChange as any}
              />
            </div>
          </div>

          <div className="bg-white shadow-md border-0 rounded-3xl">
            <div className="p-6">
              <PublishSettings
                status={formData.status as any}
                isFeatured={formData.isFeatured as any}
                onStatusChange={(val: any) => handleInputChange('status', val)}
                onFeaturedChange={(val: any) => handleInputChange('isFeatured', val)}
              />
            </div>
          </div>

          <div className="bg-white shadow-md border-0 rounded-3xl">
            <div className="p-6">
              <SEOSettings
                metaTitle={formData.metaTitle as any}
                metaDescription={formData.metaDescription as any}
                metaKeywords={formData.metaKeywords as any}
                onInputChange={handleInputChange as any}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden inputs to ensure Server Action receives all values */}
      <input type="hidden" name="title" value={formData.title} />
      <input type="hidden" name="excerpt" value={formData.excerpt} />
      <input type="hidden" name="slug" value={formData.slug} />
      <input type="hidden" name="category" value={formData.category} />
      <input type="hidden" name="content" value={formData.content} />
      <input type="hidden" name="featuredImage" value={formData.featuredImage} />
      <input type="hidden" name="featuredImageAlt" value={formData.featuredImageAlt} />
      <input type="hidden" name="status" value={formData.status} />
      <input type="hidden" name="isFeatured" value={String(formData.isFeatured)} />
      <input type="hidden" name="metaTitle" value={formData.metaTitle} />
      <input type="hidden" name="metaDescription" value={formData.metaDescription} />
      <input type="hidden" name="metaKeywords" value={formData.metaKeywords} />

      <BlogCreateFormActions isSubmitting={false as any} />
    </>
  )
}


