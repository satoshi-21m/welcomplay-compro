import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { getAdminBlogPostBySlug, updateBlogPostBySlug, getBlogCategoriesAdmin, addBlogCategory, deleteBlogCategory } from '@/lib/actions/admin-blog-actions'
import { generateSafeSlug } from '@/lib/utils'

export interface BlogFormData {
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featuredImage: string
  featuredImageAlt: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  isFeatured: boolean
}

export interface Category {
  name: string
  post_count: number
}

export const useBlogEdit = (slug: string) => {
  const router = useRouter()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    category: 'NO_CATEGORY',
    status: 'DRAFT',
    featuredImage: '',
    featuredImageAlt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    isFeatured: false
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // ✅ REFACTORED: Use Server Actions instead of API
  const fetchPost = async () => {
    console.log('🔍 Frontend - Fetching post with slug:', slug)
    try {
      const result = await getAdminBlogPostBySlug(slug)
      console.log('🔍 Frontend - Server Action result:', result)
      
      if (result.success && result.data) {
        const postData = result.data
        console.log('🔍 Frontend - Post data received:', postData)
        console.log('🔍 Frontend - Post category:', postData.category, 'Type:', typeof postData.category)
        
        const newFormData: BlogFormData = {
          title: postData.title || '',
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          status: postData.status || 'DRAFT',
          slug: postData.slug || '',
          category: postData.category || 'NO_CATEGORY',
          featuredImage: postData.featuredImage || '',
          featuredImageAlt: postData.featuredImageAlt || '',
          metaTitle: postData.metaTitle || '',
          metaDescription: postData.metaDescription || '',
          metaKeywords: postData.metaKeywords || '',
          isFeatured: postData.isFeatured || false
        }
        
        console.log('🔍 Frontend - Setting new formData:', newFormData)
        setFormData(newFormData)
      } else {
        console.error('🔍 Frontend - Post not found or failed to fetch')
        showError('Artikel tidak ditemukan')
        setTimeout(() => {
          router.push('/admin-g30spki/blog')
        }, 2000)
      }
    } catch (error) {
      console.error('🔍 Frontend - Error fetching post:', error)
      showError('Gagal memuat artikel')
      setTimeout(() => {
        router.push('/admin-g30spki/blog')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  // ✅ REFACTORED: Use Server Actions
  const fetchCategories = async () => {
    try {
      console.log('🔍 Frontend - Fetching categories via Server Action')
      
      const result = await getBlogCategoriesAdmin()
      console.log('🔍 Frontend - Categories result:', result)
      
      if (result.success && result.data) {
        console.log('🔍 Frontend - Setting categories:', result.data)
        setCategories(result.data)
      } else {
        console.error('🔍 Frontend - Categories error:', result.message)
      }
    } catch (error) {
      console.error('🔍 Frontend - Error fetching categories:', error)
    }
  }

  // ✅ REFACTORED: Use Server Actions
  const handleAddCategory = async () => {
    console.log('🔍 Frontend - handleAddCategory called')
    console.log('🔍 Frontend - newCategory value:', newCategory)
    
    if (!newCategory.trim()) {
      console.log('🔍 Frontend - newCategory is empty, returning early')
      return
    }
    
    setIsAddingCategory(true)
    try {
      const result = await addBlogCategory(newCategory.trim())
      console.log('🔍 Frontend - Add category result:', result)
      
      if (result.success) {
        setNewCategory('')
        fetchCategories() // Refresh categories
        showSuccess('Kategori berhasil ditambahkan!')
      } else {
        showError(result.message || 'Gagal menambahkan kategori')
      }
    } catch (error) {
      console.error('🔍 Frontend - Error adding category:', error)
      showError('Terjadi kesalahan saat menambahkan kategori')
    } finally {
      setIsAddingCategory(false)
    }
  }

  // ✅ REFACTORED: Use Server Actions
  const handleDeleteCategory = async (categoryName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) return
    
    try {
      const result = await deleteBlogCategory(categoryName)
      if (result.success) {
        fetchCategories() // Refresh categories
        showSuccess('Kategori berhasil dihapus!')
      } else {
        showError(result.message || 'Gagal menghapus kategori')
      }
    } catch (error) {
      showError('Terjadi kesalahan saat menghapus kategori')
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Debug logging
    console.log('🔍 Frontend - Form submission started')
    console.log('🔍 Frontend - Current formData:', formData)
    console.log('🔍 Frontend - Category value:', formData.category, 'Type:', typeof formData.category)
    
    // Client-side validation
    if (!formData.title.trim()) {
      showError('Judul harus diisi')
      setIsSubmitting(false)
      return
    }
    
    if (!formData.content.trim()) {
      showError('Konten harus diisi')
      setIsSubmitting(false)
      return
    }
    
    if (!formData.slug.trim()) {
      showError('Slug harus diisi')
      setIsSubmitting(false)
      return
    }
    
    // Show loading toast
    const loadingToast = showLoading('Mengupdate artikel...')
    
    try {
      // ✅ REFACTORED: Use Server Actions
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        status: formData.status,
        newSlug: formData.slug.trim(),
        category: formData.category,
        featuredImage: formData.featuredImage || '',
        featuredImageAlt: formData.featuredImageAlt || '',
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        metaKeywords: formData.metaKeywords || '',
        isFeatured: formData.isFeatured
      }

      console.log('🔍 Frontend - Data to send:', postData)
      console.log('🔍 Frontend - Slug parameter:', slug)

      const result = await updateBlogPostBySlug(slug, postData)
      
      // Dismiss loading toast
      dismissToast(loadingToast)
      
      if (result.success) {
        showSuccess('Artikel berhasil diupdate!')
        
        // Redirect ke halaman admin blog setelah berhasil
        setTimeout(() => {
          router.push('/admin-g30spki/blog')
        }, 1500)
      } else {
        showError(result.message || 'Gagal mengupdate artikel')
      }
    } catch (error) {
      // Dismiss loading toast
      dismissToast(loadingToast)
      showError('Terjadi kesalahan saat mengupdate artikel')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    console.log('🔍 Frontend - handleInputChange called:', { field, value, type: typeof value })
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('🔍 Frontend - New formData after change:', newData)
      return newData
    })
  }

  // Generate slug from title
  const generateSlug = () => {
    // ✅ Use utility function for consistent slug generation
    const slug = generateSafeSlug(formData.title)
    setFormData(prev => ({ ...prev, slug }))
  }

  // Initialize data on mount
  useEffect(() => {
    fetchPost()
    fetchCategories()
  }, [slug, router])

  return {
    // State
    loading,
    isSubmitting,
    formData,
    categories,
    newCategory,
    isAddingCategory,
    
    // Actions
    handleSubmit,
    handleInputChange,
    handleAddCategory,
    handleDeleteCategory,
    generateSlug,
    setNewCategory,
    
    // Navigation
    router
  }
}
