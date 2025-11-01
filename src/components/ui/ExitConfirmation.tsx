import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ExitConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export const ExitConfirmation: React.FC<ExitConfirmationProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Konfirmasi Keluar",
  description = "Ada perubahan yang belum disimpan. Yakin ingin keluar? Semua perubahan akan hilang.",
  confirmText = "Keluar Tanpa Simpan",
  cancelText = "Batal"
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-0 bg-white shadow-xl max-w-md">
                  <AlertDialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
          
          <AlertDialogFooter className="gap-3 pt-4">
            <AlertDialogCancel 
              onClick={onCancel}
              className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 px-4 py-2 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200 px-4 py-2 flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
