"use client"

import { FeaturesSectionProps } from "../../types/index"
import { FEATURES } from "../../lib/data"
import Link from "next/link"
import { Button } from "../ui/button"
import { COMPANY_INFO } from "../../lib/navigation"
import Image from "next/image"

export const FeaturesSection = ({
  title = "Layanan Kami",
  subtitle = "Solusi teknologi lengkap untuk transformasi digital bisnis Anda",
  features = FEATURES
}: FeaturesSectionProps) => {
  const parseWhatsappNumberFromUrl = (url: string): string => {
    try {
      const match = url.match(/wa\.me\/(\d+)/)
      return match && match[1] ? match[1] : '6282113831700'
    } catch {
      return '6282113831700'
    }
  }

  const buildWhatsappUrl = (serviceName: string): string => {
    const number = parseWhatsappNumberFromUrl(COMPANY_INFO.whatsapp)
    const text = `Halo WELCOMPLAY, saya tertarik konsultasi gratis untuk ${serviceName}. Mohon informasinya.`
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  }

  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4 font-normal">
            {subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 lg:gap-8"
             style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}>
           {features.map((feature) => {
             const IconComponent = feature.icon
            const IMAGE_BY_ID: Record<string, string> = {
              "web-development": "/images/featuresimg/web.jpg",
              "mobile-app-development": "/images/featuresimg/mobile.jpg",
              "social-media-management": "/images/featuresimg/smm.jpg",
              "google-social-media-ads": "/images/featuresimg/ads.jpg",
              "seo": "/images/featuresimg/seo.png",
              "visual-ad-creation": "/images/featuresimg/fotovideo.jpg",
            }
             const imageSrc = IMAGE_BY_ID[feature.id] ?? "/placeholder.jpg"
             
             return (
               <div
                 key={feature.id}
                 className="group relative bg-white/95 rounded-2xl sm:rounded-3xl shadow-sm transition-opacity duration-300 overflow-hidden transform-gpu will-change-transform"
                 style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}
               >
                {/* Background Gradient Overlay (default pekat, hover lebih pekat) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-${feature.gradient} to-${feature.gradient} ${feature.id === 'google-social-media-ads' ? 'opacity-95 group-hover:opacity-98' : 'opacity-90 group-hover:opacity-95'} transition-opacity duration-500 pointer-events-none will-change-opacity transform-gpu`}
                       style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}></div>
                  
                  {/* Floating Icon Background (disabled on mobile, no will-change) */}
                  <div className={`absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br ${feature.gradient} opacity-30 sm:opacity-50 rounded-full blur-lg transition-opacity duration-300 hidden sm:block`}
                       style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}></div>
                  
                  {/* Image (match LatestArticles behavior) */}
                  <div className="relative z-10 mb-0 rounded-t-2xl overflow-hidden h-40 sm:h-44 lg:h-48">
                    <Image
                      src={imageSrc}
                      alt={feature.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 md:group-hover:scale-[1.02] transform-gpu will-change-transform"
                      priority={false}
                    />
                    {/* Overlay gradient dari image (tanpa bg di teks) */}
                   <div className="absolute inset-x-0 bottom-0 bg-black/25 md:bg-black/35 transition-opacity duration-300 will-change-opacity transform-gpu"></div>
                  </div>
 
                  {/* Body content wrapper dengan pastel gradient lebih pekat */}
                  <div className="relative z-10 px-4 sm:px-5 pt-1 sm:pt-2 pb-4 sm:pb-5 bg-white/0 hover:bg-white/0 transition-colors duration-300 rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
                    {/* Overlay gradient mengikuti layanan (pastel, lebih pekat saat hover) */}
                   <div className={`pointer-events-none absolute inset-0 rounded-b-2xl sm:rounded-b-3xl bg-gradient-to-r ${feature.gradient} opacity-95 group-hover:opacity-98 transition-opacity duration-300 will-change-opacity transform-gpu`}
                         style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}></div>
                    {/* Body description removed (now on image overlay) */}
 
                    {/* Bottom Decoration */}
                    <div className="relative">
                      <div className="flex items-center">
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-transparent"></div>
                        <div className={`w-8 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-16 transition-all duration-500`}></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-200 to-transparent"></div>
                      </div>
                    </div>
 
                    {/* Footer */}
                    <div className="relative mt-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4 text-white transition-transform duration-300 group-hover:animate-[shake_1.2s_ease-in-out_infinite]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white whitespace-normal break-words">{feature.title}</div>
                            <div className="text-xs text-white/90 leading-tight mt-1">{feature.description}</div>
                          </div>
                        </div>
                        <Link href={feature.href}>
                          <Button size="sm" className="h-8 px-4 text-[12px] rounded-full font-semibold bg-white/20 text-white hover:bg-white/30 border-none">
                            Lihat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
 
                 {/* Border Effect (default pekat, hover lebih pekat) */}
                 <div className={`pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-90 group-hover:opacity-95 transition-opacity duration-300 -z-10 hidden sm:block will-change-opacity transform-gpu`}
                       style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}></div>
 
                 {/* Corner Accent (default pekat, hover lebih pekat) */}
                 <div className={`pointer-events-none absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-65 group-hover:opacity-80 transition-opacity duration-300 hidden sm:block will-change-opacity transform-gpu`}
                       style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}></div>
                </div>
              )
            })}
          </div>

                                   {/* CTA Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="relative bg-gradient-to-r from-custom-red via-red-600 to-red-700 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                  Siap untuk Memulai Proyek Anda?
                </h3>
                <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 opacity-90 max-w-xl mx-auto leading-relaxed font-normal px-2">
                  Dapatkan solusi teknologi terbaik untuk bisnis Anda dengan tim ahli kami
                </p>
                <Link href={buildWhatsappUrl('Layanan Teknologi')} target="_blank" rel="noopener noreferrer" className="group bg-white text-custom-red px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block">
                  <span className="flex items-center gap-2">
                    Konsultasi Gratis
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
      </div>
    </section>
  )
} 