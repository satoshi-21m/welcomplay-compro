import { useReducer, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { getAdminPortfolioBySlug, updatePortfolioBySlug } from '@/lib/actions/admin-portfolio-actions'

// Form State Interface
export interface PortfolioFormState {
  // Portfolio ID
  id: number
  
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
  loading: boolean
  isSubmitting: boolean
  hasChanges: boolean
}

// Action Types
export type PortfolioFormAction =
  | { type: 'SET_FIELD'; field: keyof PortfolioFormState; value: any }
  | { type: 'SET_FEATURED_IMAGE'; image: string }
  | { type: 'SET_TECHNOLOGIES'; technologies: number[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_HAS_CHANGES'; hasChanges: boolean }
  | { type: 'LOAD_PORTFOLIO'; portfolio: any }
  | { type: 'RESET_FORM' }
  | { type: 'RESET_UI_STATE' }

// Initial State - moved inside hook to avoid reference issues
const createInitialState = (): PortfolioFormState => ({
  id: 0,
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
  loading: true,
  isSubmitting: false,
  hasChanges: false
})

// Reducer
function portfolioFormReducer(state: PortfolioFormState, action: PortfolioFormAction): PortfolioFormState {
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
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading
      }
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      }
    
    case 'SET_HAS_CHANGES':
      return {
        ...state,
        hasChanges: action.hasChanges
      }
    
    case 'LOAD_PORTFOLIO':
      return {
        ...state,
        id: action.portfolio.id,
        title: action.portfolio.title,
        description: action.portfolio.description,
        categoryId: action.portfolio.category_id !== null && action.portfolio.category_id !== undefined
          ? String(action.portfolio.category_id)
          : '',
        projectTypeId: action.portfolio.project_type_id ?? null,
        projectUrl: action.portfolio.project_url,
        featuredImageAlt: action.portfolio.featured_image_alt,
        technologies: action.portfolio.technologies,
        isActive: action.portfolio.is_active,
        featuredImage: action.portfolio.featured_image,
        metaTitle: action.portfolio.meta_title,
        metaDescription: action.portfolio.meta_description,
        metaKeywords: action.portfolio.meta_keywords,
        loading: false,
        hasChanges: false
      }
    
    case 'RESET_FORM':
      return {
        ...createInitialState(),
        loading: false
      }
    
    case 'RESET_UI_STATE':
      return {
        ...state,
        loading: false,
        isSubmitting: false,
        hasChanges: false
      }
    
    default:
      return state
  }
}

// Custom Hook
export function usePortfolioForm(slug: string) {
  const [state, dispatch] = useReducer(portfolioFormReducer, createInitialState())
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)
  const hasFetchedRef = useRef(false)

  // Action Creators
  const setField = useCallback((field: keyof PortfolioFormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const setFeaturedImage = useCallback((image: string) => {
    dispatch({ type: 'SET_FEATURED_IMAGE', image })
  }, [])

  const setTechnologies = useCallback((technologies: number[]) => {
    console.log('🔍 [usePortfolioForm] setTechnologies called with:', technologies)
    dispatch({ type: 'SET_TECHNOLOGIES', technologies })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', loading })
  }, [])

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const resetUIState = useCallback(() => {
    dispatch({ type: 'RESET_UI_STATE' })
  }, [])

  // ✅ REFACTORED: Use Server Actions
  const fetchPortfolio = async () => {
    if (!slug || hasFetchedRef.current) return

    try {
      setLoading(true)
      
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      const result = await getAdminPortfolioBySlug(slug)
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return
      }
      
      if (result.success && result.data) {
        const portfolioData = result.data
        dispatch({ type: 'LOAD_PORTFOLIO', portfolio: portfolioData })
        hasFetchedRef.current = true
      } else {
        showError(result.message || 'Gagal memuat portfolio')
        setLoading(false)
      }
      
    } catch (error: any) {
      // Ignore aborted requests
      if (error.name === 'AbortError') {
        return
      }
      
      console.error('Error fetching portfolio:', error)
      showError('Gagal memuat portfolio')
      setLoading(false)
    }
  }

  // Submit Form
  const submitForm = useCallback(async (portfolioId: number) => {
    let loadingToast: string | null = null
    
    try {
      setSubmitting(true)
      
      // Client-side validation
      if (!state.title.trim()) {
        showError('Judul portfolio harus diisi')
        return false
      }
      
      if (!state.description.trim()) {
        showError('Deskripsi portfolio harus diisi')
        return false
      }
      
      if (!state.categoryId) {
        showError('Kategori harus dipilih')
        return false
      }
      
      if (!state.projectTypeId) {
        showError('Tipe project harus dipilih')
        return false
      }
      
      // Technology validation removed
      
      // Show loading toast
      loadingToast = showLoading('Mengupdate portfolio...')
      
      // ✅ REFACTORED: Use Server Actions
      const updateData = {
        title: state.title,
        description: state.description,
        category_id: state.categoryId,
        project_type_id: state.projectTypeId,
        project_url: state.projectUrl,
        featured_image_alt: state.featuredImageAlt,
        is_active: state.isActive,
        featured_image: state.featuredImage,
        meta_title: state.metaTitle,
        meta_description: state.metaDescription,
        meta_keywords: state.metaKeywords,
        technologies: state.technologies
      }
      
      console.log('🔍 [Frontend] Update data to send:', updateData)
      console.log('🔍 [Frontend] Technologies array:', state.technologies)
      
      const result = await updatePortfolioBySlug(slug, updateData)
      
      if (result.success) {
        showSuccess('Portfolio berhasil diupdate!')
        dispatch({ type: 'SET_HAS_CHANGES', hasChanges: false })
        return true
      } else {
        showError(result.message || 'Gagal mengupdate portfolio')
        return false
      }
      
    } catch (error: any) {
      showError('Terjadi kesalahan saat mengupdate portfolio')
      return false
    } finally {
      setSubmitting(false)
      if (loadingToast) {
        dismissToast(loadingToast)
      }
    }
  }, [state, slug])

  // Reset all states
  const resetAllStates = useCallback(() => {
    resetForm()
    resetUIState()
    hasFetchedRef.current = false
    
    // Cancel ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [resetForm, resetUIState])

  // Fetch portfolio when slug changes
  useEffect(() => {
    if (slug) {
      // Reset hasFetched flag and cancel ongoing requests
      hasFetchedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      // Fetch new portfolio data
      fetchPortfolio()
    }
  }, [slug]) // Remove fetchPortfolio from dependencies to avoid infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    // Full form state
    formState: state,
    
    // Individual state fields for convenience
    ...state,
    
    // Actions
    setField,
    setFeaturedImage,
    setTechnologies,
    setLoading,
    setSubmitting,
    resetForm,
    resetUIState,
    resetAllStates,
    
    // Operations
    fetchPortfolio,
    submitForm,
    
    // Refs
    abortControllerRef,
    hasFetchedRef
  }
}
