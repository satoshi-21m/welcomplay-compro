import { Button } from '@/components/ui/button'
import { BookOpen, Plus } from 'lucide-react'

interface BlogEmptyStateProps {
  onCreatePost: () => void
}

export const BlogEmptyState = ({ onCreatePost }: BlogEmptyStateProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-sm border border-slate-100">
      <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">
        Belum ada artikel
      </h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        Mulai dengan membuat artikel blog pertama Anda untuk membagikan pengetahuan dan pengalaman
      </p>
      <Button 
        onClick={onCreatePost}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tulis Artikel Pertama
      </Button>
    </div>
  )
}
