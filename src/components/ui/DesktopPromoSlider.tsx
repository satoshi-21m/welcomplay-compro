"use client"

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function DesktopPromoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Mobile slider state
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0)
  const mobileSliderRef = useRef<HTMLDivElement>(null)

  const promoPackages = [
    {
      id: 1,
      title: "Company Profile",
      badge: "Company Profile",
      description: "Website yang dirancang untuk memperkenalkan dan memberikan informasi lengkap perusahaan",
      originalPrice: "Rp 10.000.000",
      newPrice: "Rp 4.000.000",
      discount: "60%",
      borderColor: "border-blue-500/20",
      badgeColor: "from-blue-400 to-blue-600",
      buttonColor: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business"
      ]
    },
    {
      id: 2,
      title: "Catalog Web",
      badge: "CATALOG WEB",
      description: "Website yang menampilkan katalog produk atau layanan dengan detail lengkap",
      originalPrice: "Rp 15.000.000",
      newPrice: "Rp 6.000.000",
      discount: "60%",
      borderColor: "border-green-500/20",
      badgeColor: "from-green-400 to-green-600",
      buttonColor: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business",
        "Sistem Katalog Produk",
        "Filter & Pencarian Produk"
      ]
    },
    {
      id: 3,
      title: "E-Commerce",
      badge: "E-COMMERCE",
      description: "Website toko online lengkap dengan sistem pembayaran dan manajemen produk",
      originalPrice: "Rp 25.000.000",
      newPrice: "Rp 10.000.000",
      discount: "60%",
      borderColor: "border-purple-500/20",
      badgeColor: "from-purple-400 to-purple-600",
      buttonColor: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business",
        "Integrasi Online Payment Gateway",
        "Integrasi Sistem Ongkos Pengiriman"
      ]
    },
    {
      id: 4,
      title: "Tour & Travel",
      badge: "TOUR & TRAVEL",
      description: "Website yang menyediakan layanan terkait tiket transportasi dan penginapan",
      originalPrice: "Rp 20.000.000",
      newPrice: "Rp 8.000.000",
      discount: "60%",
      borderColor: "border-teal-500/20",
      badgeColor: "from-teal-400 to-teal-600",
      buttonColor: "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business",
        "Integrasi Online Payment Gateway",
        "Integrasi Sistem Ongkos Pengiriman"
      ]
    },
    {
      id: 5,
      title: "News Web",
      badge: "NEWS WEB",
      description: "Website yang menyediakan informasi terkini tentang berbagai topik dan trend terkini",
      originalPrice: "Rp 20.000.000",
      newPrice: "Rp 8.000.000",
      discount: "60%",
      borderColor: "border-indigo-500/20",
      badgeColor: "from-indigo-400 to-indigo-600",
      buttonColor: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business",
        "Integrasi Online Payment Gateway",
        "Integrasi Sistem Ongkos Pengiriman"
      ]
    },
    {
      id: 6,
      title: "Booking System",
      badge: "BOOKING SYSTEM",
      description: "Website untuk pemesanan layanan secara online seperti (Salon, Spa, Barbershop, DII)",
      originalPrice: "Rp 20.000.000",
      newPrice: "Rp 8.000.000",
      discount: "60%",
      borderColor: "border-pink-500/20",
      badgeColor: "from-pink-400 to-pink-600",
      buttonColor: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
      features: [
        "Copywriting / Konten",
        "Free 2x Revisi",
        "Free Penyusunan Materi",
        "SEO Friendly",
        "Gratis Desain Logo",
        "Free Instalasi Google Analytics",
        "Free Instalasi Google Search Console",
        "Full Support Dan Maintenance",
        "Free Domain & Hosting 1 Tahun",
        "Include SSL Security",
        "Include Training",
        "Akses Dashboard Admin",
        "Free Email Business",
        "Integrasi Online Payment Gateway",
        "Integrasi Sistem Ongkos Pengiriman"
      ]
    }
  ]

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setCurrentIndex(Math.min(Math.ceil(promoPackages.length / 3) - 1, currentIndex + 1))
    }
  }

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1)
    }
  }

  // Mobile slider functions
  const goToMobileSlide = (index: number) => {
    setMobileCurrentIndex(index)
  }

  const nextMobileSlide = () => {
    setMobileCurrentIndex((prev) => (prev + 1) % promoPackages.length)
  }

  const prevMobileSlide = () => {
    setMobileCurrentIndex((prev) => (prev - 1 + promoPackages.length) % promoPackages.length)
  }

  const formatBadge = (text: string) => {
    if (!text) return text
    const parts = text.split(' ')
    let prefix = ''
    let body = text
    if (parts.length > 1 && !/[A-Za-z]/.test(parts[0])) {
      prefix = parts[0] + ' '
      body = parts.slice(1).join(' ')
    }
    const toTitle = (word: string) => {
      if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/u.test(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
    const formatted = body
      .split(' ')
      .map(token => token.includes('-')
        ? token.split('-').map(seg => toTitle(seg)).join('-')
        : toTitle(token)
      )
      .join(' ')
    return prefix + formatted
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      updateScrollButtons()
      
      return () => container.removeEventListener('scroll', updateScrollButtons)
    }
  }, [])

  // Auto-advance mobile slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextMobileSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation Arrows - Hidden on mobile/tablet */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-11 h-11 transition-all duration-300 flex items-center justify-center lg:flex ${
          canScrollLeft
            ? 'text-custom-red hover:scale-110'
            : 'text-gray-400 cursor-not-allowed'
        } hidden lg:flex`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-11 h-11 transition-all duration-300 flex items-center justify-center lg:flex ${
          canScrollRight
            ? 'text-custom-red hover:scale-110'
            : 'text-gray-400 cursor-not-allowed'
        } hidden lg:flex`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Cards Container */}
      <div className="relative w-full">
        {/* Mobile/Tablet View - Swipeable Slider (No Page Horizontal Scroll) */}
        <div className="lg:hidden w-full overflow-hidden">
          {/* Mobile Slider Container */}
          <div className="relative w-full">
            {/* Mobile Navigation Arrows */}
            <button
              onClick={prevMobileSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white text-custom-red rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={nextMobileSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white text-custom-red rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Mobile Slider */}
            <div className="w-full overflow-hidden">
              <div 
                ref={mobileSliderRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${mobileCurrentIndex * 100}%)` }}
              >
                {promoPackages.map((pkg) => (
                  <div key={pkg.id} className="w-full flex-shrink-0 px-4">
                    <div className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-all duration-300 border-2 ${pkg.borderColor} h-full w-full`}>
                      {/* Badge - Menggunakan margin-top untuk menghindari terpotong */}
                      <div className="flex justify-center mb-4">
                        <div className={`bg-gradient-to-r ${pkg.badgeColor} text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap`}>
                          {formatBadge(pkg.badge)}
                        </div>
                      </div>
                      
                      {/* Header - Tidak perlu padding top lagi */}
                      <div className="text-center mb-4 sm:mb-6">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-4 sm:mb-6">
                        <div className="flex flex-col items-center gap-2 mb-3">
                          <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-base sm:text-lg md:text-2xl font-bold text-custom-red">{pkg.newPrice}</span>
                            <span className="inline-block bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                              Hemat {pkg.discount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="text-center mt-auto">
                        <Link
                          href={`https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(pkg.title)}.%20Mohon%20informasinya.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-block w-full bg-gradient-to-r ${pkg.buttonColor} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-lg text-sm sm:text-base`}
                        >
                          🚀 Pilih Paket Ini
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Slider Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {promoPackages.map((_, index) => (
                <button 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === mobileCurrentIndex
                      ? 'bg-custom-red w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => goToMobileSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="hidden lg:flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-12 bg-white"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {promoPackages.map((pkg) => (
            <div key={pkg.id} className="flex-shrink-0 w-full max-w-sm">
              <div className={`relative bg-white rounded-3xl p-6 shadow-sm transition-all duration-300 border-2 ${pkg.borderColor} h-full`}>
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`bg-gradient-to-r ${pkg.badgeColor} text-white px-4 sm:px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap`}>
                    {formatBadge(pkg.badge)}
                  </div>
                </div>
                
                {/* Header */}
                <div className="text-center mb-6 pt-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <span className="text-base sm:text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg sm:text-2xl font-bold text-custom-red">{pkg.newPrice}</span>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Hemat {pkg.discount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-auto">
                  <Link
                    href={`https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(pkg.title)}.%20Mohon%20informasinya.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block w-full bg-gradient-to-r ${pkg.buttonColor} text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-lg`}
                  >
                    🚀 Pilih Paket Ini
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicators - Hidden on mobile/tablet */}
      <div className="hidden lg:flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(promoPackages.length / 3) }).map((_, index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-custom-red'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => {
              if (scrollContainerRef.current) {
                const container = scrollContainerRef.current
                const scrollAmount = container.clientWidth * index
                container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
                setCurrentIndex(index)
              }
            }}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom CSS untuk hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
