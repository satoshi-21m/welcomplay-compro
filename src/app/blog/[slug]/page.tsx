import { Navbar } from "../../../components/site/layout/Navbar"
import { Footer } from "../../../components/site/layout/Footer"
import { WhatsAppButton } from "../../../components/ui/WhatsAppButton"
import { BlogPost } from "../../../types/blog"
import { BlogDetailSkeleton, BlogDetailMobileSkeleton } from "../../../components/ui/BlogDetailSkeleton"
import { ExpandableBreadcrumb } from "../../../components/ui/ExpandableBreadcrumb"
import { sanitizeSlug } from '../../../lib/utils'
import { AnimatedSection, AnimatedGrid } from "../../../components/animations"
import { BlogSidebar } from "../../../components/blog/BlogSidebar"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// Helper function untuk sanitize HTML content
function sanitizeHtmlContent(html: string): string {
  if (!html) return ''
  
  // Allow safe HTML tags
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'b', 'i',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'div', 'span', 'mark', 'del', 'ins', 'sub', 'sup'
  ]
  
  // Create a simple HTML parser to clean content
  let cleanHtml = html
  
  // Remove potentially dangerous attributes
  cleanHtml = cleanHtml.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
  cleanHtml = cleanHtml.replace(/javascript:/gi, '') // Remove javascript: protocol
  cleanHtml = cleanHtml.replace(/data:/gi, '') // Remove data: protocol
  
  // Ensure all tags are properly closed
  cleanHtml = cleanHtml.replace(/<([a-z][a-z0-9]*)([^>]*?)(?:\/>|>)/gi, (match, tag, attrs) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match
    }
    return ''
  })
  
  return cleanHtml
}

// Import blog actions with caching
import { 
  getBlogPostBySlug, 
  getLandingRecentBlogPosts
} from '../../../lib/actions/blog-actions'

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
  
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan - WELCOMPLAY',
      description: 'Artikel yang Anda cari tidak ditemukan.'
    }
  }

  return {
    title: `${post.title} - WELCOMPLAY Blog`,
    description: post.excerpt || post.seo?.metaDescription || `Baca artikel ${post.title} di blog WELCOMPLAY`,
    keywords: post.seo?.keywords || post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.seo?.metaDescription,
      type: "article",
      url: `https://welcomplay.com/blog/${slug}`,
      images: post.image ? [{
        url: post.image.url,
        width: 1200,
        height: 630,
        alt: post.image.alt
      }] : [],
    },
  }
}

// Server Component dengan caching
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  
  // ✅ Decode URL dan sanitize slug untuk handle special characters
  let slug = rawSlug
  try {
    // Try to decode if it's URL encoded
    slug = decodeURIComponent(rawSlug)
  } catch (e) {
    // If decode fails, use raw slug
    slug = rawSlug
  }
  
  // Sanitize slug to match database format
  slug = sanitizeSlug(slug)
  
  // Fetch data di server dengan caching
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  // ⚡ OPTIMIZED: Fetch hanya 5 recent posts untuk sidebar
  const recentPosts = await getLandingRecentBlogPosts(slug)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-[#f5f6f7]">
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ExpandableBreadcrumb title={post.title} type="blog" />
          </div>
        </AnimatedSection>

        {/* Article + Sidebar */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <article>
                  {/* Hero with overlayed title and meta */}
                  <AnimatedSection animation="fadeInUp" delay={0.2}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                      {post.image ? (
                        <Image
                          src={post.image.url}
                          alt={post.image.alt}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-custom-red to-red-600" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-0 leading-tight">
                          {post.title}
                        </h1>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Post Meta Info - Below Image */}
                  <AnimatedSection animation="fadeInUp" delay={0.3}>
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm md:text-base">
                          <span className="font-medium">{post.author.name}</span>
                          <span>•</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                          {post.updatedAt && post.updatedAt !== post.publishedAt && (
                            <>
                              <span>•</span>
                              <span className="text-xs md:text-sm">Diperbarui {new Date(post.updatedAt).toLocaleDateString('id-ID')}</span>
                            </>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-custom-red/10 text-custom-red text-xs font-medium rounded-full">
                          {post.category || 'General'}
                        </span>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Content */}
                  <AnimatedSection animation="fadeInUp" delay={0.4}>
                    <div 
                      className="blog-content prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(post.content) }}
                    />
                  </AnimatedSection>
                </article>
              </div>
              <div className="hidden lg:block lg:col-span-1">
                {/* Other Articles List + Social Media */}
                 <div className="sticky top-24">
                  <AnimatedSection animation="fadeInRight" delay={0.5}>
                  <BlogSidebar recentPosts={recentPosts.slice(0, 5)} />
                </AnimatedSection>
                 </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <article>
                {/* Mobile Hero with overlayed title and meta */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  {post.image ? (
                    <Image
                      src={post.image.url}
                      alt={post.image.alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-custom-red to-red-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-0 leading-tight">
                      {post.title}
                    </h1>
                  </div>
                </div>

                {/* Mobile Post Meta Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
                      <span className="font-medium">{post.author.name}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      {post.updatedAt && post.updatedAt !== post.publishedAt && (
                        <>
                          <span>•</span>
                          <span className="text-xs">Diperbarui {new Date(post.updatedAt).toLocaleDateString('id-ID')}</span>
                        </>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-custom-red/10 text-custom-red text-xs font-medium rounded-full">
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Mobile Content */}
                <div 
                  className="blog-content prose prose-sm sm:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(post.content) }}
                />

                {/* Mobile Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Recent Posts */}
                {recentPosts.length > 0 && (
                  <div className="mt-8 bg-gray-50 rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Artikel Lainnya</h3>
                    <div className="space-y-4">
                      {recentPosts.slice(0, 5).map((p) => (
                        <Link key={p.id} href={`/blog/${p.slug}`} className="flex items-start gap-3 group">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.image?.url ? (
                              <Image src={p.image.url} alt={p.image.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-custom-red transition-colors">{p.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(p.publishedAt).toLocaleDateString('id-ID')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Social Media */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ikuti Kami</h3>
                  <div className="flex gap-3">
                    {/* Instagram */}
                    <a 
                      href="https://www.instagram.com/welcomplay" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* TikTok */}
                    <a 
                      href="https://www.tiktok.com/@welcomplay" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <Image 
                        src="/images/tiktok-welcomplay.svg" 
                        alt="TikTok" 
                        width={20} 
                        height={20} 
                        className="w-5 h-5 brightness-0 invert"
                      />
                    </a>

                    {/* Facebook */}
                    <a 
                      href="https://www.facebook.com/welcomplay.official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a 
                      href="https://id.linkedin.com/company/welcomplay" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-8.385c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v8.385H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a 
                      href="https://www.youtube.com/@welcomplay" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Related Posts section removed: replaced by "Artikel Lainnya" sidebar/list */}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-custom-red to-red-600">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="fadeInUp" delay={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Butuh Solusi Digital untuk Bisnis Anda?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Tim ahli Welcomplay siap membantu mewujudkan ide digital Anda menjadi kenyataan
              </p>
              <Link 
                href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20bekerja%20sama.%20Mohon%20informasinya." 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-custom-red px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 inline-flex items-center justify-center"
              >
                Konsultasi Gratis Sekarang
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}