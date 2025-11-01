"use client"

import { Component, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return { hasError: true }
    }
    return { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚫 [AuthErrorBoundary] Auth error caught:', error, errorInfo)
    
    // Jika error terkait auth, redirect ke login
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      console.log('🚫 [AuthErrorBoundary] Redirecting to login due to auth error')
      // Gunakan window.location untuk bypass React Router
      window.location.href = '/admin-g30spki/login'
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI ketika terjadi auth error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Akses Ditolak
            </h1>
            <p className="text-gray-600 mb-6">
              Sesi Anda telah berakhir atau tidak valid.
            </p>
            <button
                onClick={() => window.location.href = '/admin-g30spki/login'}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
