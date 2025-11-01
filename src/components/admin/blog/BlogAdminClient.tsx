'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoryManager } from '@/components/admin/blog/CategoryManager'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User,
  BookOpen
} from 'lucide-react'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { deleteBlogPost, addBlogCategory, deleteBlogCategory } from '@/lib/actions/admin-blog-actions'
import { formatDate, getImageUrl } from '@/lib/utils'

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  category?: string
  status: 'DRAFT' | 'PUBLISHED'
  featuredImage?: string
  featuredImageAlt?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  author?: string
}

interface Category {
  name: string
  post_count: number
}

interface BlogAdminClientProps {
  initialPosts: Post[]
  initialCategories: Category[]
}

// SWR fetcher functions
const fetchers = {
  posts: async () => {
    const response = await fetch('/api/admin/blog/posts', { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch posts')
    const data = await response.json()
    return data.posts || []
  },
  categories: async () => {
    const response = await fetch('/api/posts/categories', { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.data || []
  }
}

export default function BlogAdminClient({ initialPosts, initialCategories }: BlogAdminClientProps) {
  const router = useRouter()
  
  // ⚡ OPTIMIZED: SWR dengan minimal revalidation untuk performa optimal
  const { data: posts = initialPosts, mutate: mutatePosts, isLoading: postsLoading } = useSWR(
    'admin-blog-posts',
    fetchers.posts,
    {
      fallbackData: initialPosts,
      refreshInterval: 0,              // ✅ Disable auto-refresh
      revalidateOnFocus: false,        // ✅ Disable on tab focus
      revalidateOnReconnect: false,    // ✅ Disable on network reconnect
      revalidateIfStale: false,        // ✅ Don't revalidate if data exists
      dedupingInterval: 60000,         // ✅ Increase to 1 minute
    }
  )

  const { data: categories = initialCategories, mutate: mutateCategories, isLoading: categoriesLoading } = useSWR(
    'admin-blog-categories',
    fetchers.categories,
    {
      fallbackData: initialCategories,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    }
  )

  // Local state untuk filtering dan pagination
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Category management modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Delete confirmation dialog states
  const [confirmingCategory, setConfirmingCategory] = useState<string | null>(null)
  const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<{id: string, title: string} | null>(null)

  // Filter posts when data changes
  useEffect(() => {
    let filtered = posts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((post: Post) => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((post: Post) => post.status === statusFilter)
    }

    // Apply category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((post: Post) => post.category === categoryFilter)
    }

    setFilteredPosts(filtered)
    setCurrentPage(1) // Reset pagination when filters change
  }, [posts, searchTerm, statusFilter, categoryFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  // ✅ REFACTORED: Use Server Actions
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    setIsAddingCategory(true)
    try {
      const result = await addBlogCategory(newCategory.trim())
      
      if (result.success) {
        showSuccess('Kategori berhasil ditambahkan!')
        setNewCategory('')
        mutateCategories() // Refresh categories dengan SWR
        setCategoryFilter('ALL')
      } else {
        showError(result.message || 'Gagal menambah kategori')
      }
    } catch (error) {
      showError('Terjadi kesalahan saat menambah kategori')
    } finally {
      setIsAddingCategory(false)
    }
  }

  // ✅ REFACTORED: Use Server Actions
  const handleDeleteCategory = async (name?: string) => {
    const target = name ?? ''
    if (!target) return
    
    try {
      const result = await deleteBlogCategory(target.trim())
      
      if (result.success) {
        showSuccess('Kategori berhasil dihapus!')
        mutateCategories() // Refresh categories dengan SWR
        if (categoryFilter === target) {
          setCategoryFilter('ALL')
        }
        setConfirmingCategory(null)
      } else {
        showError(result.message || 'Gagal menghapus kategori')
      }
    } catch (error) {
      showError('Terjadi kesalahan saat menghapus kategori')
    }
  }

  // Show delete post confirmation dialog
  const showDeletePostConfirmation = (postId: string, postTitle: string) => {
    setPostToDelete({ id: postId, title: postTitle })
    setShowDeletePostDialog(true)
  }

  // ✅ REFACTORED: Use Server Actions
  const handleDeletePost = async () => {
    if (!postToDelete) return

    const loadingToast = showLoading('Menghapus artikel...')

    try {
      const result = await deleteBlogPost(postToDelete.id)
      
      dismissToast(loadingToast)
      
      if (result.success) {
        showSuccess('Artikel berhasil dihapus!')
        mutatePosts() // Refresh posts dengan SWR
        setShowDeletePostDialog(false)
        setPostToDelete(null)
      } else {
        showError(result.message || 'Gagal menghapus artikel')
      }
    } catch (error) {
      dismissToast(loadingToast)
      showError('Terjadi kesalahan saat menghapus artikel')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Published</Badge>
      case 'DRAFT':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Draft</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>
    }
  }

  return (
    <AdminLayout 
      title="Kelola Blog"
      showSearch={true}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari artikel..."
    >
      <div className="space-y-6 p-2">
        {/* Unified Header Layout */}
        <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center justify-between">
            {/* Left Side - Stats and Category Select */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                {/* Total Articles */}
                <div 
                  className={`rounded-xl p-2 sm:p-3 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'ALL' 
                      ? 'bg-red-50 border-red-300 shadow-sm ring-1 ring-red-200' 
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center hidden sm:flex ${
                        statusFilter === 'ALL' ? 'bg-red-200' : 'bg-red-100'
                      }`}>
                        <BookOpen className={`h-2.5 w-2.5 ${
                          statusFilter === 'ALL' ? 'text-red-700' : 'text-red-600'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        statusFilter === 'ALL' ? 'text-red-700' : 'text-gray-600'
                      }`}>Total</span>
                    </div>
                    <span className={`text-sm font-bold ml-2 ${
                      statusFilter === 'ALL' ? 'text-red-700' : 'text-red-600'
                    }`}>
                      {postsLoading ? '...' : filteredPosts.length}
                    </span>
                  </div>
                </div>

                {/* Published Articles */}
                <div 
                  className={`rounded-xl p-2 sm:p-3 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'PUBLISHED' 
                      ? 'bg-green-50 border-green-300 shadow-sm ring-1 ring-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('PUBLISHED')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center hidden sm:flex ${
                        statusFilter === 'PUBLISHED' ? 'bg-green-200' : 'bg-green-100'
                      }`}>
                        <Eye className={`h-2.5 w-2.5 ${
                          statusFilter === 'PUBLISHED' ? 'text-green-700' : 'text-green-600'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        statusFilter === 'PUBLISHED' ? 'text-green-700' : 'text-gray-600'
                      }`}>Published</span>
                    </div>
                    <span className={`text-sm font-bold ml-2 ${
                      statusFilter === 'PUBLISHED' ? 'text-green-700' : 'text-green-600'
                    }`}>
                      {postsLoading ? '...' : posts.filter((p: Post) => p.status === 'PUBLISHED').length}
                    </span>
                  </div>
                </div>

                {/* Draft Articles */}
                <div 
                  className={`rounded-xl p-2 sm:p-3 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'DRAFT' 
                      ? 'bg-yellow-50 border-yellow-300 shadow-sm ring-1 ring-yellow-200' 
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('DRAFT')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center hidden sm:flex ${
                        statusFilter === 'DRAFT' ? 'bg-yellow-200' : 'bg-yellow-100'
                      }`}>
                        <Edit className={`h-2.5 w-2.5 ${
                          statusFilter === 'DRAFT' ? 'text-yellow-700' : 'text-yellow-600'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        statusFilter === 'DRAFT' ? 'text-yellow-700' : 'text-gray-600'
                      }`}>Draft</span>
                    </div>
                    <span className={`text-sm font-bold ml-2 ${
                      statusFilter === 'DRAFT' ? 'text-yellow-700' : 'text-yellow-600'
                    }`}>
                      {postsLoading ? '...' : posts.filter((p: Post) => p.status === 'DRAFT').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Select - Desktop Only */}
              <div className="hidden lg:flex flex-shrink-0">
                <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categoriesLoading}>
                  <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-300">
                    <SelectValue placeholder={categoriesLoading ? "Loading..." : "Pilih Kategori"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="ALL" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                      Semua Kategori
                    </SelectItem>
                    {categories && categories.length > 0 && categories.map((cat: Category, index: number) => (
                      <SelectItem key={`${cat.name}-${index}`} value={cat.name} className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                        {cat.name} ({cat.post_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Row - Category Select + Action Buttons */}
            <div className="lg:hidden flex items-center gap-2 w-full">
              {/* Category Select - Mobile */}
              <div className="flex-1">
                <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categoriesLoading}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-300">
                    <SelectValue placeholder={categoriesLoading ? "Loading..." : "Pilih Kategori"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="ALL" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                      All
                    </SelectItem>
                    {categories && categories.length > 0 && categories.map((cat: Category, index: number) => (
                      <SelectItem key={`${cat.name}-${index}`} value={cat.name} className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                        {cat.name} ({cat.post_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kelola Kategori Button - Mobile */}
              <CategoryManager 
                buttonVariant="outline"
                buttonSize="default"
                buttonLabel="Kelola Kategori"
                buttonClassName="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-2 py-2 whitespace-nowrap text-xs flex-shrink-0"
              />

              {/* Tulis Artikel Button - Mobile */}
              <Button 
                onClick={() => router.push('/admin-g30spki/blog/create')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-2 py-2 whitespace-nowrap text-xs flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Artikel
              </Button>
            </div>

            {/* Right Side - Action Buttons - Desktop Only */}
            <div className="hidden lg:flex flex-row items-center gap-3 flex-shrink-0">
              {/* Kelola Kategori Button */}
              <CategoryManager 
                buttonVariant="outline"
                buttonSize="default"
                buttonLabel="Kelola Kategori"
                buttonClassName="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-3 py-2 whitespace-nowrap text-sm"
              />

              {/* Tulis Artikel Button */}
              <Button 
                onClick={() => router.push('/admin-g30spki/blog/create')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-3 py-2 whitespace-nowrap text-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tulis Artikel
              </Button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat artikel...</p>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada artikel</h3>
            <p className="text-gray-600 mb-6">Mulai dengan membuat artikel blog pertama Anda</p>
            <Button 
              onClick={() => router.push('/admin-g30spki/blog/create')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tulis Artikel Pertama
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Featured Image or Placeholder */}
                  <div className="lg:w-48 lg:h-32 w-full h-48 flex-shrink-0">
                    {post.featuredImage ? (
                      <img
                        src={getImageUrl(post.featuredImage)}
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-200 group cursor-pointer"
                        onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                        title="Click to edit and add featured image"
                      >
                        <div className="text-center">
                          <div className="relative">
                            <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors duration-200" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors duration-200"></div>
                          </div>
                          <p className="text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">No Featured Image</p>
                          <p className="text-xs text-blue-400 mt-1">Click to add one</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin-g30spki/blog/edit/${post.slug}`)}
                        className="rounded-xl"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="rounded-xl"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDeletePostConfirmation(post.id, post.title)}
                        className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info and Controls */}
        {filteredPosts.length > 0 && (
          <div className="mt-8 space-y-4">
            {/* Pagination Info */}
            <div className="text-center text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} dari {filteredPosts.length} artikel
              {totalPages > 1 && ` (Halaman ${currentPage} dari ${totalPages})`}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm bg-white ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                  aria-label="Halaman sebelumnya"
                >
                  Prev
                </button>
                {/* Page numbers (windowed) */}
                {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(page => {
                  if (page === 1 || page === totalPages) return true
                  return Math.abs(page - currentPage) <= 2
                }).map((page, idx, arr) => {
                  const prevPage = arr[idx - 1]
                  const needEllipsis = prevPage && page - prevPage > 1
                  return (
                    <span key={`page-${page}`} className="flex items-center">
                      {needEllipsis && <span className="px-2 text-gray-400">…</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`px-3 py-2 rounded-lg text-sm ${page === currentPage ? 'bg-custom-red text-white' : 'bg-white text-gray-700 hover:text-custom-red'}`}
                      >
                        {page}
                      </button>
                    </span>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm bg-white ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                  aria-label="Halaman berikutnya"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Post Confirmation Dialog */}
      <Dialog open={showDeletePostDialog} onOpenChange={setShowDeletePostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus artikel "{postToDelete?.title}"?
              Proses ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeletePostDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleDeletePost}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
