import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import CareerComponent from "./CareerComponent"
import { Metadata } from "next"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../components/animations"

export const metadata: Metadata = {
  title: "Karir | Welcomplay",
  description: "Bergabung dengan tim WELCOMPLAY! Temukan kesempatan karir di perusahaan teknologi inovatif dengan remote work, career growth, dan project berdampak.",
  keywords: ["karir welcomplay", "lowongan kerja", "remote work", "web development", "mobile app", "digital marketing", "career growth"],
  openGraph: {
    title: "Karir | Welcomplay",
    description: "Bergabung dengan tim WELCOMPLAY! Temukan kesempatan karir di perusahaan teknologi inovatif.",
    type: "website",
    url: "https://welcomplay.com/career",
  },
}

// ISR - Incremental Static Regeneration untuk career
export default async function CareerPage() {
  // Fetch career data dengan revalidation
  const careerData = {
    hero: {
      title: "Bergabung dengan Tim WELCOMPLAY",
      subtitle: "Membangun masa depan digital bersama talenta-talenta terbaik",
      description: "Kami mencari individu yang passionate, kreatif, dan siap berkontribusi dalam transformasi digital bisnis Indonesia"
    },
    benefits: [
      {
        icon: "💼",
        title: "Remote Work",
        description: "Bekerja dari mana saja dengan fleksibilitas waktu"
      },
      {
        icon: "🚀",
        title: "Career Growth",
        description: "Kesempatan berkembang dan belajar teknologi terbaru"
      },
      {
        icon: "💰",
        title: "Competitive Salary",
        description: "Gaji yang kompetitif sesuai dengan skill dan pengalaman"
      },
      {
        icon: "🎯",
        title: "Impactful Projects",
        description: "Berkontribusi pada project yang berdampak besar"
      }
    ],
    positions: [] // Tidak ada lowongan yang tersedia
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-[#f5f6f7]">
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="py-4">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <a href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                  Home
                </a>
                <span>/</span>
                <span className="text-gray-700 font-medium">Career</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Career Content */}
        <AnimatedSection animation="scaleIn" delay={0.2}>
          <div className="py-2 pb-10 bg-[#f5f6f7]">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CareerComponent careerData={careerData} />
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        {/* <div className="py-20 bg-gradient-to-r from-custom-red to-red-600">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Tidak Ada Posisi yang Cocok?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Kirim CV dan portfolio Anda untuk kesempatan bergabung dengan tim WELCOMPLAY
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-custom-red px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300">
                Kirim CV
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-custom-red transition-all duration-300">
                Hubungi HR
              </button>
            </div>
          </div>
        </div> */}
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}

// ISR dengan revalidation setiap 24 jam
export const revalidate = 86400
