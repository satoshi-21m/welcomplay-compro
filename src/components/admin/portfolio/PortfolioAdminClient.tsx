'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from 'swr'
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Briefcase,
  Code,
  Star,
  Archive,
  Loader2
} from "lucide-react"
import { showSuccess, showError, showLoading, dismissToast } from "@/lib/toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deletePortfolio } from "@/lib/actions/admin-portfolio-actions"
import { extractPlainText } from "@/lib/utils/htmlCleaner"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate, getImageUrl } from "@/lib/utils"
import { PortfolioCategoryManager } from "./PortfolioCategoryManager"

interface PortfolioItem {
  id: number
  title: string
  slug: string
  description: string
  imageUrl?: string
  featuredImage?: string
  featuredImageAlt?: string
  projectUrl?: string
  categoryId?: number
  categoryName?: string
  categorySlug?: string
  projectTypeId?: number
  projectTypeName?: string
  projectTypeSlug?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  category_name?: string
  category_slug?: string
  category_color?: string
  project_type_name?: string
  project_type_slug?: string
  project_type_icon?: string
  project_type_color?: string
  technologies: number[]
  technologyNames: string[]
  technologySlugs: string[]
  technologyObjects?: Array<{
    id: number
    name: string
    slug: string
    color: string
  }>
}

interface PortfolioCategory {
  id: number
  name: string
  slug: string
  description: string
  color: string
  is_active: boolean
  sort_order: number
}

interface ProjectType {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  is_active: boolean
  sort_order: number
}

interface PortfolioAdminClientProps {
  initialPortfolios: PortfolioItem[]
  initialCategories: PortfolioCategory[]
  initialProjectTypes: ProjectType[]
}

// SWR fetcher functions
const fetchers = {
  portfolios: async () => {
    const response = await fetch('/api/admin/portfolio/items', { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch portfolios')
    const data = await response.json()
    return data.portfolios || []
  },
  categories: async () => {
    const response = await fetch('/api/admin/portfolio/categories', { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.data || []
  },
  projectTypes: async () => {
    const response = await fetch('/api/admin/portfolio/project-types', { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch project types')
    const data = await response.json()
    return data.data || []
  }
}

export default function PortfolioAdminClient({ 
  initialPortfolios, 
  initialCategories, 
  initialProjectTypes 
}: PortfolioAdminClientProps) {
  const router = useRouter()
  
  // ⚡ OPTIMIZED: SWR dengan minimal revalidation untuk performa optimal
  const { data: portfolioItems = initialPortfolios, mutate: mutatePortfolios, isLoading: portfoliosLoading } = useSWR(
    'admin-portfolio-items',
    fetchers.portfolios,
    {
      fallbackData: initialPortfolios,
      refreshInterval: 0,              // ✅ Disable auto-refresh
      revalidateOnFocus: false,        // ✅ Disable on tab focus
      revalidateOnReconnect: false,    // ✅ Disable on network reconnect
      revalidateIfStale: false,        // ✅ Don't revalidate if data exists
      dedupingInterval: 60000,         // ✅ Increase to 1 minute
    }
  )

  const { data: categories = initialCategories, mutate: mutateCategories, isLoading: categoriesLoading } = useSWR(
    'admin-portfolio-categories',
    fetchers.categories,
    {
      fallbackData: initialCategories,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    }
  )

  const { data: projectTypes = initialProjectTypes, mutate: mutateProjectTypes, isLoading: projectTypesLoading } = useSWR(
    'admin-portfolio-project-types',
    fetchers.projectTypes,
    {
      fallbackData: initialProjectTypes,
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    }
  )

  // Local state untuk filtering dan pagination
  const [filteredPortfolioItems, setFilteredPortfolioItems] = useState<PortfolioItem[]>(initialPortfolios)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  
  // Delete confirmation states
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null)

  const { isAuthenticated } = useAuth()

  // Filter portfolio items when data changes
  useEffect(() => {
    let filtered = portfolioItems

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item: PortfolioItem) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((item: PortfolioItem) => 
        statusFilter === 'ACTIVE' ? item.isActive : !item.isActive
      )
    }

    // Apply category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((item: PortfolioItem) => {
        // Match by slug, name, or ID
        if (item.categorySlug === categoryFilter) return true
        if (item.categoryName === categoryFilter) return true
        if (item.categoryId && String(item.categoryId) === categoryFilter) return true
        
        // Fallback: lookup in categories list
        const cat = categories.find((c: PortfolioCategory) => 
          c.slug === categoryFilter || String(c.id) === categoryFilter
        )
        if (cat) {
          return item.categoryId === cat.id || 
                 item.categorySlug === cat.slug ||
                 item.categoryName === cat.name
        }
        
        return false
      })
    }

    // Apply project type filter
    if (projectTypeFilter !== 'ALL') {
      filtered = filtered.filter((item: PortfolioItem) => {
        // Match by slug, name, or ID
        if (item.projectTypeSlug === projectTypeFilter) return true
        if (item.projectTypeName === projectTypeFilter) return true
        if (item.projectTypeId && String(item.projectTypeId) === projectTypeFilter) return true
        
        // Fallback: lookup in project types list
        const pt = projectTypes.find((t: ProjectType) => 
          t.slug === projectTypeFilter || String(t.id) === projectTypeFilter
        )
        if (pt) {
          return item.projectTypeId === pt.id || 
                 item.projectTypeSlug === pt.slug ||
                 item.projectTypeName === pt.name
        }
        
        return false
      })
    }

    setFilteredPortfolioItems(filtered)
    setCurrentPage(1) // Reset pagination when filters change
  }, [portfolioItems, searchTerm, statusFilter, categoryFilter, projectTypeFilter, projectTypes])

  // Pagination logic
  const totalPages = Math.ceil(filteredPortfolioItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPortfolioItems = filteredPortfolioItems.slice(startIndex, endIndex)

  const openDeleteDialog = (id: number, title: string) => {
    setDeleteTarget({ id, title })
    setIsDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setDeletingId(id)
    const loadingToast = showLoading('Menghapus portfolio...')

    try {
      const result = await deletePortfolio(id.toString())
      dismissToast(loadingToast)
      if (result.success) {
        showSuccess('Portfolio berhasil dihapus!')
        mutatePortfolios() // Refresh portfolios dengan SWR
        setIsDeleteAlertOpen(false)
        setDeleteTarget(null)
      } else {
        showError(result.message || 'Gagal menghapus portfolio')
      }
    } catch (error) {
      dismissToast(loadingToast)
      showError('Terjadi kesalahan saat menghapus portfolio')
    } finally {
      setDeletingId(null)
    }
  }

  // Function untuk styling teknologi
  const getTechnologyBadgeStyle = (color: string) => {
    return {
      backgroundColor: color,
      color: '#FFFFFF',
      border: `1px solid ${color}`,
      boxShadow: `0 2px 4px ${color}40`,
      transition: 'all 0.2s ease-in-out'
    }
  }

  return (
    <AdminLayout 
      title="Kelola Portfolio"
      showSearch={true}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari portfolio..."
    >
      <div className="space-y-4 p-2">
        {/* Header dengan Stats Cards */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Left Side - Stats Cards */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center">
              {/* Stats Row - More Compact on Desktop */}
              <div className="grid grid-cols-3 gap-1.5 lg:gap-1.5 flex-shrink-0">
                {/* Total Portfolio */}
                <div
                  className={`rounded-lg lg:rounded-lg p-2 lg:p-1.5 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'ALL'
                      ? 'bg-red-50 border-red-300 shadow-sm ring-1 ring-red-200'
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 lg:gap-1">
                      <div className={`w-4 h-4 lg:w-4 lg:h-4 rounded flex items-center justify-center ${
                        statusFilter === 'ALL' ? 'bg-red-200' : 'bg-red-100'
                      }`}>
                        <Briefcase className={`h-2 w-2 lg:h-2 lg:w-2 ${
                          statusFilter === 'ALL' ? 'text-red-700' : 'text-red-600'
                        }`} />
                      </div>
                      <span className={`text-[10px] lg:text-[11px] font-medium ${
                        statusFilter === 'ALL' ? 'text-red-700' : 'text-gray-600'
                      }`}>Total</span>
                    </div>
                    <span className={`text-xs lg:text-xs font-bold ml-1.5 lg:ml-2 ${
                      statusFilter === 'ALL' ? 'text-red-700' : 'text-red-600'
                    }`}>
                      {portfoliosLoading ? '...' : filteredPortfolioItems.length}
                    </span>
                  </div>
                </div>

                {/* Active Portfolio */}
                <div
                  className={`rounded-lg lg:rounded-lg p-2 lg:p-1.5 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'ACTIVE'
                      ? 'bg-green-50 border-green-300 shadow-sm ring-1 ring-green-200'
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('ACTIVE')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 lg:gap-1">
                      <div className={`w-4 h-4 lg:w-4 lg:h-4 rounded flex items-center justify-center ${
                        statusFilter === 'ACTIVE' ? 'bg-green-200' : 'bg-green-100'
                      }`}>
                        <Eye className={`h-2 w-2 lg:h-2 lg:w-2 ${
                          statusFilter === 'ACTIVE' ? 'text-green-700' : 'text-green-600'
                        }`} />
                      </div>
                      <span className={`text-[10px] lg:text-[11px] font-medium ${
                        statusFilter === 'ACTIVE' ? 'text-green-700' : 'text-gray-600'
                      }`}>Active</span>
                    </div>
                    <span className={`text-xs lg:text-xs font-bold ml-1.5 lg:ml-2 ${
                      statusFilter === 'ACTIVE' ? 'text-green-700' : 'text-green-600'
                    }`}>
                      {portfoliosLoading ? '...' : portfolioItems.filter((p: PortfolioItem) => p.isActive).length}
                    </span>
                  </div>
                </div>

                {/* Inactive Portfolio */}
                <div
                  className={`rounded-lg lg:rounded-lg p-2 lg:p-1.5 border cursor-pointer transition-all duration-200 ${
                    statusFilter === 'INACTIVE'
                      ? 'bg-yellow-50 border-yellow-300 shadow-sm ring-1 ring-yellow-200'
                      : 'bg-gray-50 border-gray-200 hover:shadow-sm hover:bg-gray-100'
                  }`}
                  onClick={() => setStatusFilter('INACTIVE')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 lg:gap-1">
                      <div className={`w-4 h-4 lg:w-4 lg:h-4 rounded flex items-center justify-center ${
                        statusFilter === 'INACTIVE' ? 'bg-yellow-200' : 'bg-yellow-100'
                      }`}>
                        <Archive className={`h-2 w-2 lg:h-2 lg:w-2 ${
                          statusFilter === 'INACTIVE' ? 'text-yellow-700' : 'text-yellow-600'
                        }`} />
                      </div>
                      <span className={`text-[10px] lg:text-[11px] font-medium ${
                        statusFilter === 'INACTIVE' ? 'text-yellow-700' : 'text-gray-600'
                      }`}>Inactive</span>
                    </div>
                    <span className={`text-xs lg:text-xs font-bold ml-1.5 lg:ml-2 ${
                      statusFilter === 'INACTIVE' ? 'text-yellow-700' : 'text-yellow-600'
                    }`}>
                      {portfoliosLoading ? '...' : portfolioItems.filter((p: PortfolioItem) => p.isActive === false).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Filters and Button */}
            <div className="flex flex-row gap-1 lg:gap-3 items-center">
              {/* Category Manager Button */}
              <PortfolioCategoryManager onUpdate={() => {
                mutateCategories()
                mutateProjectTypes()
                mutatePortfolios()
              }} />
              
              {/* Category Filter */}
              <div className="flex-shrink-0">
                <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={categoriesLoading}>
                  <SelectTrigger className="w-32 sm:w-[220px] bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-300 text-xs sm:text-sm">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="ALL" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                      <span className="sm:hidden">Kategori</span>
                      <span className="hidden sm:inline">Semua Kategori</span>
                    </SelectItem>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled className="rounded-lg">
                        <span className="text-gray-400">Loading...</span>
                      </SelectItem>
                    ) : (
                      categories.map((cat: PortfolioCategory) => (
                        <SelectItem 
                          key={cat.id} 
                          value={cat.slug} 
                          className="rounded-xl bg-blue-50/30 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700"
                        >
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Type Filter */}
              <div className="flex-shrink-0">
                <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter} disabled={projectTypesLoading}>
                  <SelectTrigger className="w-28 sm:w-[180px] bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-300 text-xs sm:text-sm">
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="ALL" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">
                      <span className="sm:hidden">Type</span>
                      <span className="hidden sm:inline">Semua Type</span>
                    </SelectItem>
                    {projectTypesLoading ? (
                      <SelectItem value="loading" disabled className="rounded-lg">
                        <span className="text-gray-400">Loading...</span>
                      </SelectItem>
                    ) : (
                      projectTypes.map((pt: ProjectType) => (
                        <SelectItem 
                          key={pt.id} 
                          value={pt.slug} 
                          className="rounded-xl bg-green-50/30 hover:bg-green-50 focus:bg-green-50 focus:text-green-700"
                        >
                          {pt.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => router.push('/admin-g30spki/portfolio/create')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-5 py-2 flex-shrink-0 text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Portfolio</span>
                <span className="hidden sm:inline">Tambah Portfolio</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio List */}
        {portfoliosLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat portfolio...</p>
          </div>
        ) : paginatedPortfolioItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada portfolio</h3>
            <p className="text-gray-600 mb-6">Mulai dengan membuat portfolio pertama Anda</p>
            <Button 
              onClick={() => router.push('/admin-g30spki/portfolio/create')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Portfolio Pertama
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {paginatedPortfolioItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Header with Status */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={item.isActive ? "default" : "secondary"}
                      className={`text-xs px-3 py-1 rounded-full ${
                        item.isActive
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {item.isActive ? '🟢 Active' : '⚪ Inactive'}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin-g30spki/portfolio/edit/${item.slug}`)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {item.projectUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.projectUrl, '_blank')}
                          className="h-8 w-8 p-0 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(item.id, item.title)}
                        disabled={deletingId === item.id}
                        className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Image */}
                    <div className="lg:w-48 lg:h-32 w-full h-48 flex-shrink-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                        {item.featuredImage ? (
                          <img
                            src={getImageUrl(item.featuredImage)}
                            alt={item.featuredImageAlt || item.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Briefcase className="h-8 w-8 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500 font-medium">No Image</p>
                              <p className="text-xs text-gray-400">Upload featured image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 space-y-4">
                      {/* Description */}
                      <div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {extractPlainText(item.description) || 'Tidak ada deskripsi project...'}
                        </p>
                      </div>

                      {/* Meta Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{formatDate(item.createdAt)}</span>
                        </div>
                        
                        {item.categoryName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Code className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{item.categoryName}</span>
                          </div>
                        )}
                        
                        {item.projectTypeName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{item.projectTypeName}</span>
                          </div>
                        )}
                      </div>

                      {/* Technologies */}
                      {item.technologyNames && item.technologyNames.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600 font-medium">Teknologi:</span>
                          {item.technologyNames.map((techName, index) => {
                            const tech = item.technologyObjects?.[index]
                            const techColor = tech?.color || '#6B7280'
                            
                            return (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-1 transition-all duration-200 hover:scale-105"
                                style={getTechnologyBadgeStyle(techColor)}
                              >
                                {techName}
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info and Controls */}
        {filteredPortfolioItems.length > 0 && (
          <div className="mt-8 space-y-4">
            {/* Pagination Info */}
            <div className="text-center text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredPortfolioItems.length)} dari {filteredPortfolioItems.length} portfolio
              {totalPages > 1 && ` (Halaman ${currentPage} dari ${totalPages})`}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm bg-white ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                  aria-label="Halaman sebelumnya"
                >
                  Prev
                </button>
                {/* Page numbers (windowed) */}
                {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(page => {
                  if (page === 1 || page === totalPages) return true
                  return Math.abs(page - currentPage) <= 2
                }).map((page, idx, arr) => {
                  const prevPage = arr[idx - 1]
                  const needEllipsis = prevPage && page - prevPage > 1
                  return (
                    <span key={`page-${page}`} className="flex items-center">
                      {needEllipsis && <span className="px-2 text-gray-400">…</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`px-3 py-2 rounded-lg text-sm ${page === currentPage ? 'bg-custom-red text-white' : 'bg-white text-gray-700 hover:text-custom-red'}`}
                      >
                        {page}
                      </button>
                    </span>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm bg-white ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                  aria-label="Halaman berikutnya"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Global Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-white/90 backdrop-blur-md shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-red-700">
              Hapus Portfolio
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus portfolio
              {deleteTarget ? (
                <>
                  {" "}
                  <span className="font-semibold text-red-600">"{deleteTarget.title}"</span>?
                </>
              ) : '?' }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl border-0 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-2xl bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
