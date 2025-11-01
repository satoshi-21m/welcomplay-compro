import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  BlogCreateHeader,
  BlogCreateFormFields,
  MediaSettings,
  PublishSettings,
  SEOSettings,
  BlogCreateFormActions,
  DeleteCategoryDialog
} from '@/components/admin/blog'
import { getLandingBlogCategories } from '@/lib/actions/blog-actions'
import { createPostAction } from '../actions'
import { BlogCreateFormClient } from '@/components/admin/blog/BlogCreateFormClient'

export default async function CreateBlogPage() {
  // ⚡ OPTIMIZED: Use cached categories untuk faster load
  const categoriesRaw = await getLandingBlogCategories()
  const categories = categoriesRaw.map(c => ({ ...c, post_count: c.post_count ?? 0 }))

  return (
    <AdminLayout title="Tulis Artikel Baru">
      <div className="space-y-6 p-2">
        {/* Header */}
        <BlogCreateHeader />

        <form action={createPostAction} className="space-y-6">
          <BlogCreateFormClient categories={categories as any} />
        </form>

        {/* Delete Category Confirmation Dialog */}
        
      </div>
    </AdminLayout>
  )
}
