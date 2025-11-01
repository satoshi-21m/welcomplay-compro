import { useState, useCallback } from 'react'

interface UseExitConfirmationProps {
  hasChanges: boolean
  onExit: () => void
}

export const useExitConfirmation = ({ hasChanges, onExit }: UseExitConfirmationProps) => {
  const [showDialog, setShowDialog] = useState(false)
  
  const handleBack = useCallback(() => {
    if (hasChanges) {
      setShowDialog(true)
    } else {
      onExit()
    }
  }, [hasChanges, onExit])
  
  const handleConfirmedExit = useCallback(() => {
    setShowDialog(false)
    onExit()
  }, [onExit])
  
  const handleCancelExit = useCallback(() => {
    setShowDialog(false)
  }, [])
  
  return {
    showDialog,
    handleBack,
    handleConfirmedExit,
    handleCancelExit,
    setShowDialog
  }
}
