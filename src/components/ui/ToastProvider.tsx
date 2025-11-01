'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          borderRadius: '16px',
          padding: '18px 24px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          backdropFilter: 'blur(16px)',
        },
        success: {
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#ef4444',
            color: '#fff',
            border: '1px solid #dc2626',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
          style: {
            background: '#3b82f6',
            color: '#fff',
            border: '1px solid #2563eb',
          },
        },
      }}
    />
  )
}
