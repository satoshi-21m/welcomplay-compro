import { Navbar } from "../../../components/site/layout/Navbar"
import { Footer } from "../../../components/site/layout/Footer"
import { WhatsAppButton } from "../../../components/ui/WhatsAppButton"
import { ServiceHero } from "../../../components/sections/ServiceHero"
import { SplitSection } from "../../../components/sections/SplitSection"
import { WhyUs } from "../../../components/sections/WhyUs"
import { Offerings } from "../../../components/sections/Offerings"
import { PortfolioSection } from "../../../components/site/PortfolioSection"
import { TestimonialsSection } from "../../../components/site/TestimonialsSection"
import { Process } from "../../../components/sections/Process"
import { FAQSection } from "../../../components/site/FAQSection"
import { CTASection } from "../../../components/sections/CTASection"
import type { Metadata } from "next"
import { Megaphone, BarChart, MessageCircle } from "lucide-react"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Jasa Sosial Media Content Creation",
  description: "Kelola dan optimasi sosial media untuk meningkatkan engagement dan brand awareness.",
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Jasa Sosial Media Content Creation"
              subtitle="Strategi konten, produksi, dan pengelolaan akun untuk meningkatkan engagement, reach, dan konversi."
              image={{ src: "/images/sosmed-hero.png", alt: "Social Media Content Creation" }}
              ctaText="Diskusikan Strategi"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Manajemen%20Sosial%20Media."
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.2}>
          <SplitSection
            image={{ src: "/images/smm-2.jpg", alt: "Strategi & Konten" }}
            title="Strategi Konten yang Terarah"
            description="Riset audience, positioning, kalender konten, dan copywriting untuk hasil yang konsisten dan relevan."
            reverse
            mobileKeepImageFirst
            ctaText="Buat Kalender Konten"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.3}>
          <WhyUs
            eyebrow="Keunggulan Kami"
            items={[
              { id: '1', title: 'Strategi Berbasis Data', description: 'Riset audience, kompetitor, dan tren untuk strategi yang tepat sasaran.', icon: BarChart, points: ['Audit akun & benchmark', 'Analisis insight & KPI', 'Rekomendasi aksi yang jelas'] },
              { id: '2', title: 'Konten yang Menarik', description: 'Desain visual dan copywriting yang kuat untuk meningkatkan engagement.', icon: Megaphone, points: ['Guideline visual & tone', 'Desain feed & story', 'Copywriting & CTA efektif'] },
              { id: '3', title: 'Respons & Monitoring', description: 'Pengelolaan komentar, DM, dan monitoring campaign yang aktif.', icon: MessageCircle, points: ['Moderasi komen & DM', 'Jadwal posting optimal', 'Laporan performa rutin'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInRight" delay={0.4}>
          <SplitSection
            image={{ src: "/images/smm-3.png", alt: "Analitik & Optimasi" }}
            title="Analitik & Optimasi Berkelanjutan"
            description="Monitoring metrik, A/B testing, penyesuaian jam posting, dan iterasi campaign untuk hasil maksimal."
            ctaText="Bahas Target KPI"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <Offerings
            eyebrow="Cakupan Layanan"
            items={[
              { id: '1', title: 'Strategi & Kalender Konten', description: 'Perencanaan konten bulanan berbasis riset audience & tujuan bisnis.', image: { src: '/images/hero-2.webp', alt: 'Strategi Konten' }, points: ['Riset audience & kompetitor', 'Tone of voice & copywriting', 'Kalender konten bulanan'] },
              { id: '2', title: 'Produksi Konten', description: 'Desain feed, story, hingga video pendek untuk meningkatkan engagement.', image: { src: '/images/hero-3.webp', alt: 'Produksi Konten' }, points: ['Desain statis & carousel', 'Video pendek/Reels', 'Caption & hashtag'] },
              { id: '3', title: 'Pengelolaan & Monitoring', description: 'Posting terjadwal, interaksi, dan laporan performa bulanan.', image: { src: '/images/promo/spesial-promo-3.webp', alt: 'Pengelolaan Akun' }, points: ['Jadwal posting & interaksi', 'Moderasi komentar/DM', 'Laporan & rekomendasi'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.6}>
          <PortfolioSection title="Hasil Pekerjaan Sosial Media" />
        </AnimatedSection>


        <AnimatedSection animation="fadeInLeft" delay={0.8}>
          <Process
            eyebrow="Proses Pengerjaan"
            subtitle="Alur kerja sistematis dan transparan untuk memastikan produksi konten sosial media yang berkualitas tinggi, konsisten, dan berdampak maksimal."
            steps={[
              { 
                id: '1', 
                title: 'Brand Discovery & Research', 
                description: 'Riset mendalam brand identity, target audience, kompetitor analysis, dan tren konten untuk menentukan positioning yang tepat.'
              },
              { 
                id: '2', 
                title: 'Content Strategy & Planning', 
                description: 'Penyusunan strategi konten, tone of voice, content pillars, kalender konten, dan roadmap creative yang terstruktur.'
              },
              { 
                id: '3', 
                title: 'Creative Production', 
                description: 'Produksi konten visual berkualitas tinggi (feed, story, Reels, carousel), copywriting yang engaging, dan optimasi creative elements.'
              },
              { 
                id: '4', 
                title: 'Content Optimization', 
                description: 'Optimasi konten untuk setiap platform, penyesuaian format, hashtag research, dan A/B testing creative elements.'
              },
              { 
                id: '5', 
                title: 'Quality Control & Review', 
                description: 'Review konten, penyesuaian final, approval process, dan memastikan konsistensi brand guidelines dan kualitas visual.'
              },
              { 
                id: '6', 
                title: 'Delivery & Performance Tracking', 
                description: 'Pengiriman konten final, monitoring performa, laporan creative insights, dan iterasi untuk continuous improvement.'
              },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.9}>
          <TestimonialsSection title="Apa Kata Klien" />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={1.0}>
          <FAQSection 
            title="Pertanyaan Umum seputar Social Media Content Creation"
            faqs={[
              { id: 'smm-1', question: 'Apa saja yang termasuk dalam produksi konten?', answer: 'Desain feed, story, Reels, carousel, copywriting, dan video pendek. Semua konten disesuaikan dengan brand guidelines dan platform requirements.', category: 'Content Creation' },
              { id: 'smm-2', question: 'Berapa banyak konten yang diproduksi per bulan?', answer: 'Disesuaikan paket. Contoh: Starter 15 konten/bulan, Growth 25 konten/bulan. Kuantitas dapat dikustom sesuai kebutuhan brand.', category: 'Content Creation' },
              { id: 'smm-3', question: 'Platform apa saja yang didukung?', answer: 'Instagram, Facebook, TikTok, dan LinkedIn sebagai standar. Konten dioptimasi untuk setiap platform dengan format yang sesuai.', category: 'Content Creation' },
              { id: 'smm-4', question: 'Apakah termasuk strategi konten dan planning?', answer: 'Ya. Kami menyediakan strategi konten lengkap, content pillars, tone of voice, dan kalender konten bulanan sebagai bagian dari layanan.', category: 'Content Creation' },
              { id: 'smm-5', question: 'Bagaimana proses approval konten?', answer: 'Konten akan dikirim untuk review dan approval sebelum dipublikasi. Revisi dan penyesuaian dapat dilakukan sesuai feedback yang diberikan.', category: 'Content Creation' },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={1.1}>
          <CTASection
            title="Siap Produksi Konten Sosial Media Berkualitas?"
            subtitle="Konsultasi gratis untuk strategi content creation yang efektif dan engaging."
            buttonText="Konsultasi Gratis"
            buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Social%20Media%20Content%20Creation."
          />
        </AnimatedSection>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}


