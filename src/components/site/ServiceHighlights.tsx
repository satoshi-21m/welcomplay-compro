"use client"

import Image from "next/image"

export const ServiceHighlights = () => {
  return (
    <section className="w-full bg-gradient-to-b from-orange-50/90 via-red-100/60 to-amber-100/95 pt-2 sm:pt-3 lg:pt-4 pb-10 sm:pb-14 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 lg:gap-20">
          {/* Top: Content Creation */}
          <div className="flex flex-col lg:items-center">
            <div className="space-y-3 mb-4 sm:mb-6 text-left lg:text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Konten yang Tepat Sasaran
              </h3>
              <p className="text-gray-700/80 text-sm sm:text-base leading-relaxed max-w-2xl lg:mx-auto">
                Strategi dan produksi konten yang konsisten—video pendek, carousel, hingga visual statis
                untuk membangun awareness dan mendorong engagement yang bermakna.
              </p>
            </div>
            <div className="space-y-4 w-full max-w-3xl">
              {/* Images dengan Badge di Atas */}
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {/* Image Kiri - Design Buruk */}
                <div className="flex flex-col gap-2 lg:gap-4 items-center">
                  <div className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100/50 shadow-sm w-fit">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-red-700">Kurang Optimal</span>
                  </div>
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src="/images/highlight/ig-1-problem.png"
                      alt="Content Creation Before"
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>

                {/* Image Kanan - Design Bagus */}
                <div className="flex flex-col gap-2 lg:gap-4 items-center">
                  <div className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-100/50 shadow-sm w-fit">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-green-700">Profesional</span>
                  </div>
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src="/images/highlight/ig-1.jpg"
                      alt="Content Creation After"
                      fill
                      className="object-cover"
                      priority={false}
                    />
                    
                    {/* Badge Gain Traffic/Engagement - Pojok Kanan Atas */}
                    <div className="absolute top-1 right-1 sm:top-3 sm:right-3 bg-gradient-to-br from-rose-500/90 to-pink-500/90 backdrop-blur-md px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-white/40 ring-1 ring-white/20">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <svg className="hidden sm:block w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <div className="text-white whitespace-nowrap">
                          <div className="text-[8px] sm:text-xs font-bold leading-tight">+245%</div>
                          <div className="text-[7px] sm:text-[10px] font-medium opacity-90 leading-tight">Engagement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button WhatsApp */}
              <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                <a 
                  href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20layanan%20Content%20Creation%20untuk%20meningkatkan%20konten%20visual%20bisnis%20saya.%20Mohon%20info%20lebih%20lanjut."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm sm:text-base font-semibold text-white">Buat Konten Lebih Menarik</span>
                <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              </div>
            </div>
          </div>

          {/* Bottom: Web Development */}
          <div className="flex flex-col lg:items-center pt-8 sm:pt-12">
            <div className="space-y-3 mb-6 text-left lg:text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Website Profesional, Desain Modern
              </h3>
              <p className="text-gray-700/80 text-sm sm:text-base leading-relaxed max-w-2xl lg:mx-auto">
                Situs modern yang cepat, aman, dan mudah dikelola—dioptimalkan untuk SEO, performa,
                dan konversi agar bisnis Anda dipercaya dan dipilih.
              </p>
            </div>
            <div className="space-y-6 w-full max-w-4xl">
              {/* Badge Benefit - 3 Badges Inline */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {/* Badge 1: Fast */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-xl border border-red-100/50">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Fast</span>
                </div>

              {/* Badge 2: SEO Optimized */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-xl border border-amber-100/50 w-fit">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">SEO Optimized</span>
                </div>


                {/* Badge 3: Secure */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-xl border border-orange-100/50">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Secure</span>
                </div>

                {/* Badge 4: Mobile Responsive */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-xl border border-yellow-100/50">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-500 to-lime-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-red-400">Mobile Responsive</span>
                </div>
              </div>

              {/* Image */}
              <div className="group relative w-full aspect-video rounded-2xl overflow-visible flex items-center justify-center">
                <Image
                  src="/images/highlight/web-high-1.png"
                  alt="Web Development Welcomplay"
                  fill
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={false}
                />
              </div>

              {/* CTA Button WhatsApp */}
              <div className="flex justify-center mt-2 lg:mt-4">
                <a 
                  href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20layanan%20Web%20Development%20untuk%20membuat%20website%20profesional%20bisnis%20saya.%20Mohon%20info%20lebih%20lanjut."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-sm sm:text-base font-semibold text-white">Buat Website Profesional</span>
                  <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


