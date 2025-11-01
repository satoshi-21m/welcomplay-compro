"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { Article, LatestArticlesSectionProps } from "../../types/index"

export const LatestArticlesSection = ({
  title = "Artikel Terbaru",
  subtitle = "Temukan insight dan tips terbaru seputar digital marketing dan web development",
  articles = []
}: LatestArticlesSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date not available'
      }
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Date not available'
    }
  }

  // Fallback data jika articles kosong
  const displayArticles = articles.length > 0 ? articles : [
    {
      id: "1",
      title: "Artikel Sedang Dimuat...",
      excerpt: "Sedang memuat artikel terbaru dari database...",
      publishedAt: new Date().toISOString(),
      slug: "loading",
      category: "Loading",
      image: "" // Tambahkan field image kosong
    }
  ]

  // Tampilkan 3 artikel pertama, sisanya bisa di-expand
  const initialArticles = displayArticles.slice(0, 3)
  const remainingArticles = displayArticles.slice(3)
  const visibleArticles = isExpanded ? displayArticles : initialArticles

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {visibleArticles.map((article) => (
            <article 
              key={article.id}
              className="bg-white rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.08)] hover:shadow-[0_0_15px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden group"
            >
              {/* Article Image */}
              {article.image ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback ke placeholder jika image error
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      // Tampilkan fallback content
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  {/* Fallback content jika image error */}
                  <div className="hidden h-48 bg-gradient-to-br from-custom-red/20 to-red-100 items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-custom-red/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-custom-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <p className="text-custom-red font-semibold text-sm">{article.category}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-custom-red/20 to-red-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-custom-red/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-custom-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-custom-red font-semibold text-sm">{article.category}</p>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold text-gray-900 mb-3 group-hover:text-custom-red transition-colors duration-300 min-h-[3.5rem]"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.4'
                  }}
                >
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read More Button with Published Date */}
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-custom-red font-semibold hover:text-red-700 transition-colors duration-300 group-hover:gap-3"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                  </Link>
                  <span className="text-sm text-gray-400">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {remainingArticles.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={toggleExpand}
              className="inline-flex items-center gap-2 text-custom-red hover:text-red-700 font-semibold transition-colors duration-300 group"
            >
              {isExpanded ? (
                <>
                  Melihat Lebih Sedikit
                  <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </>
              ) : (
                <>
                  Melihat Selengkapnya ({remainingArticles.length} artikel)
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-3 bg-custom-red hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Lihat Semua Artikel
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
