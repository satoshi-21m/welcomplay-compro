"use client"

import { Code, Users, CheckCircle, ArrowRight, AlertTriangle, Lightbulb, Video, TrendingDown, Target, Clock, Smartphone, Search, Edit, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { COMPANY_INFO } from "../../lib/navigation"
import { AuroraText } from "@/components/magicui/aurora-text";


export const PremiumServicesSection = () => {
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
    <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-6 leading-tight whitespace-normal break-words">
            Partner Transformasi Digital <br/><span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Untuk Bisnis Anda</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-normal whitespace-normal break-words">
            Solusi untuk mengatasi kendala bisnis Anda dengan ide kreatif dan strategis
          </p>
        </div>

        {/* Premium Services - Vertical Layout */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* Social Media Content Creation */}
          <div className="bg-none rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 relative overflow-hidden shadow-lg sm:shadow-none border-2 border-transparent bg-gradient-to-br from-purple-50 via-pink-50 to-white sm:bg-none sm:border-0">
            {/* Background Image - Hidden below 1335px */}
            <div className="absolute inset-0 z-0 hidden 2xl:block group">
              <Image
                src="/images/premiumcard.png"
                alt="Premium Card Background"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
              />
            </div>
            
            {/* White background for screens below 1335px */}
            <div className="absolute inset-0 z-0 2xl:hidden bg-white rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header with Icon and Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-5 sm:mb-8">
                {/* Icon */}
                {/* <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="h-10 w-10 text-white" />
                </div> */}
                
                {/* Title and Description */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] via-[#F472B6] to-[#F9A8D4] bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight whitespace-normal break-words">
                  <AuroraText colors={["#8B5CF6", "#EC4899", "#F472B6", "#F9A8D4"]}>Social Content Creation</AuroraText>
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-normal whitespace-normal break-words">
                    Konten kreatif dan menarik untuk sosial media bisnis Anda dengan strategi yang tepat.
                  </p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
                {/* Pain Points */}
                <div className="space-y-3 sm:space-y-4 pb-5 lg:pb-0 border-b-2 border-dashed border-purple-200 lg:border-0">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="bg-red-100 px-3 py-1 rounded-lg">
                      <span className="text-red-600">Kendala yang Dihadapi:</span>
                    </div>
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      { text: "Feed Instagram tidak menarik?", icon: ImageIcon },
                      { text: "Stuck ide konten tiap minggu?", icon: Lightbulb },
                      { text: "Reels sudah coba, tapi views tetap seret?", icon: Video },
                      { text: "Engagement makin turun, promosi tidak maksimal?", icon: TrendingDown },
                      { text: "Brand awareness tidak naik-naik?", icon: Target }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-600 text-xs sm:text-base">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="bg-green-100 px-3 py-1 rounded-lg">
                    <span className="text-green-500">Solusi Dari WELCOMPLAY:</span>
                  </div>
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Konten eye-catching dengan visual yang menarik",
                      "Content calendar dengan ide kreatif tiap minggu",
                      "Strategi Reels yang viral dan trending",
                      "Sistem engagement dan promosi yang efektif",
                      "Brand storytelling yang konsisten dan memorable"
                    ].map((solution, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-700 text-xs sm:text-base">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Link href={buildWhatsappUrl('Social Content Creation')} target="_blank" rel="noopener noreferrer" className="group/btn bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 sm:py-3 px-8 sm:px-8 rounded-full sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                  <span>Konsultasi Gratis</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Website Development */}
          <div className="bg-none rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 relative overflow-hidden shadow-lg sm:shadow-none border-2 border-transparent bg-gradient-to-br from-blue-50 via-indigo-50 to-white sm:bg-none sm:border-0">
            {/* Background Image - Hidden below 1335px */}
            <div className="absolute inset-0 z-0 hidden 2xl:block group">
              <Image
                src="/images/premiumcard1.png"
                alt="Premium Card Background"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.01]"
              />
            </div>
            
            {/* White background for screens below 1335px */}
            <div className="absolute inset-0 z-0 2xl:hidden bg-white rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header with Icon and Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-5 sm:mb-8">
                {/* Icon */}
                {/* <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Code className="h-10 w-10 text-white" />
                </div> */}
                
                {/* Title and Description */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-[#3B82F6] via-[#6366F1] via-[#4F46E5] to-[#4338CA] bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight whitespace-normal break-words">
                    <AuroraText colors={["#3B82F6", "#6366F1", "#4F46E5", "#4338CA"]}>Web Development</AuroraText>
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-lg leading-relaxed whitespace-normal break-words">
                    Web yang cepat, responsif, dan SEO-friendly untuk meningkatkan performa bisnis Anda
                  </p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
                {/* Pain Points */}
                <div className="space-y-3 sm:space-y-4 pb-5 lg:pb-0 border-b-2 border-dashed border-blue-200 lg:border-0">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="bg-red-100 px-3 py-1 rounded-lg">
                      <span className="text-red-600">Kendala yang Dihadapi:</span>
                    </div>
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      { text: "Website loading lama banget?", icon: Clock },
                      { text: "Mobile view berantakan?", icon: Smartphone },
                      { text: "Google search tidak muncul?", icon: Search },
                      { text: "User experience membingungkan?", icon: Users },
                      { text: "Update konten ribet?", icon: Edit }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-600 text-xs sm:text-base">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="bg-green-100 px-3 py-1 rounded-lg">
                    <span className="text-green-500">Solusi Dari WELCOMPLAY:</span>
                  </div>
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Website super cepat dengan optimasi performa",
                      "Responsive design yang perfect di semua device",
                      "SEO dari awal untuk ranking Google terbaik",
                      "UX yang intuitif dan user-friendly",
                      "CMS mudah untuk update konten tanpa ribet"
                    ].map((solution, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-700 text-xs sm:text-base">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Link href={buildWhatsappUrl('Website Development')} target="_blank" rel="noopener noreferrer" className="group/btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-3 px-8 sm:px-8 rounded-full sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                  <span>Konsultasi Gratis</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
