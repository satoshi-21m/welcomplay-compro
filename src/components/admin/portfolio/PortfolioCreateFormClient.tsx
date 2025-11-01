"use client"

import { useState, useCallback, useEffect } from 'react'
import { PortfolioCreateForm } from '@/components/admin/portfolio/PortfolioCreateForm'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortfolioActionState, type PortfolioActionResult } from '@/app/(admin)/admin/portfolio/actions'
import { showError, showSuccess } from '@/lib/toast'
import { useFormStatus } from 'react-dom'

interface Props {
  categories: Array<{ id: number; name: string }>
  projectTypes: Array<{ id: number; name: string }>
}

// ✅ Separate component untuk access useFormStatus (harus inside form context)
function FormContent({ formState, setField, setFeaturedImage, setTechnologies }: any) {
  const { pending } = useFormStatus()
  
  return (
    <PortfolioCreateForm
      formState={{ ...formState, isSubmitting: pending }}
      onFieldChange={setField}
      onFeaturedImageChange={setFeaturedImage}
      onFeaturedImageRemove={() => setFeaturedImage('')}
      onTechnologiesChange={setTechnologies}
      onSubmit={() => {}}
      onBack={() => history.back()}
    />
  )
}

export function PortfolioCreateFormClient({ categories, projectTypes }: Props) {
  const [actionState, formAction] = useActionState<PortfolioActionResult, FormData>(createPortfolioActionState as any, { success: false })
  const router = useRouter()
  const [formState, setFormState] = useState<any>({
    title: '',
    description: '',
    projectUrl: '',
    categoryId: '',
    projectTypeId: null,
    technologies: [] as number[],
    featuredImage: '',
    featuredImageAlt: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    isSubmitting: false,
    hasChanges: true,
  })

  const setField = useCallback((field: string, value: any) => {
    setFormState((prev: any) => ({ ...prev, [field]: value }))
  }, [])

  const setFeaturedImage = useCallback((image: string) => setField('featuredImage', image), [setField])
  const setTechnologies = useCallback((ids: number[]) => setField('technologies', ids), [setField])

  useEffect(() => {
    if (actionState?.message) {
      if (actionState.success) showSuccess(actionState.message)
      else showError(actionState.message)
    }
    if (actionState?.success) {
      router.push('/admin-g30spki/portfolio')
    }
  }, [actionState, router])

  return (
    <>
      <form action={formAction} className="space-y-4">
        <FormContent 
          formState={formState}
          setField={setField}
          setFeaturedImage={setFeaturedImage}
          setTechnologies={setTechnologies}
        />

        {/* Hidden inputs to submit to Server Action */}
        <input type="hidden" name="title" value={formState.title} />
        <input type="hidden" name="description" value={formState.description} />
        <input type="hidden" name="projectUrl" value={formState.projectUrl} />
        <input type="hidden" name="categoryId" value={String(formState.categoryId || '')} />
        <input type="hidden" name="projectTypeId" value={String(formState.projectTypeId || '')} />
        <input type="hidden" name="technologies" value={JSON.stringify(formState.technologies || [])} />
        <input type="hidden" name="featuredImage" value={formState.featuredImage} />
        <input type="hidden" name="featuredImageAlt" value={formState.featuredImageAlt} />
        <input type="hidden" name="isActive" value={String(formState.isActive)} />
        <input type="hidden" name="metaTitle" value={formState.metaTitle} />
        <input type="hidden" name="metaDescription" value={formState.metaDescription} />
        <input type="hidden" name="metaKeywords" value={formState.metaKeywords} />
      </form>
    </>
  )
}


