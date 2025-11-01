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
import { Code, Zap, Shield, Monitor, BarChart } from "lucide-react"
import type { Metadata } from "next"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Jasa Pembuatan Website Profesional",
  description: "Website profesional, cepat, responsif, dan siap SEO untuk meningkatkan kredibilitas dan penjualan bisnis Anda.",
  keywords: "jasa pembuatan website, web development, website company profile, e-commerce, landing page",
  openGraph: {
    title: "Jasa Pembuatan Website Profesional | Welcomplay",
    description: "Bangun website yang menghasilkan dengan teknologi terdepan dan strategi yang terbukti.",
    type: "website",
  },
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Jasa Pembuatan Website"
              subtitle="Website profesional, cepat, responsif, dan siap SEO untuk meningkatkan kredibilitas dan penjualan bisnis Anda."
              image={{ src: "/images/webdev-hero.png", alt: "Web Development" }}
              ctaText="Konsultasi Gratis"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Pembuatan%20Website."
            />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.2}>
          <SplitSection
            image={{ src: "/images/webdev-split.png", alt: "Kualitas Web Development" }}
            title="Website Modern yang Siap Menghasilkan"
            description="Strategi kami yang berfokus pada pengalaman pengguna, konversi, dan optimasi kinerja menjadikan layanan pembuatan website kami sebagai solusi efektif untuk meningkatkan nilai sekaligus mendorong pertumbuhan bisnis Anda secara signifikan."
            ctaText="Diskusikan Kebutuhan"
            ctaHref="https://wa.me/6282113831700"
            reverse
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.3}>
          <WhyUs
            eyebrow="Keunggulan Kami"
            items={[
              { id: '1', title: 'Kinerja Cepat', description: 'Optimasi performa menyeluruh agar website terasa gesit di semua perangkat.', icon: Zap, points: ['Code splitting & lazy loading', 'Caching & image optimization', 'Skor Lighthouse tinggi'] },
              { id: '2', title: 'SEO-Friendly', description: 'Struktur konten yang benar, meta yang rapi, dan performa yang mendukung ranking.', icon: BarChart, points: ['Schema markup & meta tags', 'Clean URL & sitemap', 'Kecepatan halaman optimal'] },
              { id: '3', title: 'Keamanan Terjamin', description: 'Konfigurasi keamanan dan best practice untuk melindungi data & akses.', icon: Shield, points: ['Proteksi header & rate limit', 'Validasi input & sanitasi', 'Update dependency berkala'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInRight" delay={0.4}>
          <SplitSection
            image={{ src: "/images/webdev-split2.png", alt: "Integrasi & Otomasi" }}
            title="Tarik Pelanggan lebih banyak dengan memiliki sebuah Website!"
            description="Integrasi payment gateway, CRM, analytics, hingga otomasi marketing—kami siapkan agar operasional dan pemasaran Anda lebih efisien. Mari bangun website yang informatif dan memberikan konversi penjualan yang tinggi terhadap bisnis anda"
            ctaText="Minta Rekomendasi"
            ctaHref="https://wa.me/6282113831700"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <Offerings
            eyebrow="Cakupan Layanan"
            items={[
              { id: '1', title: 'Company Profile', description: 'Website perusahaan profesional untuk kredibilitas brand.', image: { src: '/images/hero-1.png', alt: 'Company Profile Website' }, points: ['Desain modern & responsif', 'Halaman profil, layanan, kontak', 'Integrasi peta & formulir'] },
              { id: '2', title: 'Landing Page', description: 'Landing page konversi tinggi untuk campaign dan produk.', image: { src: '/images/hero-2.webp', alt: 'Landing Page' }, points: ['Copywriting fokus konversi', 'Section testimoni & CTA kuat', 'Tracking analytics siap'] },
              { id: '3', title: 'E-Commerce', description: 'Website toko online dengan fitur lengkap untuk manajemen produk dan transaksi.', image: { src: '/images/hero-1.png', alt: 'E-Commerce Website' }, points: ['Katalog & varian produk', 'Keranjang & checkout aman', 'Integrasi payment gateway'] },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.6}>
          <PortfolioSection title="Hasil Pekerjaan Web Development" />
        </AnimatedSection>


        <AnimatedSection animation="fadeInLeft" delay={0.8}>
          <Process
            eyebrow="Alur Kerja"
            subtitle="Proses efektif dan transparan agar proyek berjalan lancar dan tepat waktu."
            steps={[
              { 
                id: '1', 
                title: 'Discovery & Analisis', 
                description: 'Menggali kebutuhan bisnis, target audiens, dan tujuan website secara mendalam.'
              },
              { 
                id: '2', 
                title: 'Perencanaan & Wireframe', 
                description: 'Membuat struktur website, sitemap, dan wireframe untuk layout yang optimal.'
              },
              { 
                id: '3', 
                title: 'Desain UI/UX', 
                description: 'Membuat desain visual yang modern, responsif, dan sesuai brand guidelines.'
              },
              { 
                id: '4', 
                title: 'Development & Coding', 
                description: 'Implementasi website dengan teknologi terbaru dan best practices coding.'
              },
              { 
                id: '5', 
                title: 'Testing & Quality Assurance', 
                description: 'Pengujian menyeluruh untuk memastikan website berfungsi sempurna di semua perangkat.'
              },
              { 
                id: '6', 
                title: 'Launch & Deployment', 
                description: 'Deploy website ke server production dengan konfigurasi optimal dan keamanan tinggi.'
              },
              { 
                id: '7', 
                title: 'Post-Launch Support', 
                description: 'Monitoring performa, maintenance, dan dukungan teknis setelah website live.'
              }
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={0.9}>
          <TestimonialsSection title="Apa Kata Klien" />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={1.0}>
          <FAQSection
            title="Pertanyaan Umum seputar Pembuatan Website"
            faqs={[
              { id: 'web-1', question: 'Berapa lama waktu pembuatan website?', answer: 'Biasanya 2–4 minggu untuk paket basic, dan 4–8 minggu untuk kustom, bergantung jumlah halaman, integrasi, dan revisi.', category: 'Web' },
              { id: 'web-2', question: 'Apakah harga sudah termasuk domain dan hosting?', answer: 'Opsional. Kami dapat bantu pengadaan domain/hosting atau menggunakan aset yang sudah Anda miliki.', category: 'Web' },
              { id: 'web-3', question: 'Apakah website sudah mobile responsive dan SEO dasar?', answer: 'Ya, seluruh website dibuat mobile responsive dan disertai SEO on-page dasar (title, meta, struktur heading, sitemap).', category: 'Web' },
              { id: 'web-4', question: 'Apakah bisa kustom desain dan fitur?', answer: 'Bisa. Paket Enterprise mendukung kustom penuh (desain, fitur, integrasi).', category: 'Web' },
              { id: 'web-5', question: 'Bagaimana dukungan maintenance setelah go-live?', answer: 'Kami menyediakan paket maintenance opsional untuk update konten, patch keamanan, backup, dan pemantauan.', category: 'Web' },
            ]}
          />
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={1.1}>
          <CTASection
            title="Siap Bangun Website Profesional?"
            subtitle="Konsultasi gratis sekarang dan dapatkan penawaran terbaik untuk bisnis Anda."
            buttonText="Konsultasi Gratis"
            buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Jasa%20Pembuatan%20Website."
          />
        </AnimatedSection>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}


