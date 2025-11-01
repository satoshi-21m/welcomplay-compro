'use server'

import { createPortfolio } from '@/lib/actions/portfolio'
import { redirect } from 'next/navigation'

export async function createPortfolioAction(formData: FormData): Promise<void> {
  const res = await createPortfolio(formData)
  if (res?.success) {
    redirect('/admin-g30spki/portfolio')
  }
  // Jangan lempar error agar tidak 500; biarkan tetap di halaman create
  console.warn('[createPortfolioAction] create failed:', res?.message)
}

export type PortfolioActionResult = { success: boolean; message?: string }

export async function createPortfolioActionState(prevState: PortfolioActionResult | undefined, formData: FormData): Promise<PortfolioActionResult> {
  'use server'
  const res = await createPortfolio(formData)
  if (res?.success) {
    return { success: true, message: 'Portfolio berhasil dibuat' }
  }
  return { success: false, message: res?.message || 'Gagal membuat portfolio' }
}


