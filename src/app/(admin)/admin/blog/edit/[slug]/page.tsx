'use client'

import { use } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useBlogEdit } from '@/hooks/useBlogEdit'
import { sanitizeSlug } from '@/lib/utils'
import {
  CategoryManager,
  BlogFormFields,
  MediaSettings,
  PublishSettings,
  SEOSettings,
  BlogFormActions
} from '@/components/admin/blog'

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = use(params)
  
  // ✅ Decode URL dan sanitize slug untuk handle special characters
  const slug = sanitizeSlug(decodeURIComponent(rawSlug))
  
  const {
    loading,
    isSubmitting,
    formData,
    categories,
    newCategory,
    isAddingCategory,
    handleSubmit,
    handleInputChange,
    handleAddCategory,
    handleDeleteCategory,
    generateSlug,
    setNewCategory,
    router
  } = useBlogEdit(slug)

  if (loading) {
    return (
      <AdminLayout title="Edit Artikel">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat artikel...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Artikel">
      <div className="space-y-6 p-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Category Management */}
            <CategoryManager />
          </div>
          
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-3xl transition-all duration-200 px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden postSlug field */}
          <input type="hidden" name="postSlug" value={slug} />
          
          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="bg-white shadow-md border-0 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Informasi Artikel</CardTitle>
                </CardHeader>
                <CardContent>
                  <BlogFormFields
                    formData={{
                      title: formData.title,
                      excerpt: formData.excerpt,
                      slug: formData.slug,
                      category: formData.category,
                      content: formData.content
                    }}
                    categories={categories}
                    onInputChange={handleInputChange}
                    onGenerateSlug={generateSlug}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & SEO */}
            <div className="space-y-6">
              {/* Media Settings */}
              <Card className="bg-white shadow-md border-0 rounded-3xl">
                <CardHeader>
                  <CardDescription>Upload dan pengaturan media</CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaSettings
                    featuredImage={formData.featuredImage}
                    featuredImageAlt={formData.featuredImageAlt}
                    onImageChange={handleInputChange}
                  />
                </CardContent>
              </Card>

              {/* Publish Settings */}
              <Card className="bg-white shadow-md border-0 rounded-3xl">
                <CardContent>
                  <PublishSettings
                    status={formData.status}
                    isFeatured={formData.isFeatured}
                    onStatusChange={(value) => handleInputChange('status', value)}
                    onFeaturedChange={(value) => handleInputChange('isFeatured', value)}
                  />
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="bg-white shadow-md border-0 rounded-3xl">
                <CardHeader>
                  <CardDescription>Optimasi untuk search engine</CardDescription>
                </CardHeader>
                <CardContent>
                  <SEOSettings
                    metaTitle={formData.metaTitle}
                    metaDescription={formData.metaDescription}
                    metaKeywords={formData.metaKeywords}
                    onInputChange={handleInputChange}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <BlogFormActions
            isSubmitting={isSubmitting}
            onBack={() => router.back()}
          />
        </form>
      </div>
    </AdminLayout>
  )
}
