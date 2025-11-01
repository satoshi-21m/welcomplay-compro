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
import { Camera, Palette, Clock, DollarSign } from "lucide-react"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../../components/animations"

export const metadata: Metadata = {
  title: "Visual Ad Creation",
  description: "Pembuatan aset visual iklan yang menarik: banner, video pendek, motion graphic, dan creative ads untuk social media & performance marketing.",
  keywords: "visual ad, ad creative, iklan, banner, video iklan, motion graphic, social media ads, creative assets",
  openGraph: {
    title: "Visual Ad Creation - WELCOMPLAY",
    description: "Pembuatan aset visual iklan yang menarik dan efektif untuk kampanye Anda.",
    type: "website",
  },
}

export default function PhotoVideoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-[#f5f6f7] to-white">
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="bg-gradient-to-b from-[#f5f6f7] to-white">
            <ServiceHero
              title="Visual Ad Creation"
              subtitle="Creative ads yang dirancang untuk performa: cepat dipahami, mudah diingat, dan memicu aksi."
              image={{ src: "/images/ads-1-hero.png", alt: "Visual Ad Creation" }}
              ctaText="Diskusikan Brief"
              ctaHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20Visual%20Ad%20Creation."
              titleClassName="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-tight"
              descClassName="text-base sm:text-lg md:text-xl lg:text-[1.3rem] leading-relaxed"
            />
          </div>
        </AnimatedSection>

        <SplitSection
          image={{ src: "/images/ads-2.jpg", alt: "Ad Creative yang Menarik" }}
          title="Ad Creative yang Siap Menang Tender Iklan"
          description="Kami memproduksi aset iklan yang langsung to-the-point: headline kuat, visual kontras, dan CTA jelas. Cocok untuk Meta Ads, TikTok Ads, Google Display, hingga kampanye awareness."
          ctaText="Minta Ide Kreatif"
          ctaHref="https://wa.me/6282113831700"
          titleClassName="text-2xl sm:text-3xl md:text-4xl lg:text-[1.3rem] leading-tight"
          descClassName="text-base sm:text-lg md:text-xl lg:text-[1.3rem] leading-relaxed"
          reverse
        />
        
        <WhyUs
          eyebrow="Keunggulan Kami"
          items={[
            {
              id: "data-driven",
              title: "Data-Driven Creative",
              description: "Konsep iklan berbasis riset audience dan analisis kompetitor",
              icon: Palette,
              points: ["Research & insight", "Hook & angle library", "Testing framework", "Learning loop"]
            },
            {
              id: "fast-iteration",
              title: "Produksi Cepat",
              description: "Siklus produksi pendek untuk memenuhi kebutuhan testing harian",
              icon: Clock,
              points: ["Turnaround 2-5 hari", "Batching assets", "Templateable", "Revisi cepat"]
            },
            {
              id: "cost-effective",
              title: "Efisien Biaya",
              description: "Optimasi aset agar reusable di multi-channel",
              icon: DollarSign,
              points: ["Multi-format export", "Size & spec siap Ads", "A/B variations", "Brand consistency"]
            }
          ]}
        />

        <SplitSection
          image={{ src: "/images/ads-3.jpg", alt: "Variasi Asset Iklan" }}
          title="Variasi Creative Siap Uji untuk ROAS Lebih Baik"
          description="Satu brief, banyak variasi: static banner, carousel, short video, motion graphic, UGC-style. Kami siapkan beberapa angle agar tim ads Anda bisa testing cepat."
          ctaText="Lihat Contoh"
          ctaHref="https://wa.me/6282113831700"
          titleClassName="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-tight"
          descClassName="text-base sm:text-lg md:text-xl lg:text-[1.3rem] leading-relaxed"
        />

        <Offerings
          eyebrow="Cakupan Layanan"
          items={[
            {
              id: "static-banners",
              title: "Static & Carousel Banners",
              description: "Banner performa tinggi untuk Meta, Google, dan TikTok",
              image: { src: "/images/premiumcard.png", alt: "Static Banners" },
              points: ["Multiple sizes", "High-contrast visual", "Clear CTA", "A/B variations"]
            },
            {
              id: "short-video",
              title: "Short Promo Video",
              description: "Video pendek 10–30 detik untuk iklan dan reels",
              image: { src: "/images/hero-2.webp", alt: "Short Video" },
              points: ["Hook 3 detik pertama", "Caption & supers", "CTA endcard", "UGC-style opsional"]
            },
            {
              id: "motion-graphic",
              title: "Motion Graphic & Animations",
              description: "Animasi informatif untuk penjelasan produk & promo",
              image: { src: "/images/hero-3.webp", alt: "Motion Graphic" },
              points: ["Explainer motion", "Offer highlight", "Iconography", "Brand guideline ready"]
            }
          ]}
        />

        {/* <PortfolioSection title="Hasil Visual Content" /> */}


        <Process
          eyebrow="Alur Kerja"
          subtitle="Proses efektif dan transparan agar project foto dan video berjalan lancar dan memberikan hasil optimal."
          steps={[
            {
              id: "consultation",
              title: "Konsultasi & Briefing",
              description: "Mendiskusikan kebutuhan, konsep, dan timeline project"
            },
            {
              id: "planning",
              title: "Perencanaan & Pre-production",
              description: "Menyiapkan script, storyboard, dan jadwal shooting"
            },
            {
              id: "production",
              title: "Production & Shooting",
              description: "Proses pengambilan foto dan video sesuai konsep"
            },
            {
              id: "post-production",
              title: "Post Production",
              description: "Editing, color grading, dan finalisasi konten"
            }
          ]}
        />

        <TestimonialsSection title="Apa Kata Klien" />

        <FAQSection
          title="Pertanyaan Umum seputar Visual Ad Creation"
          faqs={[
            { id: 'vac-1', question: 'Apakah bisa bantu ide & konsep?', answer: 'Tentu. Kami mulai dari riset audience, menentukan hook/angle, lalu menyusun storyboard singkat untuk tiap aset.', category: 'Visual Ad' },
            { id: 'vac-2', question: 'Berapa lama produksi?', answer: 'Batch awal 2–5 hari kerja tergantung jumlah aset dan kompleksitas. Revisi cepat untuk keperluan testing.', category: 'Visual Ad' },
            { id: 'vac-3', question: 'Output file apa yang didapat?', answer: 'Format siap-unggah: JPG/PNG untuk banner, MP4/H.264 untuk video. Ukuran menyesuaikan channel iklan.', category: 'Visual Ad' },
            { id: 'vac-4', question: 'Apakah termasuk talent/UGC?', answer: 'Opsional. Kami bisa menyediakan talent atau mengarahkan perekaman UGC dari pihak Anda.', category: 'Visual Ad' },
            { id: 'vac-5', question: 'Bisa minta banyak variasi untuk A/B test?', answer: 'Ya, kami sarankan beberapa variasi headline, visual, dan CTA untuk hasil terbaik.', category: 'Visual Ad' },
          ]}
        />

        <CTASection
          title="Siap Tingkatkan Performa Iklan dengan Creative yang Tepat?"
          subtitle="Kirim brief singkat—kami kirimkan konsep dan estimasi waktu produksi."
          buttonText="Diskusikan Brief"
          buttonHref="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20Layanan%20Visual%20Ad%20Creation."
        />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}
