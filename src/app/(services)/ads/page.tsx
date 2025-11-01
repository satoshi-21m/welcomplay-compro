import { Metadata } from "next"
import { Navbar } from "../../../components/site/layout/Navbar"
import { Footer } from "../../../components/site/layout/Footer"
import { WhatsAppButton } from "../../../components/ui/WhatsAppButton"
import { ServiceHero } from "../../../components/sections/ServiceHero"
import { SplitSection } from "../../../components/sections/SplitSection"
import { WhyUs } from "../../../components/sections/WhyUs"
import { Process } from "../../../components/sections/Process"
import { Offerings } from "../../../components/sections/Offerings"
// import { PortfolioSection } from "../../../components/home/PortfolioSection"
import { TestimonialsSection } from "../../../components/site/TestimonialsSection"
import { FAQSection } from "../../../components/site/FAQSection"
import { CTASection } from "../../../components/sections/CTASection"
import { Zap, Target, BarChart, TrendingUp, Code, Monitor, Shield } from "lucide-react"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Digital Advertising",
  description: "Layanan iklan digital yang tepat sasaran dan ROI tinggi untuk bisnis Anda. Spesialis Google Ads, Facebook Ads, Instagram Ads, dan platform iklan lainnya.",
  keywords: "google ads, facebook ads, instagram ads, digital advertising, iklan online, marketing digital, ROI tinggi",
  openGraph: {
    title: "Digital Advertising - WELCOMPLAY",
    description: "Layanan iklan digital yang tepat sasaran dan ROI tinggi untuk bisnis Anda.",
    type: "website",
  },
}

export default function DigitalAdvertisingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Digital Advertising"
              subtitle="Iklan digital yang tepat sasaran dan ROI tinggi untuk meningkatkan penjualan bisnis Anda"
              image={{ src: "/images/ads-1-hero.png", alt: "Digital Advertising" }}
              ctaText="Konsultasi Gratis"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20Digital%20Advertising."
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.2}>
          <SplitSection
            image={{ src: "/images/ads-2.jpg", alt: "Strategi Iklan Digital" }}
            title="Iklan Digital yang Siap Menghasilkan"
            description="Strategi iklan digital kami yang berfokus pada targeting yang presisi, optimasi berkelanjutan, dan analisis data mendalam menjadikan layanan ads kami sebagai solusi efektif untuk meningkatkan konversi dan ROI bisnis Anda secara signifikan."
            ctaText="Diskusikan Strategi"
            ctaHref="https://wa.me/6282113831700"
            reverse
          />
        </AnimatedSection>
        
        <AnimatedSection animation="scaleIn" delay={0.3}>
          <WhyUs
            eyebrow="Keunggulan Kami"
            items={[
              {
                id: "experienced-team",
                title: "Tim Berpengalaman",
                description: "Tim digital marketing yang telah menangani ratusan kampanye iklan dengan berbagai industri",
                icon: Target,
                points: ["Pengalaman 5+ tahun", "Berbagai industri", "Case study sukses", "Tim bersertifikasi"]
              },
              {
                id: "data-driven",
                title: "Strategi Data-Driven",
                description: "Setiap keputusan iklan berdasarkan data dan analisis performa yang mendalam",
                icon: BarChart,
                points: ["Analytics real-time", "A/B testing", "ROI tracking", "Performance optimization"]
              },
              {
                id: "roi-guaranteed",
                title: "ROI Terjamin",
                description: "Fokus pada hasil yang terukur dan peningkatan konversi yang signifikan",
                icon: TrendingUp,
                points: ["Target konversi", "Budget optimization", "Performance monitoring", "Continuous improvement"]
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInRight" delay={0.4}>
          <SplitSection
            image={{ src: "/images/ads-3.jpg", alt: "Platform Iklan Digital" }}
            title="Tingkatkan Penjualan dengan Iklan Digital yang Tepat Sasaran!"
            description="Dari Google Ads untuk pencarian organik hingga social media ads untuk engagement tinggi—kami siapkan strategi iklan yang sesuai dengan target audiens dan tujuan bisnis Anda. Mari bangun kampanye iklan yang efektif dan memberikan ROI yang optimal."
            ctaText="Minta Rekomendasi"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <Offerings
            eyebrow="Cakupan Layanan"
            items={[
              {
                id: "google-ads",
                title: "Google Ads",
                description: "Iklan pencarian, display, dan video di platform Google",
                image: { src: "/images/hero-1.png", alt: "Google Ads" },
                points: ["Search Ads", "Display Ads", "Video Ads", "Shopping Ads"]
              },
              {
                id: "facebook-instagram-ads",
                title: "Facebook & Instagram Ads",
                description: "Iklan sosial media yang tepat sasaran",
                image: { src: "/images/hero-2.webp", alt: "Facebook Instagram Ads" },
                points: ["Feed Ads", "Story Ads", "Carousel Ads", "Video Ads"]
              },
              {
                id: "tiktok-ads",
                title: "TikTok Ads",
                description: "Iklan video pendek untuk engagement tinggi dan viral potential",
                image: { src: "/images/hero-2.jpg", alt: "TikTok Ads" },
                points: ["Video ads", "Hashtag challenges", "Influencer collaboration", "Trending content"]
              }
            ]}
          />
        </AnimatedSection>

        {/* <PortfolioSection title="Hasil Kampanye Iklan Digital" /> */}


        <AnimatedSection animation="fadeInRight" delay={0.7}>
          <Process
            eyebrow="Alur Kerja"
            subtitle="Proses efektif dan transparan agar kampanye iklan berjalan lancar dan memberikan hasil optimal."
            steps={[
              {
                id: "1",
                title: "Discovery & Market Research",
                description: "Analisis mendalam bisnis, kompetitor, target audiens, dan peluang pasar untuk strategi iklan yang tepat."
              },
              {
                id: "2",
                title: "Strategy & Planning",
                description: "Membuat strategi iklan komprehensif, setting target KPI, dan alokasi budget yang optimal untuk setiap platform."
              },
              {
                id: "3",
                title: "Creative Development",
                description: "Pembuatan materi iklan yang menarik: copywriting, visual design, dan format iklan yang sesuai platform."
              },
              {
                id: "4",
                title: "Campaign Setup & Launch",
                description: "Setup kampanye iklan di semua platform dengan targeting yang presisi dan konfigurasi yang optimal."
              },
              {
                id: "5",
                title: "Active Monitoring & Optimization",
                description: "Monitoring real-time performa kampanye dan optimasi berkelanjutan untuk meningkatkan ROI."
              },
              {
                id: "6",
                title: "Performance Analysis & Reporting",
                description: "Analisis mendalam hasil kampanye dengan laporan detail dan rekomendasi improvement."
              },
              {
                id: "7",
                title: "Scale & Expansion",
                description: "Ekspansi kampanye yang berhasil ke audience baru dan platform tambahan untuk pertumbuhan berkelanjutan."
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.8}>
          <TestimonialsSection title="Apa Kata Klien" />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.9}>
          <FAQSection
            title="Pertanyaan Umum seputar Digital Advertising"
            faqs={[
              { id: 'ads-1', question: 'Berapa minimal budget iklan yang direkomendasikan?', answer: 'Mulai dari Rp 2–5 juta/bulan agar optimasi, A/B testing, dan penargetan dapat berjalan efektif.', category: 'Ads' },
              { id: 'ads-2', question: 'Platform iklan apa saja yang didukung?', answer: 'Kami mendukung Google Ads (Search, Display, Video), Facebook & Instagram Ads, TikTok Ads, dan LinkedIn Ads.', category: 'Ads' },
              { id: 'ads-3', question: 'Kapan hasil kampanye biasanya mulai terlihat?', answer: 'Biasanya 1–2 minggu untuk sinyal awal (CTR, CPC), dan 2–4 minggu untuk metrik konversi yang lebih stabil.', category: 'Ads' },
              { id: 'ads-4', question: 'Apa saja yang termasuk dalam layanan?', answer: 'Riset audiens & kompetitor, setup kampanye, pembuatan materi iklan, monitoring harian, optimasi berkala, serta laporan berkala.', category: 'Ads' },
              { id: 'ads-5', question: 'Apakah bisa berhenti kapan saja?', answer: 'Bisa. Tidak ada kontrak panjang. Namun disarankan minimal 2–3 bulan agar optimasi berjalan optimal.', category: 'Ads' },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={1.0}>
          <CTASection
            title="Siap Meningkatkan Performa Iklan Digital Anda?"
            subtitle="Konsultasi gratis untuk menganalisis peluang iklan digital bisnis Anda"
            buttonText="Konsultasi Gratis"
            buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20Digital%20Advertising."
          />
        </AnimatedSection>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}
