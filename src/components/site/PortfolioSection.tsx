"use client"

import { ExternalLink, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PortfolioSectionProps } from "../../types/index"
import { extractPlainText } from '@/lib/utils/htmlCleaner'

export const PortfolioSection = ({
  title = "Portfolio Kami",
  subtitle = "Lihat hasil karya terbaik kami dalam mengembangkan solusi digital",
  items = [],
  showViewAll = true
}: PortfolioSectionProps) => {

  return (
    <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.08)] hover:shadow-[0_0_15px_rgba(0,0,0,0.12)] transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback ke image yang ada jika image error
                    const target = e.target as HTMLImageElement
                    target.src = "/images/hero-1.png"
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-custom-red transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>

                {/* Description (Plain Text) */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {extractPlainText(item.description) || 'Tidak ada deskripsi project...'}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(item.technologies) && item.technologies.length > 0 ? (
                      item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-medium">
                        Technology
                      </span>
                    )}
                  </div>
                </div>

                {/* Kategori & Link */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Kategori:</span> {item.category}
                  </div>
                  {/* Portfolio Detail Link */}
                  <Link 
                    href={item.url}
                    className="flex items-center gap-1 text-custom-red hover:text-red-700 transition-colors duration-300 group/link"
                  >
                    <span className="text-sm font-medium">Detail</span>
                    <ExternalLink className="h-4 w-4 group-hover/link:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 bg-custom-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors duration-300"
            >
              Lihat Semua Portfolio
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
