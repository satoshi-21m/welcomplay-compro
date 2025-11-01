'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

// ⚡ OPTIMIZED: Lazy load RichTextEditor untuk faster initial page load
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false, // Disable SSR untuk editor (client-only)
  loading: () => (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
      <div className="p-4 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Memuat editor...</p>
        </div>
      </div>
    </div>
  )
})

type RichTextEditorProps = ComponentProps<typeof RichTextEditor>

export default function DynamicRichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditor {...props} />
}

