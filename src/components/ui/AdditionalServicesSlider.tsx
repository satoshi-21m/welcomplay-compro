"use client"

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

export function AdditionalServicesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3

  const additionalServices = [
    {
      id: 1,
      title: "Tour & Travel",
      description: "Website yang menyediakan layanan terkait tiket transportasi dan penginapan",
      originalPrice: "20.000.000",
      newPrice: "8.000.000",
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
      id: 2,
      title: "News Web",
      description: "Website yang menyediakan informasi terkini tentang berbagai topik dan trend terkini",
      originalPrice: "20.000.000",
      newPrice: "8.000.000",
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
      id: 3,
      title: "Booking System Web",
      description: "Website untuk pemesanan layanan secara online seperti (Salon, Spa, Barbershop, DII)",
      originalPrice: "20.000.000",
      newPrice: "8.000.000",
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

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  useEffect(() => {
    // Auto slide every 6 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 6000)

    return () => clearInterval(interval)
  }, [totalSlides])

  return (
    <div className="relative">
      {/* Cards Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {additionalServices.map((service) => (
            <div key={service.id} className="w-full flex-shrink-0 px-4">
              <div className="bg-custom-red rounded-3xl p-6 text-white max-w-sm mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <span className="text-lg text-white/60 line-through">Rp {service.originalPrice}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-yellow-300">Rp {service.newPrice}</span>
                      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        💰 Hemat 60%
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link
                    href={`https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(service.title)}.%20Mohon%20informasinya.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-white text-custom-red px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-lg"
                  >
                    🚀 Pilih Paket Ini
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {[0, 1, 2].map((index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-custom-red'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-custom-red p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-custom-red p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
