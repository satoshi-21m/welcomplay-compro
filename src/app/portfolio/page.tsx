import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import { PortfolioClient } from "./PortfolioClient"
import { PortfolioItem, PortfolioResponse } from "../../types"
import { 
  PortfolioPageWrapper, 
  AnimatedSection, 
  AnimatedGrid
} from "../../components/animations"
import { Metadata } from "next"

// Import portfolio actions with caching
import { getLandingPortfolioItems } from '../../lib/actions/portfolio-actions'
import { getCachedAdminPortfolioCategories, getCachedAdminProjectTypes } from '../../lib/actions/admin-portfolio-actions'

// Metadata untuk SEO
export const metadata: Metadata = {
  title: "Portfolio - WELCOMPLAY | Karya Terbaik Web Development, Mobile App, dan Content Creation",
  description: "Lihat portfolio terbaik WELCOMPLAY dalam web development, mobile app development, dan content creation untuk berbagai industri.",
  keywords: ["portfolio welcomplay", "web development", "mobile app", "content creation", "hasil karya"],
  openGraph: {
    title: "Portfolio - WELCOMPLAY | Karya Terbaik Web Development, Mobile App, dan Content Creation",
    description: "Lihat portfolio terbaik WELCOMPLAY dalam web development dan mobile app development",
    type: "website",
    url: "https://welcomplay.com/portfolio",
  },
}

// Server Component dengan ISR
export default async function PortfolioPage() {
  // ⚡ Fetch data di server dengan caching (parallel)
  const [portfolioData, categoriesResult, projectTypesResult] = await Promise.all([
    getLandingPortfolioItems(36),
    getCachedAdminPortfolioCategories(),
    getCachedAdminProjectTypes()
  ])
  
  // Extract data dengan fallback
  const categories = categoriesResult.success ? categoriesResult.data : []
  const projectTypes = projectTypesResult.success ? projectTypesResult.data : []

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-[#f5f6f7]">
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="py-4 bg-[#f5f6f7]">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <a href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                  Home
                </a>
                <span>/</span>
                <span className="text-gray-700 font-medium">Portfolio</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Hero Section */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <div className="py-6 bg-[#f5f6f7]">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-start">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                  Portfolio Kami
                </h1>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Portfolio Showcase */}
        <PortfolioPageWrapper>
          <div className="py-2 bg-[#f5f6f7] mb-16">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="scaleIn" delay={0.3}>
                <PortfolioClient 
                  portfolio={portfolioData} 
                  categories={categories}
                  projectTypes={projectTypes}
                />
              </AnimatedSection>
            </div>
          </div>
        </PortfolioPageWrapper>

        {/* CTA Section */}
        <AnimatedSection animation="fadeInUp" delay={0.4}>
          <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-custom-red to-red-600">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Siap Membuat Project Digital untuk Bisnis Anda?
              </h2>
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Tim ahli WELCOMPLAY siap membantu mewujudkan ide digital Anda menjadi kenyataan dengan teknologi terdepan
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-white text-custom-red px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300">
                  Konsultasi Gratis
                </button>
                <button className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white hover:text-custom-red transition-all duration-300">
                  Lihat Layanan
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}

// ISR dengan revalidation berdasarkan perubahan admin
export const revalidate = false