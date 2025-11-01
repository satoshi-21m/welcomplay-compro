"use client"

import { BlogPost } from "../../types/blog"
import Link from "next/link"
import Image from "next/image"
import { CategoryList } from "../../components/blog/CategoryList"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../components/animations"
import { useState, useEffect, useMemo, useCallback } from "react"
import { BlogSkeleton, BlogSidebarSkeleton, BlogMobileSkeleton } from "../../components/ui/BlogSkeleton"

interface BlogSearchClientProps {
  initialPosts: BlogPost[]
  initialCategories: Array<{ id: number; name: string; post_count?: number }>
}

export function BlogSearchClient({ 
  initialPosts, 
  initialCategories
}: BlogSearchClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [categories] = useState<Array<{ id: number; name: string; post_count?: number }>>(initialCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [isLoading, setIsLoading] = useState(false)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // 3 rows x 3 columns for desktop

  // Optimasi: Gunakan useMemo untuk filtering yang expensive
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter berdasarkan search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.category.toLowerCase().includes(query)
      )
    }

    // Filter berdasarkan category
    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    return filtered
  }, [posts, searchQuery, selectedCategory])

  // Pagination logic - Featured post tidak dihitung dalam pagination
  const featuredPosts = useMemo(() => {
    // Cari semua featured posts dari semua posts
    const featured = posts.filter((post) => post.featured === true)
    return featured
  }, [posts])

  // Regular posts untuk pagination (exclude semua featured posts)
  const regularPostsForPagination = useMemo(() => {
    const featuredIds = featuredPosts.map(post => post.id)
    return filteredPosts.filter((post) => !featuredIds.includes(post.id))
  }, [filteredPosts, featuredPosts])

  // Pagination logic
  const totalPages = Math.ceil(regularPostsForPagination.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRegularPosts = regularPostsForPagination.slice(startIndex, endIndex)

  // Optimasi: Gunakan useMemo untuk regular posts yang ditampilkan
  const regularPosts = useMemo(() => {
    return paginatedRegularPosts
  }, [paginatedRegularPosts])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Optimasi: Gunakan useCallback untuk event handlers
  const handleSearch = useCallback((query: string) => {
    setIsLoading(true)
    setSearchQuery(query)
    // Langsung update loading state tanpa delay
    setIsLoading(false)
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    // Langsung update loading state tanpa delay
    setIsLoading(false)
  }, [])

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogMobileSkeleton />
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <BlogSkeleton />
            </div>
            <div className="hidden lg:block lg:col-span-1">
              <BlogSidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Search Bar - Visible only on mobile */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="lg:hidden mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-200 bg-white"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </AnimatedSection>

        {/* Mobile Category Buttons - Slide-able */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <div className="lg:hidden mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {["Semua", ...categories.map((c: any) => c.name)].map((name) => (
                <button
                  key={name}
                  onClick={() => handleCategoryChange(name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    name === selectedCategory 
                      ? 'bg-custom-red text-white' 
                      : 'bg-white text-gray-700 hover:bg-custom-red hover:text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Full width on mobile, 3/4 on desktop */}
          <div className="lg:col-span-3">
            {/* Search Results Info */}
            {(searchQuery || selectedCategory !== 'Semua') && (
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">
                    {searchQuery && (
                      <span>Hasil pencarian untuk "<strong>{searchQuery}</strong>"</span>
                    )}
                    {searchQuery && selectedCategory !== 'Semua' && (
                      <span> dalam kategori </span>
                    )}
                    {selectedCategory !== 'Semua' && (
                      <span>kategori "<strong>{selectedCategory}</strong>"</span>
                    )}
                    {searchQuery || selectedCategory !== 'Semua' ? (
                      <span> - {filteredPosts.length} artikel ditemukan</span>
                    ) : null}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('Semua')
                      }}
                      className="text-custom-red hover:text-red-600 text-sm font-medium"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Featured Post - Hanya tampil jika tidak ada search query */}
            {featuredPosts.length > 0 && !searchQuery.trim() && (
              <AnimatedSection animation="fadeInUp" delay={0.3}>
                <div className="mb-8">
                  <div className="relative">
                    <Link href={`/blog/${featuredPosts[currentFeaturedIndex].slug}`} className="group">
                      <article className="bg-white rounded-2xl shadow-none transition-all duration-300 overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0">
                          <div className="relative aspect-video lg:aspect-video">
                            {featuredPosts[currentFeaturedIndex].image ? (
                              <Image
                                src={featuredPosts[currentFeaturedIndex].image.url}
                                alt={featuredPosts[currentFeaturedIndex].image.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-custom-red to-red-600" />
                            )}
                          </div>
                          <div className="p-6 lg:p-8 flex flex-col justify-center">
                            <h3 
                              className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-custom-red transition-colors"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.4',
                                minHeight: '3rem'
                              }}
                            >
                              {featuredPosts[currentFeaturedIndex].title}
                            </h3>
                            <div className="mb-4">
                              <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                                {featuredPosts[currentFeaturedIndex].excerpt}
                              </p>
                              <button className="mt-2 text-custom-red hover:text-red-600 text-sm font-medium transition-colors">
                                Selengkapnya →
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{featuredPosts[currentFeaturedIndex].author.name}</span>
                                <span>•</span>
                                <span>{new Date(featuredPosts[currentFeaturedIndex].publishedAt).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <span className="px-2 py-1 bg-custom-red/10 text-custom-red text-xs font-medium rounded-full">
                                {featuredPosts[currentFeaturedIndex].category || 'General'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Regular Posts Grid */}
            <div>
              <AnimatedGrid 
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
                staggerChildren={0.1}
                delay={0.5}
              >
                {regularPosts.map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="bg-white rounded-2xl shadow-none transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-video">
                        {post.image ? (
                          <Image
                            src={post.image.url}
                            alt={post.image.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                        {/* Badge Overlay with Frosted Glass Effect */}
                        <div className="absolute bottom-2 left-2 lg:bottom-3 lg:left-3">
                          <span className="px-2.5 py-1 lg:px-3 lg:py-1.5 backdrop-blur-md bg-white/80 text-gray-800 text-xs font-semibold rounded-full shadow-sm">
                            {post.category || 'General'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 lg:p-4">
                        <h3 
                          className="text-sm lg:text-base font-bold text-gray-900 mb-2 group-hover:text-custom-red transition-colors"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.4',
                            minHeight: '2.5rem'
                          }}
                        >
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-3 text-xs lg:text-sm leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 lg:gap-0 text-xs text-gray-500">
                          <span className="truncate">{post.author.name}</span>
                          <span className="text-[10px] lg:text-xs">{new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </AnimatedGrid>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 select-none">
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
                  // tampilkan halaman pertama, terakhir, current, dan +-2 dari current
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

            {/* Empty State - Hanya tampil ketika benar-benar tidak ada artikel */}
            {filteredPosts.length === 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.8}>
                <div className="text-center py-16">
                  {searchQuery || selectedCategory !== 'Semua' ? (
                    <div>
                      <p className="text-gray-500 text-lg mb-4">Tidak ada artikel yang ditemukan.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory('Semua')
                        }}
                        className="text-custom-red hover:text-red-600 font-medium"
                      >
                        Coba kata kunci lain atau reset filter
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-lg">Belum ada artikel tersedia. Nantikan update artikel menarik dari kami!</p>
                  )}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar - Right Side - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Search Component */}
              <AnimatedSection animation="fadeInRight" delay={0.6}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-200 bg-white"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </AnimatedSection>

              {/* Category List */}
              <AnimatedSection animation="fadeInRight" delay={0.7}>
                <CategoryList 
                  categories={categories} 
                  initialVisible={5} 
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
