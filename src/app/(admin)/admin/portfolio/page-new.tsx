import { getCachedAdminPortfolioItems, getCachedAdminPortfolioCategories, getCachedAdminProjectTypes } from '@/lib/actions/admin-portfolio-actions'
import PortfolioAdminClient from '@/components/admin/portfolio/PortfolioAdminClient'

// Server-side data fetching untuk initial load
export default async function PortfolioPage() {
  try {
    // Fetch data server-side untuk initial load yang cepat
    const [portfoliosResult, categoriesResult, projectTypesResult] = await Promise.all([
      getCachedAdminPortfolioItems({ limit: 60, offset: 0 }),
      getCachedAdminPortfolioCategories(),
      getCachedAdminProjectTypes()
    ])

    const initialPortfolios = portfoliosResult.success ? portfoliosResult.data : []
    const initialCategories = categoriesResult.success ? categoriesResult.data : []
    const initialProjectTypes = projectTypesResult.success ? projectTypesResult.data : []

    return (
      <PortfolioAdminClient 
        initialPortfolios={initialPortfolios}
        initialCategories={initialCategories}
        initialProjectTypes={initialProjectTypes}
      />
    )
  } catch (error) {
    console.error('Error in PortfolioPage server component:', error)
    
    // Fallback dengan empty data
    return (
      <PortfolioAdminClient 
        initialPortfolios={[]}
        initialCategories={[]}
        initialProjectTypes={[]}
      />
    )
  }
}
