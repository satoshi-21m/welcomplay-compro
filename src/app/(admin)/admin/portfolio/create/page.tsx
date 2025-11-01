import { AdminLayout } from "@/components/admin/AdminLayout"
import PageTransition from "@/components/admin/PageTransition"
import { getCachedPortfolioCategories, getCachedProjectTypes } from "@/lib/actions/portfolio-metadata-cached"
import { PortfolioCreateFormClient } from "@/components/admin/portfolio/PortfolioCreateFormClient"

export default async function CreatePortfolioPage() {
  // ⚡ OPTIMIZED: Use cached data untuk faster load
  const [catsRes, ptsRes] = await Promise.all([
    getCachedPortfolioCategories(),
    getCachedProjectTypes()
  ])
  const categories = (catsRes?.data || []).map((c: any) => ({ id: c.id, name: c.name }))
  const projectTypes = (ptsRes?.data || []).map((p: any) => ({ id: p.id, name: p.name }))

  return (
    <AdminLayout title="Buat Portfolio">
      <PageTransition>
        <PortfolioCreateFormClient categories={categories} projectTypes={projectTypes} />
      </PageTransition>
    </AdminLayout>
  )
}
