import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBlogPost, getBlogCategoriesAdmin, addBlogCategory, deleteBlogCategory } from '@/lib/actions/admin-blog-actions'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { cleanHtmlContent } from '@/lib/utils/htmlCleaner'
import { generateSafeSlug } from '@/lib/utils'

export interface BlogCreateFormData {
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

export const useBlogCreate = () => {
  const router = useRouter()
  
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BlogCreateFormData>({
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
  
  // Category management modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  
  // Delete category confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string>('')

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // ✅ REFACTORED: Use Server Actions
  const fetchCategories = async () => {
    try {
      const result = await getBlogCategoriesAdmin()
      
      if (result.success && result.data) {
        setCategories(result.data)
      } else {
        console.error('Categories error:', result.message)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // ✅ REFACTORED: Use Server Actions
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    setIsAddingCategory(true)
    try {
      const result = await addBlogCategory(newCategory.trim())
      if (result.success) {
        setNewCategory('')
        fetchCategories() // Refresh categories
        showSuccess('Kategori berhasil ditambahkan!')
      } else {
        showError(result.message || 'Gagal menambahkan kategori')
      }
    } catch (error) {
      showError('Terjadi kesalahan saat menambahkan kategori')
    } finally {
      setIsAddingCategory(false)
    }
  }

  // Show delete confirmation dialog
  const showDeleteConfirmation = (categoryName: string) => {
    setCategoryToDelete(categoryName)
    setShowDeleteDialog(true)
  }

  // ✅ REFACTORED: Use Server Actions
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return
    
    try {
      const result = await deleteBlogCategory(categoryToDelete)
      if (result.success) {
        fetchCategories() // Refresh categories
        showSuccess('Kategori berhasil dihapus!')
        setShowDeleteDialog(false)
        setCategoryToDelete('')
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

    // Show loading toast
    const loadingToast = showLoading('Menyimpan artikel...')

    try {
      // Clean content before sending
      const cleanedContent = cleanHtmlContent(formData.content)
      
      // Create JSON data for the API
      const postData = {
        title: formData.title.trim(),
        content: cleanedContent,
        excerpt: formData.excerpt.trim(),
        status: formData.status,
        slug: formData.slug.trim(),
        category: formData.category === 'NO_CATEGORY' ? '' : formData.category,
        featuredImage: formData.featuredImage || '',
        featuredImageAlt: formData.featuredImageAlt || '',
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        metaKeywords: formData.metaKeywords || '',
        isFeatured: formData.isFeatured
      }

      console.log('🔍 Frontend - JSON data to send:', postData)

      // ✅ REFACTORED: Use Server Actions
      const result = await createBlogPost(postData)
      
      // Dismiss loading toast
      dismissToast(loadingToast)
      
      if (result.success) {
        showSuccess('Artikel berhasil disimpan!')
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push('/admin-g30spki/blog')
        }, 1000)
      } else {
        showError(result.message || 'Gagal menyimpan artikel')
      }
    } catch (error) {
      // Dismiss loading toast
      dismissToast(loadingToast)
      showError('Terjadi kesalahan saat menyimpan artikel')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Generate slug from title
  const generateSlug = () => {
    // ✅ Use utility function for consistent slug generation
    const slug = generateSafeSlug(formData.title)
    setFormData(prev => ({ ...prev, slug }))
  }

  return {
    // State
    isSubmitting,
    formData,
    categories,
    newCategory,
    isAddingCategory,
    showCategoryModal,
    showDeleteDialog,
    categoryToDelete,
    
    // Actions
    handleSubmit,
    handleInputChange,
    handleAddCategory,
    showDeleteConfirmation,
    handleDeleteCategory,
    generateSlug,
    setNewCategory,
    setShowCategoryModal,
    setShowDeleteDialog,
    
    // Navigation
    router
  }
}
