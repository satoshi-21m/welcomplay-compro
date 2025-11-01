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
import { Search, TrendingUp, BarChart, Target } from "lucide-react"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Search Engine Optimization (SEO)",
  description: "Layanan SEO lengkap: riset kata kunci, on-page, off-page, technical SEO, dan analitik untuk meningkatkan visibilitas dan trafik organik.",
  keywords: "seo, search engine optimization, on-page seo, off-page seo, technical seo, local seo, optimasi website",
  openGraph: {
    title: "Search Engine Optimization (SEO) - WELCOMPLAY",
    description: "Naikkan peringkat dan trafik organik dengan strategi SEO komprehensif.",
    type: "website",
  },
}

export default function SEOPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Search Engine Optimization (SEO)"
              subtitle="Tingkatkan peringkat, trafik organik, dan konversi bisnis Anda dengan strategi SEO yang terbukti"
              image={{ src: "/images/seo-hero.png", alt: "Layanan SEO" }}
              ctaText="Konsultasi Gratis"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20SEO."
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.2}>
          <SplitSection
            image={{ src: "/images/seo-2.png", alt: "Strategi SEO" }}
            title="SEO yang Siap Menghasilkan Trafik Organik"
            description="Strategi SEO kami yang berfokus pada riset kata kunci yang tepat, optimasi on-page yang menyeluruh, dan technical SEO yang solid menjadikan layanan SEO kami sebagai solusi efektif untuk meningkatkan peringkat dan trafik organik bisnis Anda secara signifikan."
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
                id: "strategy",
                title: "Strategi Menyeluruh",
                description: "Menggabungkan riset kata kunci, on-page, off-page, technical, dan konten.",
                icon: Search,
                points: ["Riset kata kunci mendalam", "Optimasi on-page lengkap", "Technical SEO", "Content strategy"]
              },
              {
                id: "experience",
                title: "Berpengalaman",
                description: "Tim SEO yang telah menangani berbagai industri dan skala bisnis.",
                icon: Target,
                points: ["Pengalaman 5+ tahun", "Berbagai industri", "Case study sukses", "Tim bersertifikasi"]
              },
              {
                id: "measurement",
                title: "Berbasis Data",
                description: "Keputusan optimasi didorong data dan KPI yang jelas.",
                icon: BarChart,
                points: ["Analytics real-time", "Ranking tracking", "Traffic monitoring", "Conversion analysis"]
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInRight" delay={0.4}>
          <SplitSection
            image={{ src: "/images/seo-3.png", alt: "Optimasi SEO" }}
            title="Tingkatkan Peringkat dan Trafik Organik dengan SEO yang Tepat!"
            description="Dari riset kata kunci yang strategis hingga optimasi teknis yang mendalam—kami siapkan strategi SEO yang sesuai dengan niche dan tujuan bisnis Anda. Mari bangun visibilitas online yang kuat dan memberikan trafik organik yang konsisten."
            ctaText="Minta Rekomendasi"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <Offerings
            eyebrow="Cakupan Layanan"
            items={[
              {
                id: "keyword-research",
                title: "Keyword Research",
                description: "Riset kata kunci mendalam untuk menemukan peluang trafik organik",
                image: { src: "/images/hero-1.png", alt: "Keyword Research" },
                points: ["Search intent mapping", "Competitor gap analysis", "Prioritas keyword", "Content mapping"]
              },
              {
                id: "onpage",
                title: "On-Page Optimization",
                description: "Optimasi konten dan struktur halaman untuk relevansi dan UX",
                image: { src: "/images/hero-2.webp", alt: "On-Page SEO" },
                points: ["Title & meta", "Heading & struktur konten", "Internal linking", "Schema markup"]
              },
              {
                id: "technical",
                title: "Technical SEO",
                description: "Performa teknis situs untuk crawlability dan indexability",
                image: { src: "/images/hero-1.png", alt: "Technical SEO" },
                points: ["Kecepatan situs", "Core Web Vitals", "Sitemaps & robots.txt", "Fixing error crawl"]
              }
            ]}
          />
        </AnimatedSection>

        {/* <PortfolioSection title="Hasil Optimasi SEO" /> */}


        <AnimatedSection animation="fadeInRight" delay={0.7}>
          <Process
            eyebrow="Alur Kerja"
            subtitle="Proses efektif dan transparan agar optimasi SEO berjalan lancar dan memberikan hasil optimal."
            steps={[
              {
                id: "audit",
                title: "Audit SEO",
                description: "Audit menyeluruh: on-page, off-page, dan teknikal."
              },
              {
                id: "planning",
                title: "Perencanaan",
                description: "Roadmap prioritas berdasarkan dampak dan effort."
              },
              {
                id: "implementation",
                title: "Implementasi",
                description: "Eksekusi rekomendasi teknis dan konten."
              },
              {
                id: "monitoring",
                title: "Monitoring & Optimasi",
                description: "Pelacakan KPI dan optimasi berkelanjutan."
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.8}>
          <TestimonialsSection title="Apa Kata Klien" />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.9}>
          <FAQSection
            title="Pertanyaan Umum seputar Search Engine Optimization (SEO)"
            faqs={[
              { id: 'seo-1', question: 'Berapa lama hasil SEO biasanya terlihat?', answer: 'Umumnya 2–3 bulan pertama untuk perbaikan crawl dan indexing, 3–6 bulan untuk peningkatan ranking yang lebih konsisten tergantung kompetisi & skala situs.', category: 'SEO' },
              { id: 'seo-2', question: 'Apakah ada garansi peringkat di halaman 1?', answer: 'Tidak ada pihak yang bisa menjamin posisi tertentu. Kami fokus pada KPI realistis seperti pertumbuhan trafik organik, impresi, ranking kata kunci, dan konversi.', category: 'SEO' },
              { id: 'seo-3', question: 'Apa saja yang termasuk layanan SEO?', answer: 'Audit teknis, riset kata kunci, on-page optimization, technical SEO, rekomendasi/produksi konten, off-page/link building sesuai paket, serta pelaporan berkala.', category: 'SEO' },
              { id: 'seo-4', question: 'Apakah SEO ini aman untuk website?', answer: 'Ya. Kami menggunakan pendekatan white-hat dan mematuhi pedoman mesin pencari untuk menghindari penalti.', category: 'SEO' },
              { id: 'seo-5', question: 'Apakah diperlukan akses ke website dan tools?', answer: 'Ya. Akses CMS/hosting (jika implementasi kami), Google Analytics/GA4, dan Google Search Console diperlukan untuk monitoring & optimasi.', category: 'SEO' },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={1.0}>
          <CTASection
            title="Siap Naik Peringkat di Google?"
            subtitle="Konsultasi gratis untuk audit dan strategi SEO bisnis Anda"
            buttonText="Konsultasi Gratis"
            buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20SEO."
          />
        </AnimatedSection>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}

