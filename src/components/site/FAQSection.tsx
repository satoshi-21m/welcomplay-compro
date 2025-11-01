"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { FAQSectionProps } from "../../types/index"
import { FAQS } from "../../lib/data"
import { COMPANY_INFO } from "../../lib/navigation"

export const FAQSection = ({
  title = "Pertanyaan yang Sering Diajukan",
  subtitle = "Temukan jawaban untuk pertanyaan umum seputar layanan kami",
  faqs = FAQS
}: FAQSectionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  // CSS Animation classes
  const getAnimationDelay = (index: number) => {
    return `${0.1 + index * 0.1}s`
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 faq-header">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 faq-title">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto faq-subtitle">
            {subtitle}
          </p>
        </div>

        {/* FAQ Grid with CTA Side by Side */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* FAQ Questions - Takes 2/3 of the space */}
          <div className="lg:col-span-2 faq-container">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openItems.has(faq.id)
                
                return (
                  <div
                    key={faq.id}
                    className={`bg-white border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out transform hover:scale-[1.02] faq-item ${
                      isOpen ? 'border-custom-red/40 shadow-lg' : 'border-gray-200'
                    }`}
                    style={{ animationDelay: getAnimationDelay(index) }}
                  >
                    {/* Question */}
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between transition-all duration-500 ease-out ${
                        isOpen ? 'bg-custom-red/5 shadow-sm' : 'hover:bg-gray-50'
                      }`}
                    >
                      <h3 
                        className={`text-sm sm:text-base md:text-lg font-semibold pr-3 sm:pr-4 transition-all duration-500 ease-out ${
                          isOpen ? 'text-custom-red' : 'text-gray-900'
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        <div
                          className={`transition-transform duration-500 ease-out ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        >
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-custom-red transition-colors duration-300" />
                        </div>
                      </div>
                    </button>

                    {/* Answer */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                      }`}
                    >
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4 transform transition-transform duration-500 ease-out">
                        <div className="border-t border-custom-red/20 pt-3 sm:pt-4">
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed transition-all duration-300 ease-out">
                            {faq.answer}
                          </p>
                          <div className="mt-2 sm:mt-3 transition-all duration-300 ease-out delay-100">
                            <span className="inline-block bg-custom-red/10 text-custom-red px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section - Takes 1/3 of the space */}
          <div className="lg:col-span-1 faq-cta">
            <div className="h-full">
              <div className="relative bg-gradient-to-r from-custom-red via-red-600 to-red-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                
                {/* Image that fills the card */}
                <div className="relative flex-1 overflow-hidden rounded-2xl sm:rounded-3xl">
                  <img 
                    src="/images/faq-img.png" 
                    alt="FAQ Illustration" 
                    className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-custom-red/80 via-custom-red/40 to-transparent"></div>
                </div>
                
                {/* Content overlay on the image */}
                <div className="relative z-10 text-center p-4 sm:p-6 bg-custom-red/90">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-white">
                    Masih Punya Pertanyaan?
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 text-white/90 leading-relaxed">
                    Tim kami siap membantu menjawab pertanyaan Anda
                  </p>
                  <div className="flex justify-center">
                    <Link 
                      href={COMPANY_INFO.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white text-custom-red px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-2">
                        Hubungi Kami
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 