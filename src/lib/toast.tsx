import toast from 'react-hot-toast'

// Success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  })
}

// Error toast
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  })
}

// Loading toast
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  })
}

// Dismiss toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

// Success toast dengan auto-dismiss
export const showSuccessAuto = (message: string, duration: number = 3000) => {
  toast.success(message, {
    duration,
    position: 'top-right',
  })
}

// Error toast dengan auto-dismiss
export const showErrorAuto = (message: string, duration: number = 4000) => {
  toast.error(message, {
    duration,
    position: 'top-right',
  })
}

// Info toast
export const showInfo = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#ffffff',
    },
  })
}

// Warning toast
export const showWarning = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#ffffff',
    },
  })
}
