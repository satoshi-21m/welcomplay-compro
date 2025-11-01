"use client"

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import Link from "next/link"
import throttle from 'lodash.throttle'
import Image from "next/image"

interface PortfolioCategory {
  id: number
  name: string
  slug: string
  color?: string
  is_active: boolean
}

interface ProjectType {
  id: number
  name: string
  slug: string
  icon?: string
  color?: string
  is_active: boolean
}

interface PortfolioClientProps {
  portfolio: any[]
  categories: PortfolioCategory[]
  projectTypes: ProjectType[]
}

export function PortfolioClient({ portfolio, categories, projectTypes }: PortfolioClientProps) {
  // ⚡ Get icon component dari Lucide library (all icons supported)
  const getIconComponent = (iconName: string) => {
    // Support all Lucide icons dynamically
    return (LucideIcons as any)[iconName] || LucideIcons.Folder
  }
  
  // Sanitizer sederhana untuk konten HTML deskripsi card
  const sanitizeHtmlContent = (html: string): string => {
    if (!html) return ''
    const allowedTags = [
      'p', 'br', 'strong', 'em', 'b', 'i',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'span'
    ]
    let cleanHtml = html
    cleanHtml = cleanHtml.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    cleanHtml = cleanHtml.replace(/javascript:/gi, '')
    cleanHtml = cleanHtml.replace(/data:/gi, '')
    cleanHtml = cleanHtml.replace(/<([a-z][a-z0-9]*)([^>]*?)(?:\/>|>)/gi, (match, tag) => {
      if (allowedTags.includes(String(tag).toLowerCase())) {
        return match
      }
      return ''
    })
    return cleanHtml
  }

  // Refs untuk scroll containers
  const serviceFilterRef = useRef<HTMLDivElement>(null)
  const projectFilterRef = useRef<HTMLDivElement>(null)
  
  // State untuk mengontrol visibility scroll indicators
  const [showServiceLeftIndicator, setShowServiceLeftIndicator] = useState(false)
  const [showServiceRightIndicator, setShowServiceRightIndicator] = useState(false)
  const [showProjectLeftIndicator, setShowProjectLeftIndicator] = useState(false)
  const [showProjectRightIndicator, setShowProjectRightIndicator] = useState(false)
  
  // State untuk selected service dan project type
  const [selectedService, setSelectedService] = useState('All Services')
  const [selectedProjectType, setSelectedProjectType] = useState('All')
  const [isFiltering, setIsFiltering] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // ⚡ DYNAMIC: Function untuk check apakah category memiliki project types
  const hasProjectTypes = (categorySlug: string) => {
    if (categorySlug === 'All Services') return false
    
    // Check jika ada portfolio items dengan category ini yang punya project types
    return portfolio.some(item => 
      item.categorySlug === categorySlug && item.projectTypeName
    )
  }

  // ⚡ DYNAMIC: Function untuk get project type options berdasarkan selected category
  const getProjectTypeOptions = (categorySlug: string) => {
    if (categorySlug === 'All Services') return []
    
    // Get unique project types untuk category ini
    const projectTypeNames = new Set<string>()
    
    portfolio.forEach(item => {
      if (item.categorySlug === categorySlug && item.projectTypeName) {
        projectTypeNames.add(item.projectTypeName)
      }
    })
    
    return ['All', ...Array.from(projectTypeNames)]
  }

  // ⚡ DYNAMIC: Function untuk filter portfolio berdasarkan category dan project type
  const getFilteredPortfolio = () => {
    let filtered = portfolio
    
    // Filter by category
    if (selectedService !== 'All Services') {
      filtered = filtered.filter(item => item.categorySlug === selectedService)
    }
    
    // Filter by project type
    if (selectedProjectType !== 'All') {
      filtered = filtered.filter(item => 
        item.projectTypeName === selectedProjectType
      )
    }
    
    return filtered
  }

  // Reset project type selection ketika service berubah
  useEffect(() => {
    setSelectedProjectType('All')
  }, [selectedService])

  // Handle service change dengan loading animation
  const handleServiceChange = (serviceName: string) => {
    setIsFiltering(true)
    setSelectedService(serviceName)
    setCurrentPage(1)
    
    // Langsung update tanpa delay
    setIsFiltering(false)
  }

  // Handle project type change dengan loading animation
  const handleProjectTypeChange = (projectType: string) => {
    setIsFiltering(true)
    setSelectedProjectType(projectType)
    setCurrentPage(1)
    
    // Langsung update tanpa delay
    setIsFiltering(false)
  }

  // Get filtered portfolio
  const filteredPortfolio = getFilteredPortfolio()
  const totalPages = Math.max(1, Math.ceil(filteredPortfolio.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedPortfolio = filteredPortfolio.slice(pageStartIndex, pageStartIndex + itemsPerPage)

  // Check apakah project type filter harus ditampilkan
  const shouldShowProjectTypeFilter = selectedService !== 'All Services' && 
    hasProjectTypes(selectedService)

  // Function untuk update scroll indicators
  const updateScrollIndicators = (container: HTMLDivElement, setLeft: (show: boolean) => void, setRight: (show: boolean) => void) => {
    const { scrollLeft, scrollWidth, clientWidth } = container
    setLeft(scrollLeft > 0)
    setRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  // Auto-scroll ke filter yang aktif saat layar mengecil
  useEffect(() => {
    const handleResize = () => {
      // Auto-scroll service filter ke posisi "All Services" (index 0)
      if (serviceFilterRef.current) {
        const container = serviceFilterRef.current
        const activeButton = container.querySelector('[data-active="true"]') as HTMLElement
        if (activeButton) {
          const buttonLeft = activeButton.offsetLeft
          // Scroll ke posisi yang memungkinkan user melihat elemen di kiri
          const scrollLeft = Math.max(0, buttonLeft - 20)
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
          
          // Update indicators setelah scroll
          updateScrollIndicators(container, setShowServiceLeftIndicator, setShowServiceRightIndicator)
        }
      }

      // Auto-scroll project filter ke posisi "All" (index 0)
      if (projectFilterRef.current) {
        const container = projectFilterRef.current
        const activeButton = container.querySelector('[data-active="true"]') as HTMLElement
        if (activeButton) {
          const buttonLeft = activeButton.offsetLeft
          // Scroll ke posisi yang memungkinkan user melihat elemen di kiri
          const scrollLeft = Math.max(0, buttonLeft - 20)
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
          
          // Update indicators setelah scroll
          updateScrollIndicators(container, setShowProjectLeftIndicator, setShowProjectRightIndicator)
        }
      }
    }

    // Optimasi: Gunakan throttled resize handler
    const throttledHandleResize = throttle(handleResize, 100, { leading: true, trailing: true })

    // Initial scroll
    handleResize()

    // Add resize listener dengan throttled handler
    window.addEventListener('resize', throttledHandleResize, { passive: true })
    
    // Cleanup function yang proper
    return () => {
      window.removeEventListener('resize', throttledHandleResize)
      // Cancel throttled function
      throttledHandleResize.cancel()
    }
  }, [])

  // Scroll event handlers untuk update indicators - optimasi dengan useCallback
  const handleServiceScroll = useCallback(() => {
    if (serviceFilterRef.current) {
      updateScrollIndicators(serviceFilterRef.current, setShowServiceLeftIndicator, setShowServiceRightIndicator)
    }
  }, [])

  const handleProjectScroll = useCallback(() => {
    if (projectFilterRef.current) {
      updateScrollIndicators(projectFilterRef.current, setShowProjectLeftIndicator, setShowProjectRightIndicator)
    }
  }, [])

  // Scroll helper functions - optimasi dengan useCallback
  const scrollServiceLeft = useCallback(() => {
    if (serviceFilterRef.current) {
      serviceFilterRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }, [])

  const scrollServiceRight = useCallback(() => {
    if (serviceFilterRef.current) {
      serviceFilterRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }, [])

  const scrollProjectLeft = useCallback(() => {
    if (projectFilterRef.current) {
      projectFilterRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }, [])

  const scrollProjectRight = useCallback(() => {
    if (projectFilterRef.current) {
      projectFilterRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="bg-[#f5f6f7]">
      {/* Service Filter - 6 Layanan WELCOMPLAY */}
      <div className="mb-0">
        <div className="relative">
          {/* Scroll Buttons - Left */}
          {showServiceLeftIndicator && (
            <button
              onClick={scrollServiceLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={serviceFilterRef} 
            onScroll={handleServiceScroll}
            className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 -mx-4 justify-start"
          >
            {/* All Services Filter */}
            {[
              { slug: 'All Services', name: 'All Services', icon: Star, active: selectedService === 'All Services' },
              // ⚡ DYNAMIC: Map categories from API dengan icon dari DB
              ...categories.map(cat => {
                const IconComponent = getIconComponent((cat as any).icon || 'Globe')
                return {
                  slug: cat.slug,
                  name: cat.name,
                  icon: IconComponent,
                  active: selectedService === cat.slug
                }
              })
            ].map((service) => (
              <button
                key={service.slug}
                data-active={service.active}
                onClick={() => handleServiceChange(service.slug)}
                className={`group flex flex-col items-center gap-3 transition-all duration-300 flex-shrink-0 ${
                  service.active
                    ? 'text-custom-red'
                    : 'text-gray-600'
                }`}
              >
                {/* Circle Button - Instagram Story Style */}
                <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  service.active
                    ? 'bg-gradient-to-br from-custom-red to-red-600 shadow-md shadow-custom-red/20'
                    : 'bg-white border border-transparent hover:border-custom-red/40 hover:shadow-sm'
                }`}>
                  <service.icon className={`w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300 ${
                    service.active
                      ? 'text-white'
                      : 'text-gray-500 group-hover:text-custom-red'
                  }`} />
                  
                  {/* Active Ring Effect */}
                  {service.active && (
                    <div className="absolute inset-0 rounded-full border-4 border-custom-red/20 animate-pulse"></div>
                  )}
                </div>
                
                {/* Service Name */}
                <span className={`text-[10px] sm:text-xs font-medium text-center max-w-20 sm:max-w-24 leading-tight ${
                  service.active
                    ? 'text-custom-red'
                    : 'text-gray-600 group-hover:text-custom-red'
                }`}>
                  {service.name}
                </span>
              </button>
            ))}
          </div>

          {/* Scroll Buttons - Right */}
          {showServiceRightIndicator && (
            <button
              onClick={scrollServiceRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          )}
          
          {/* Gradient Fade Indicators - hanya kanan */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#f5f6f7] to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Project Category Filter - hanya muncul ketika layanan selain All Services dipilih */}
      <div 
        className={`mb-2 transition-all duration-500 ease-in-out transform ${
          shouldShowProjectTypeFilter
            ? 'opacity-100 max-h-96 translate-y-0' 
            : 'opacity-0 max-h-0 translate-y-4 pointer-events-none'
        }`}
      >
        <h3 className="text-sm sm:text-md font-medium text-gray-700 mt-2 sm:mt-3 mb-3 text-left">Filter by Project Type</h3>
        <div className="relative">
          {/* Scroll Buttons - Left */}
          {showProjectLeftIndicator && (
            <button
              onClick={scrollProjectLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={projectFilterRef} 
            onScroll={handleProjectScroll}
            className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 -mx-4 justify-start"
          >
            {getProjectTypeOptions(selectedService).map((projectType) => (
              <button
                key={projectType}
                onClick={() => handleProjectTypeChange(projectType)}
                className={`group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[10px] sm:text-xs font-medium transition-all duration-500 flex-shrink-0 ${
                  selectedProjectType === projectType
                    ? 'bg-custom-red text-white shadow-md shadow-custom-red/20'
                    : 'bg-white text-gray-700 border border-transparent hover:border-custom-red/40 hover:text-custom-red hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{projectType}</span>
                </div>
                
                {/* Active indicator */}
                {selectedProjectType === projectType && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-custom-red rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Scroll Buttons - Right */}
          {showProjectRightIndicator && (
            <button
              onClick={scrollProjectRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          )}
          
          {/* Gradient Fade Indicators - hanya kanan */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#f5f6f7] to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Portfolio Grid - Modern Cards */}
      {filteredPortfolio.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="text-gray-400 mb-4">
            <LucideIcons.Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada portfolio yang ditemukan</h3>
          <p className="text-gray-600 mb-6">
            Coba ubah filter atau pilih service yang berbeda
          </p>
          <button
            onClick={() => {
              handleServiceChange('All Services')
              setSelectedProjectType('All')
            }}
            className="px-6 py-3 bg-custom-red text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Loading Overlay */}
          {isFiltering && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl animate-fadeIn">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-custom-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Memfilter portfolio...</p>
              </div>
            </div>
          )}
          
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-500 ${
              isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
            key={`${selectedService}-${selectedProjectType}`}
          >
            {paginatedPortfolio.map((project, index) => {
              // Generate portfolio detail URL dengan pola yang sama seperti home page
              const portfolioSlug = project.slug || `portfolio-${project.id}`
              const portfolioUrl = `/portfolio/${portfolioSlug}`
              
              return (
                <Link
                  key={project.id}
                  href={portfolioUrl}
                  className="group relative bg-white rounded-3xl shadow-none hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 cursor-pointer block md:animate-slideUp"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                  title={`Lihat detail ${project.title}`}
                >
                {/* Project Image Container */}
                <div className="relative overflow-hidden">
                  {project.image ? (
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">Project Preview</span>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Badges (now below image) */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.projectTypeName && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {project.projectTypeName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-custom-red transition-colors duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                  <div 
                    className="blog-content prose prose-sm max-w-none text-gray-600 mb-4 leading-relaxed line-clamp-2 [&_*]:text-[14px]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(project.description) }}
                  />

                  {/* Technologies Stack */}
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.technologies) && project.technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium transition-colors duration-300 hover:bg-custom-red/10 hover:text-custom-red"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )})}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 select-none">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm bg-white ${safeCurrentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                aria-label="Halaman sebelumnya"
              >
                Prev
              </button>
              {/* Page numbers (windowed) */}
              {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(page => {
                // tampilkan halaman pertama, terakhir, current, dan +-2 dari current
                if (page === 1 || page === totalPages) return true
                return Math.abs(page - safeCurrentPage) <= 2
              }).map((page, idx, arr) => {
                const prevPage = arr[idx - 1]
                const needEllipsis = prevPage && page - prevPage > 1
                return (
                  <span key={`page-${page}`} className="flex items-center">
                    {needEllipsis && <span className="px-2 text-gray-400">…</span>}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === safeCurrentPage ? 'page' : undefined}
                      className={`px-3 py-2 rounded-lg text-sm ${page === safeCurrentPage ? 'bg-custom-red text-white' : 'bg-white text-gray-700 hover:text-custom-red'}`}
                    >
                      {page}
                    </button>
                  </span>
                )
              })}
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm bg-white ${safeCurrentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-custom-red'}`}
                aria-label="Halaman berikutnya"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
