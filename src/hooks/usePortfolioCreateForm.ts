import { useReducer, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { createPortfolio } from '@/lib/actions/admin-portfolio-actions'
import { cleanHtmlContent, isEmptyHtmlContent } from '@/lib/utils/htmlCleaner'

// Form State Interface
export interface PortfolioCreateFormState {
  // Basic Info
  title: string
  description: string
  categoryId: string
  projectTypeId: number | null
  projectUrl: string
  featuredImageAlt: string
  
  // Technologies
  technologies: number[]
  
  // Settings
  isActive: boolean
  
  // Media
  featuredImage: string
  
  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  
  // UI State
  isSubmitting: boolean
  hasChanges: boolean
}

// Action Types
export type PortfolioCreateFormAction =
  | { type: 'SET_FIELD'; field: keyof PortfolioCreateFormState; value: any }
  | { type: 'SET_FEATURED_IMAGE'; image: string }
  | { type: 'SET_TECHNOLOGIES'; technologies: number[] }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' }

// Initial State
const createInitialState = (): PortfolioCreateFormState => ({
  title: '',
  description: '',
  categoryId: '',
  projectTypeId: null,
  projectUrl: '',
  featuredImageAlt: '',
  technologies: [],
  isActive: true,
  featuredImage: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  isSubmitting: false,
  hasChanges: false
})

// Reducer
function portfolioCreateFormReducer(state: PortfolioCreateFormState, action: PortfolioCreateFormAction): PortfolioCreateFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        hasChanges: true
      }
    
    case 'SET_FEATURED_IMAGE':
      return {
        ...state,
        featuredImage: action.image,
        hasChanges: true
      }
    
    case 'SET_TECHNOLOGIES':
      return {
        ...state,
        technologies: action.technologies,
        hasChanges: true
      }
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      }
    
    case 'RESET_FORM':
      return createInitialState()
    
    default:
      return state
  }
}

export const usePortfolioCreateForm = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(portfolioCreateFormReducer, createInitialState())

  const setField = useCallback((field: keyof PortfolioCreateFormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const setFeaturedImage = useCallback((image: string) => {
    dispatch({ type: 'SET_FEATURED_IMAGE', image })
  }, [])

  const setTechnologies = useCallback((technologies: number[]) => {
    dispatch({ type: 'SET_TECHNOLOGIES', technologies })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!state.title.trim()) {
      showError('Judul harus diisi')
      return
    }
    
    if (isEmptyHtmlContent(state.description)) {
      showError('Deskripsi harus diisi')
      return
    }
    
    // Check description minimum length (after cleaning HTML)
    const cleanedDescription = cleanHtmlContent(state.description)
    if (cleanedDescription.length < 10) {
      showError('Deskripsi minimal 10 karakter')
      return
    }
    
    if (!state.categoryId.trim()) {
      showError('Kategori harus dipilih')
      return
    }

    if (!state.projectTypeId) {
      showError('Project type harus dipilih')
      return
    }

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })

    // Show loading toast
    const loadingToast = showLoading('Membuat portfolio...')

    try {
      const createData = {
        title: state.title,
        description: state.description,
        category_id: state.categoryId,
        project_url: state.projectUrl,
        is_active: state.isActive,
        project_type_id: state.projectTypeId,
        featured_image: state.featuredImage,
        featured_image_alt: state.featuredImageAlt,
        technologies: state.technologies,
        meta_title: state.metaTitle,
        meta_description: state.metaDescription,
        meta_keywords: state.metaKeywords
      }

      // ✅ REFACTORED: Use Server Actions
      const result = await createPortfolio(createData)

      if (result.success) {
        showSuccess('Portfolio berhasil dibuat!')
        router.replace('/portfolio')
      } else {
        showError(result.message || 'Gagal membuat portfolio')
      }
    } catch (error: any) {
      console.error('Create portfolio error:', error)
      showError('Terjadi kesalahan saat membuat portfolio')
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
      dismissToast(loadingToast)
    }
  }, [state, router])

  return {
    formState: state,
    setField,
    setFeaturedImage,
    setTechnologies,
    resetForm,
    handleSubmit
  }
}
