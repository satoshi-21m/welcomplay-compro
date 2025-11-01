"use client"

import { TrendingDown, DollarSign, Users, XCircle } from "lucide-react"

export const ConsequenceSection = () => {
  const consequences = [
    {
      icon: TrendingDown,
      title: "Engagement Terus Menurun",
      description: "Konten yang kurang menarik membuat follower berkurang dan interaksi semakin sepi",
      gradient: "from-red-500 to-red-600"
    },
    {
      icon: DollarSign,
      title: "Kehilangan Potensi Penjualan",
      description: "Website yang lambat dan tidak responsif membuat calon pelanggan pergi ke kompetitor",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Brand Awareness Stagnan",
      description: "Tanpa strategi digital yang tepat, bisnis Anda tidak dikenal target market",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: XCircle,
      title: "Tertinggal dari Kompetitor",
      description: "Kompetitor dengan digital presence yang kuat akan merebut market share Anda",
      gradient: "from-yellow-500 to-amber-500"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-red-50/80 to-orange-50/90 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
            Kendala yang Terjadi Jika{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Dibiarkan
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Kendala digital yang tidak ditangani akan berdampak serius pada pertumbuhan bisnis Anda
          </p>
        </div>

        {/* Consequences Grid - Minimalist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {consequences.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Button WhatsApp */}
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center px-2">
          <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            Jangan biarkan masalah ini menghambat bisnis Anda lebih lama lagi
          </p>
          <a 
            href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20ingin%20konsultasi%20untuk%20mengatasi%20kendala%20digital%20bisnis%20saya.%20Mohon%20info%20lebih%20lanjut."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">Saatnya Ambil Tindakan Sekarang</span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

