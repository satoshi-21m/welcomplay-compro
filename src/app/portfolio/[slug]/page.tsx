import { Navbar } from "../../../components/site/layout/Navbar"
import { Footer } from "../../../components/site/layout/Footer"
import { WhatsAppButton } from "../../../components/ui/WhatsAppButton"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Calendar, User, Tag, Globe, Code, ArrowRight } from "lucide-react"
import { ExpandableBreadcrumb } from "../../../components/ui/ExpandableBreadcrumb"
import { PortfolioPageWrapper, AnimatedSection } from "../../../components/animations"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// Helper function untuk sanitize HTML content (mirip dengan halaman Blog)
function sanitizeHtmlContent(html: string): string {
  if (!html) return ''
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'b', 'i',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'div', 'span', 'mark', 'del', 'ins', 'sub', 'sup'
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

// Import portfolio actions with caching
import { 
  getPortfolioItemBySlug, 
  getRelatedPortfolioItems
} from '../../../lib/actions/portfolio-actions'
import { sanitizeSlug } from '../../../lib/utils'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  
  // ✅ Decode URL dan sanitize slug
  let slug = rawSlug
  try {
    slug = decodeURIComponent(rawSlug)
  } catch (e) {
    slug = rawSlug
  }
  slug = sanitizeSlug(slug)
  
  const portfolio = await getPortfolioItemBySlug(slug)
  
  if (!portfolio) {
    return {
      title: 'Portfolio Tidak Ditemukan - WELCOMPLAY',
      description: 'Portfolio yang Anda cari tidak ditemukan.'
    }
  }

  return {
    title: `${portfolio.title} - WELCOMPLAY Portfolio`,
    description: portfolio.description || `Lihat portfolio ${portfolio.title} dari WELCOMPLAY`,
    keywords: portfolio.category,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      type: "article",
      url: `https://welcomplay.com/portfolio/${slug}`,
      images: portfolio.image ? [{
        url: portfolio.image,
        width: 1200,
        height: 630,
        alt: portfolio.title
      }] : [],
    },
  }
}

// Server Component dengan caching
export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  
  // ✅ Decode URL dan sanitize slug untuk handle special characters
  let slug = rawSlug
  try {
    slug = decodeURIComponent(rawSlug)
  } catch (e) {
    slug = rawSlug
  }
  slug = sanitizeSlug(slug)
  
  // Fetch data di server dengan caching
  const portfolio = await getPortfolioItemBySlug(slug)
  
  if (!portfolio) {
    notFound()
  }
  
  // ⚡ OPTIMIZED: Fetch hanya 3 related portfolios
  const relatedPortfolios = await getRelatedPortfolioItems(slug, portfolio.category, 3)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Date not available'
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-[#f5f6f7]">
        <PortfolioPageWrapper>
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="py-4 bg-gradient-to-b from-[#f5f6f7] to-white">
            <ExpandableBreadcrumb title={portfolio.title} type="portfolio" />
          </div>
        </AnimatedSection>

        {/* Portfolio Hero Section */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
        <div className="py-16 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout - Image di atas */}
            <div className="lg:hidden space-y-6">
              {/* Mobile Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Mobile Content */}
              <div className="space-y-6">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {portfolio.title}
                </h1>

                {/* Description (HTML) */}
                <div 
                  className="blog-content prose prose-sm sm:prose-base max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(portfolio.description) }}
                />

                {/* Project Info */}
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Project</p>
                      <p className="font-medium text-gray-900">{formatDate(portfolio.createdAt || '')}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Project Type Badge - Di posisi button sebelumnya */}
                <div className="flex items-center gap-3 justify-center">
                  {/* Category Badge - Di sebelah kiri */}
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: portfolio.categoryColor }}
                  >
                    {portfolio.category}
                  </span>
                  
                  {/* Project Type Badge - Di sebelah kanan */}
                  {portfolio.projectTypeName && (
                    <span 
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: portfolio.projectTypeColor }}
                    >
                      {portfolio.projectTypeName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout - Image di kanan */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {portfolio.title}
                </h1>

                {/* Description (HTML) */}
                <div 
                  className="blog-content prose prose-lg max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(portfolio.description) }}
                />

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-6 py-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Project</p>
                      <p className="font-medium text-gray-900">{formatDate(portfolio.createdAt || '')}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Project Type Badge - Di posisi button sebelumnya */}
                <div className="flex items-center gap-3">
                  {/* Category Badge - Di sebelah kiri */}
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: portfolio.categoryColor }}
                  >
                    {portfolio.category}
                  </span>
                  
                  {/* Project Type Badge - Di sebelah kanan */}
                  {portfolio.projectTypeName && (
                    <span 
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: portfolio.projectTypeColor }}
                    >
                      {portfolio.projectTypeName}
                    </span>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </AnimatedSection>

        {/* Technologies Section - Only show if technologies exist */}
        {portfolio.technologies && portfolio.technologies.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.3}>
          <div className="py-16 bg-white">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Teknologi</h2>
                <p className="text-lg text-gray-600">Teknologi dan tools yang digunakan dalam project ini</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {portfolio.technologies.map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-custom-red hover:text-white transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          </AnimatedSection>
        )}

        {/* Related Portfolios */}
        {relatedPortfolios.length > 0 && (
          <AnimatedSection animation="fadeInUp" delay={0.4}>
          <div className="py-16 bg-gray-50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Serupa</h2>
                <p className="text-lg text-gray-600">Lihat project lain yang menggunakan teknologi serupa</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPortfolios.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-custom-red transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{item.category}</span>
                        <ArrowRight className="w-5 h-5 text-custom-red group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          </AnimatedSection>
        )}
        </PortfolioPageWrapper>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}