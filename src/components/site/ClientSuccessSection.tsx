"use client"

import Image from "next/image"
import { Star } from "lucide-react"

export const ClientSuccessSection = () => {
  const successStories = [
    {
      client: "Rumah Keyboard",
      category: "E-Commerce",
      image: "/images/portfolio/rumah-keyboard-instagram.png",
      logo: "/images/clientlogo/rumah-keyboard.png",
      metric: "+320%",
      metricLabel: "Online Sales",
      description: "Peningkatan penjualan online melalui Instagram Shopping dan konten viral",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      client: "Rumah Modifikasi",
      category: "E-Commerce Website",
      image: "/images/portfolio/rumah-modifikasi-ecommerce.png",
      logo: "/images/clientlogo/rumah-modifikasi.png",
      metric: "+450%",
      metricLabel: "Website Traffic",
      description: "Website profesional dengan SEO optimization meningkatkan traffic drastis",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      client: "OneSolid",
      category: "Corporate Website",
      image: "/images/portfolio/web-onesolid.png",
      logo: "/images/clientlogo/onesolid.png",
      metric: "+380%",
      metricLabel: "Lead Inquiries",
      description: "Website modern dan fast loading dengan user experience yang excellent",
      gradient: "from-amber-500 to-orange-600"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-amber-100/95 via-green-50/90 to-blue-100/90 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Hasil Nyata{" "}
              <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                Client Kami
              </span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-amber-50 px-4 py-2 rounded-full border border-red-100/50">
              <Star className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">Bukti Nyata</span>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Lebih dari 100+ brand telah merasakan dampak nyata dari solusi digital kami
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {successStories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                <Image
                  src={story.image}
                  alt={`${story.client} - Success Story`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <Image
                        src={story.logo}
                        alt={`${story.client} Logo`}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{story.client}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{story.category}</p>
                    </div>
                  </div>
                  
                  {/* Metric Badge - No padding */}
                  <div className="flex-shrink-0 text-right whitespace-nowrap">
                    <div className={`text-sm sm:text-base font-bold leading-tight bg-gradient-to-r ${story.gradient} bg-clip-text text-transparent`}>{story.metric}</div>
                    <div className="text-[8px] sm:text-[9px] font-medium text-gray-500 leading-tight">{story.metricLabel}</div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-xs sm:text-base text-gray-600">
            Semua angka berdasarkan{" "}
            <span className="font-semibold text-gray-900">data analytics dan measurement tools</span>
          </p>
        </div>
      </div>
    </section>
  )
}

