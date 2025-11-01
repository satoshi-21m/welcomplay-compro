import { getCachedAdminBlogPosts, getCachedAdminBlogCategories } from '@/lib/actions/admin-blog-actions'
import BlogAdminClient from '@/components/admin/blog/BlogAdminClient'

// Server-side data fetching untuk initial load
export default async function BlogPage() {
  try {
    // Fetch data server-side untuk initial load yang cepat
    const [postsResult, categoriesResult] = await Promise.all([
      getCachedAdminBlogPosts({ limit: 50, offset: 0 }),
      getCachedAdminBlogCategories()
    ])

    const initialPosts = postsResult.success ? postsResult.data : []
    const initialCategories = categoriesResult.success ? categoriesResult.data : []

    return (
      <BlogAdminClient 
        initialPosts={initialPosts}
        initialCategories={initialCategories}
      />
    )
  } catch (error) {
    console.error('Error in BlogPage server component:', error)
    
    // Fallback dengan empty data
    return (
      <BlogAdminClient 
        initialPosts={[]}
        initialCategories={[]}
      />
    )
  }
}
