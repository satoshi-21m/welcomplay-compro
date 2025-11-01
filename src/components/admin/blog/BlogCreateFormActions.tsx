import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface BlogCreateFormActionsProps {
  isSubmitting: boolean
}

export const BlogCreateFormActions = ({
  isSubmitting
}: BlogCreateFormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2 font-semibold"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Simpan Artikel
          </>
        )}
      </Button>
    </div>
  )
}
