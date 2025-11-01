import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"

interface PortfolioFormActionsProps {
  isSubmitting: boolean
  onCancel: () => void
  submitText?: string
  submitIcon?: string
  loadingText?: string
}

export function PortfolioFormActions({
  isSubmitting,
  onCancel,
  submitText = "Update Portfolio",
  submitIcon = "Save",
  loadingText = "Menyimpan..."
}: PortfolioFormActionsProps) {
  const getIcon = () => {
    switch (submitIcon) {
      case "Save":
        return <Save className="h-4 w-4 mr-2" />
      default:
        return <Save className="h-4 w-4 mr-2" />
    }
  }

  return (
    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-3xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Batal
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {getIcon()}
            {submitText}
          </>
        )}
      </Button>
    </div>
  )
}
