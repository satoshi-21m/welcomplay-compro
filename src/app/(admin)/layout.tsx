import { AuthProvider } from "@/contexts/AuthContext"
import { Metadata } from 'next'

// ✅ Metadata API untuk App Router (menggantikan next/head)
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  }
}

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}


