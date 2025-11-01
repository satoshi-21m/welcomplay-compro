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
import { Smartphone, Shield, Zap, Cpu, BarChart, Code, Monitor } from "lucide-react"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Jasa Pembuatan Mobile App",
  description: "Layanan pembuatan aplikasi mobile iOS & Android (native/cross-platform).",
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Jasa Pembuatan Mobile App"
              subtitle="Bangun aplikasi iOS & Android yang cepat, aman, dan mudah dikembangkan. Native maupun cross-platform."
              image={{ src: "/images/mobiledev-hero.png", alt: "Mobile App Development" }}
              ctaText="Diskusikan Ide App"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Pembuatan%20Mobile%20App."
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.2}>
          <SplitSection
            image={{ src: "/images/mobiledev-1.png", alt: "Performa & Skala" }}
            title="Performa Tinggi & Skalabilitas"
            description="Kami merancang arsitektur app yang scalable dengan performa tinggi, memanfaatkan caching, state management yang efisien, dan pipeline CI/CD."
            reverse
            mobileKeepImageFirst
            ctaText="Konsultasi Arsitektur"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.3}>
          <WhyUs
            eyebrow="Keunggulan Kami"
            items={[
              { id: '1', title: 'UX yang Intuitif', description: 'Riset dan prototyping untuk pengalaman pengguna yang mulus.', icon: Smartphone, points: ['Wireframe & prototipe', 'Uji kegunaan', 'Aksesibilitas'] },
              { id: '2', title: 'Performa & Stabilitas', description: 'Optimasi rendering, memori, dan pengelolaan state.', icon: Zap, points: ['Lazy load & split bundle', 'Monitoring crash & log', 'Offline-first opsional'] },
              { id: '3', title: 'Keamanan Kelas Enterprise', description: 'Praktik keamanan aplikasi dan API yang ketat.', icon: Shield, points: ['Secure storage', 'Auth yang aman (OAuth/JWT)', 'Obfuscation & tamper detect'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInRight" delay={0.4}>
          <SplitSection
            image={{ src: "/images/mobiledev-3.jpg", alt: "Integrasi & Analitik" }}
            title="Aplikasi Mobile Custom"
            description="Kami menciptakan aplikasi mobile yang responsif, user-friendly, dan scalable untuk kebutuhan bisnis Anda."
            reverse
            mobileKeepImageFirst
            ctaText="Bahas Integrasi"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <Offerings
            eyebrow="Cakupan Layanan"
            items={[
              { id: '1', title: 'Native App', description: 'Aplikasi iOS/Android native untuk performa maksimal.', image: { src: '/images/hero-3.webp', alt: 'Native App' }, points: ['Swift/Kotlin', 'Akses fitur perangkat penuh', 'Optimasi performa tinggi'] },
              { id: '2', title: 'Cross-Platform', description: 'Satu basis kode untuk iOS & Android.', image: { src: '/images/hero-2.webp', alt: 'Cross-Platform' }, points: ['React Native / Flutter', 'Time-to-market cepat', 'Biaya lebih efisien'] },
              { id: '3', title: 'Backend & API', description: 'Backend terukur dan aman untuk mendukung aplikasi.', image: { src: '/images/promo/spesial-promo-2.webp', alt: 'Backend & API' }, points: ['REST/GraphQL', 'Auth & rate limit', 'Observability'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.6}>
          <PortfolioSection title="Hasil Pekerjaan Mobile App" />
        </AnimatedSection>


        <AnimatedSection animation="fadeInLeft" delay={0.8}>
          <Process
            eyebrow="Alur Kerja"
            subtitle="Proses efektif dan transparan untuk membangun aplikasi berkualitas."
            steps={[
              { 
                id: '1', 
                title: 'Discovery & Research', 
                description: 'Analisis mendalam kebutuhan bisnis, user personas, dan validasi ide aplikasi.'
              },
              { 
                id: '2', 
                title: 'UX Research & Strategy', 
                description: 'Riset user experience, user journey mapping, dan strategi fitur aplikasi.'
              },
              { 
                id: '3', 
                title: 'Wireframing & Prototyping', 
                description: 'Membuat wireframe, user flow, dan prototipe interaktif untuk validasi.'
              },
              { 
                id: '4', 
                title: 'UI Design & Branding', 
                description: 'Desain visual yang menarik, konsisten dengan brand, dan user-friendly.'
              },
              { 
                id: '5', 
                title: 'Development & Integration', 
                description: 'Pengembangan aplikasi dengan arsitektur yang scalable dan integrasi API.'
              },
              { 
                id: '6', 
                title: 'Testing & Quality Assurance', 
                description: 'Testing menyeluruh: unit, integration, user acceptance, dan performance testing.'
              },
              { 
                id: '7', 
                title: 'App Store Submission', 
                description: 'Persiapan dan submission ke App Store/Play Store dengan guideline compliance.'
              },
              { 
                id: '8', 
                title: 'Launch & Post-Launch', 
                description: 'Monitoring performa, crash analytics, dan continuous improvement.'
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.9}>
          <TestimonialsSection title="Apa Kata Klien" />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={1.0}>
          <FAQSection 
            title="Pertanyaan Umum seputar Mobile App"
            faqs={[
              { id: 'mobile-1', question: 'Berapa lama waktu pengembangan aplikasi?', answer: 'MVP sederhana 4–8 minggu. Aplikasi kompleks 8–16+ minggu, tergantung fitur, integrasi, dan revisi.', category: 'Mobile' },
              { id: 'mobile-2', question: 'Pilih native atau cross-platform?', answer: 'Cross-platform efisien untuk iOS & Android sekaligus; native cocok untuk performa/fungsi perangkat yang sangat spesifik.', category: 'Mobile' },
              { id: 'mobile-3', question: 'Apakah membantu publikasi ke App Store/Play Store?', answer: 'Ya. Kami membantu proses submission, provisioning, dan kepatuhan guideline store.', category: 'Mobile' },
              { id: 'mobile-4', question: 'Bagaimana maintenance setelah rilis?', answer: 'Tersedia paket maintenance: bug fixing, update OS & dependency, monitoring crash/analytics.', category: 'Mobile' },
              { id: 'mobile-5', question: 'Apakah mendukung integrasi backend?', answer: 'Ya. Kami dapat membangun backend baru atau integrasi ke sistem/ API yang sudah ada (REST/GraphQL).', category: 'Mobile' },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={1.1}>
          <CTASection
            title="Siap Bangun Mobile App Impian Anda?"
            subtitle="Konsultasi gratis untuk solusi yang tepat dan efisien."
            buttonText="Konsultasi Gratis"
            buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Pembuatan%20Mobile%20App."
          />
        </AnimatedSection>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}


