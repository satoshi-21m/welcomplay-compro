'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CategoryManager } from './CategoryManager'
import { useRouter } from 'next/navigation'

interface BlogCreateHeaderProps {
  onBack?: () => void
}

export const BlogCreateHeader = ({ onBack }: BlogCreateHeaderProps) => {
  const router = useRouter()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/admin-g30spki/blog')
    }
  }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Category Manager */}
        <CategoryManager />
      </div>
      
      <Button
        variant="ghost"
        onClick={handleBack}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-3xl transition-all duration-200 px-4 py-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>
    </div>
  )
}
