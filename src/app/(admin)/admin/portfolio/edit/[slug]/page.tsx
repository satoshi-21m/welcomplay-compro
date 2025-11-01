"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import PageTransition from "@/components/admin/PageTransition"
import { PortfolioForm } from "@/components/admin/portfolio/PortfolioForm"
import { usePortfolioForm, PortfolioFormState } from "@/hooks/usePortfolioForm"
import { cleanHtmlContent, isEmptyHtmlContent } from "@/lib/utils/htmlCleaner"
import { useExitConfirmation } from "@/hooks/useExitConfirmation"
import { ExitConfirmation } from "@/components/ui/ExitConfirmation"
import { sanitizeSlug } from "@/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function EditPortfolioPage({ params }: PageProps) {
  const router = useRouter()
  
  // Extract slug from params promise
  const [slug, setSlug] = useState<string>('')
  
  useEffect(() => {
    const extractSlug = async () => {
      try {
        const { slug: rawSlug } = await params
        // ✅ Decode URL dan sanitize slug untuk handle special characters
        const cleanedSlug = sanitizeSlug(decodeURIComponent(rawSlug))
        setSlug(cleanedSlug)
      } catch (error) {
        console.error('Error extracting slug:', error)
        router.push('/admin-g30spki/portfolio')
      }
    }
    
    extractSlug()
  }, [params, router])

  // Use custom hook for form logic
  const {
    // Full form state
    formState,
    
    // Individual state fields for convenience
    loading,
    isSubmitting,
    hasChanges,
    id,
    
    // Actions
    setField,
    setFeaturedImage,
    setTechnologies,
    
    // Operations
    submitForm,
    resetAllStates
  } = usePortfolioForm(slug)
  
  // Use custom hook for exit confirmation logic
  const exitConfirmation = useExitConfirmation({
    hasChanges,
    onExit: () => router.push('/admin-g30spki/portfolio')
  })
  
  // Handle back navigation (delegated to custom hook)
  const handleBack = exitConfirmation.handleBack

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting || !id) return

    try {
      const success = await submitForm(id)
      if (success) {
        router.push('/admin-g30spki/portfolio')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Handle field changes
  const handleFieldChange = (field: keyof PortfolioFormState, value: any) => {
    setField(field, value)
  }

  // Handle technologies change
  const handleTechnologiesChange = (techIds: number[]) => {
    setTechnologies(techIds)
  }

  // Handle featured image change
  const handleFeaturedImageChange = (image: string) => {
    console.log('🔍 [EditPortfolioPage] Featured image changed to:', image)
    setFeaturedImage(image)
  }

  // Handle featured image remove
  const handleFeaturedImageRemove = () => {
    setFeaturedImage('')
  }



  // Note: resetAllStates is now handled inside usePortfolioForm hook
  // when slug changes, so we don't need to call it here anymore

  if (loading) {
    return (
      <AdminLayout title="Edit Portfolio">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Portfolio">
      <PageTransition>
        <PortfolioForm
          formState={formState}
          onFieldChange={handleFieldChange}
          onFeaturedImageChange={handleFeaturedImageChange}
          onFeaturedImageRemove={handleFeaturedImageRemove}
          onTechnologiesChange={handleTechnologiesChange}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      </PageTransition>
      
      {/* Exit Confirmation Dialog - Reusable Component */}
      <ExitConfirmation
        open={exitConfirmation.showDialog}
        onOpenChange={exitConfirmation.setShowDialog}
        onConfirm={exitConfirmation.handleConfirmedExit}
        onCancel={exitConfirmation.handleCancelExit}
      />
    </AdminLayout>
  )
}
