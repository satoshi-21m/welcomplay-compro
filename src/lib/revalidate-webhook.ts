/**
 * Webhook utilities untuk revalidate cache secara real-time
 * Digunakan untuk trigger revalidation dari server lain atau external sources
 */

interface RevalidatePayload {
  type: 'blog' | 'portfolio' | 'tag' | 'path' | 'all'
  slug?: string
  tags?: string[]
}

/**
 * Trigger revalidation webhook ke internal API
 * Fallback ke local revalidation jika webhook gagal
 */
export async function triggerRevalidation(payload: RevalidatePayload): Promise<boolean> {
  try {
    // Hanya trigger webhook di production (Vercel)
    if (!process.env.VERCEL_ENV && !process.env.PRODUCTION) {
      console.log('🔄 Skipping revalidation webhook (not in production)')
      return false
    }

    const secretToken = process.env.REVALIDATE_SECRET
    
    if (!secretToken) {
      console.log('⚠️ REVALIDATE_SECRET not set, skipping webhook')
      return false
    }

    // Determine the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000'

    const webhookUrl = `${baseUrl}/api/revalidate`

    console.log('🔄 Triggering revalidation webhook:', { url: webhookUrl, payload })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretToken}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Revalidation webhook failed:', response.status, errorText)
      return false
    }

    const result = await response.json()
    console.log('✅ Revalidation webhook success:', result)
    return true

  } catch (error: any) {
    console.error('❌ Revalidation webhook error:', error.message)
    return false
  }
}

/**
 * Helper functions untuk specific revalidation types
 */
export const revalidateBlog = async (slug?: string) => {
  return await triggerRevalidation({ type: 'blog', slug })
}

export const revalidatePortfolio = async (slug?: string) => {
  return await triggerRevalidation({ type: 'portfolio', slug })
}

export const revalidateByTags = async (tags: string[]) => {
  return await triggerRevalidation({ type: 'tag', tags })
}

export const revalidateAll = async () => {
  return await triggerRevalidation({ type: 'all' })
}

