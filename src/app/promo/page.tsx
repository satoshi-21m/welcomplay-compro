import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import { ImageCarousel } from "@/components/ui/ImageCarousel"
import Image from "next/image"

import { DesktopPromoSlider } from "@/components/ui/DesktopPromoSlider"
import { AdditionalServicesSlider } from "@/components/ui/AdditionalServicesSlider"
import { Metadata } from "next"
import { Check, Star, Clock, Users } from "lucide-react"
import Link from "next/link"
import { 
  AnimatedSection, 
  AnimatedGrid
} from "../../components/animations"

export const metadata: Metadata = {
  title: "Promo & Penawaran Khusus | Welcomplay",
  description: "Dapatkan penawaran khusus dan diskon menarik untuk layanan digital WELCOMPLAY. Jangan lewatkan promo terbatas!",
  keywords: ["promo welcomplay", "diskon digital", "penawaran khusus", "web development", "mobile app", "digital marketing"],
  openGraph: {
    title: "Promo & Penawaran Khusus | Welcomplay",
    description: "Dapatkan penawaran khusus dan diskon menarik untuk layanan digital WELCOMPLAY.",
    type: "website",
    url: "https://welcomplay.com/promo",
  },
}

export default function PromoPage() {



  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-[#f5f6f7] w-full overflow-x-hidden">
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="py-4 bg-gradient-to-b from-[#f5f6f7] to-white w-full overflow-x-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Promo</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Special Offers */}
        <section className="py-2 sm:py-4 lg:py-6 xl:py-8 bg-white w-full overflow-x-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center w-full">
              {/* Left Side - Content */}
              <AnimatedSection animation="fadeInLeft" delay={0.2}>
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full">
                <div>
                  <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                  Harga Hemat,
                  Bisnis Melesat!
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Persiapkan Bisnismu untuk Sukses! Promo harga hemat untuk pembuatan company profile, landing page, katalog produk, dan online shop. Yuk, bikin website keren sekarang sebelum promonya berakhir!
                  </p>
                </div>
                
                <div className="space-y-2 sm:space-y-2 lg:space-y-3">
                  {/* <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                    </div>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-700">Free domain .com untuk project website</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                    </div>
                    <span className="text-sm sm:text-base lg:text-lg text-gray-700">Maintenance dan update gratis 3 bulan</span>
                  </div> */}
                </div>

                <div className="text-center sm:text-left pt-1 sm:pt-2 lg:pt-3">
                  <Link
                    href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20bonus%20spesial.%20Mohon%20informasinya."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-custom-red hover:bg-custom-red-hover text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg"
                  >
                    <Image 
                      src="/images/whatsapp.svg" 
                      alt="WhatsApp" 
                      width={24} 
                      height={24} 
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 brightness-0 invert" 
                    />
                    Konsultasi Sekarang
                  </Link>
                </div>
                </div>
              </AnimatedSection>

              {/* Right Side - Image Carousel */}
              <AnimatedSection animation="fadeInRight" delay={0.3}>
                <div className="flex justify-center lg:justify-end mt-4 lg:mt-0 w-full">
                  <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[280px] xl:max-w-[320px] overflow-hidden">
                    <ImageCarousel />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        

        {/* Promo Packages */}
        <AnimatedSection animation="fadeInUp" delay={0.4}>
          <section className="py-16 bg-white w-full overflow-x-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
              {/* Header Section */}
              <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-custom-red/10 text-custom-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <span className="w-2 h-2 bg-custom-red rounded-full animate-pulse"></span>
                PROMO TERBATAS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Paket Website
                <span className="block text-custom-red">Hemat Hingga 70%</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Dapatkan website profesional dengan harga terbaik! Setiap paket sudah termasuk, 
                domain gratis, hosting, dan support maintenance. Jangan lewatkan promo spesial ini!
              </p>
            </div>



            {/* Promo Cards - All Devices */}
            <div className="w-full overflow-x-hidden">
              <DesktopPromoSlider />
            </div>

            {/* Portfolio Section */}
            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <div className="mt-16 w-full overflow-x-hidden">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Portfolio Website Development
                  </h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Lihat hasil karya website yang sudah kami buat untuk berbagai jenis bisnis
                  </p>
                </div>
                
                <AnimatedGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full overflow-x-hidden p-2" staggerChildren={0.1} delay={0.6}>
                {/* Portfolio Item 1 */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group w-full">
                  <div className="relative overflow-hidden">
                    <img
                      src="/images/hero-1.png"
                      alt="Rumah Keyboard - E-commerce Website"
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Rumah Keyboard</h4>
                    <p className="text-gray-600 mb-3">Website Instagram untuk toko keyboard gaming dengan fitur showcase produk dan booking system</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Instagram</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Booking System</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Item 2 */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group w-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src="/images/hero-2.jpg"
                      alt="Rumah Modifikasi - E-commerce Platform"
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Rumah Modifikasi</h4>
                    <p className="text-gray-600 mb-3">Website e-commerce untuk toko sparepart motor dengan sistem pembayaran online</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">E-commerce</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">Payment Gateway</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Item 3 */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group w-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src="/images/hero-3.webp"
                      alt="OneSolid - Corporate Website"
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">OneSolid</h4>
                    <p className="text-gray-600 mb-3">Website company profile untuk perusahaan konstruksi dengan desain modern dan responsif</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Company Profile</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">Responsive</span>
                    </div>
                  </div>
                </div>
                </AnimatedGrid>

                <div className="text-center mt-12">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-3 bg-custom-red hover:bg-custom-red-hover text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Lihat Semua Portfolio
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        </AnimatedSection>

        {/* Layanan Ekstra Section */}
        <AnimatedSection animation="fadeInUp" delay={0.7}>
          <section className="py-20 bg-gradient-to-b from-white to-red-200 w-full overflow-x-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Layanan Ekstra dari Kami
                </h2>
              </div>

              <div className="relative w-full overflow-x-hidden">
                {/* 3D Robot Graphic */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                </div>

                {/* Services Grid */}
                <AnimatedGrid className="grid md:grid-cols-2 gap-8 relative z-20 w-full overflow-x-hidden" staggerChildren={0.1} delay={0.8}>
                {/* Service 1 */}
                <div className="text-gray-800 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm w-full">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-custom-red">01</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Dukungan Pengguna</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Tim kami siap memberikan dukungan teknis dan bantuan dalam pengelolaan website Anda kapan saja.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service 2 */}
                <div className="text-gray-800 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm w-full">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-custom-red">02</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Keamanan Tinggi</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Kami menerapkan praktik keamanan terbaik untuk melindungi website Anda dari ancaman dan serangan cyber.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service 3 */}
                <div className="text-gray-800 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm w-full">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-custom-red">03</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Optimasi SEO</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Setiap website yang kami bangun dioptimalkan untuk mesin pencari untuk meningkatkan visibilitas dan trafik organik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service 4 */}
                <div className="text-gray-800 p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm w-full">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-custom-red">04</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics & Reporting</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Dashboard analytics lengkap dengan laporan performa website, traffic analysis, dan insight bisnis untuk pengambilan keputusan yang lebih baik.
                      </p>
                    </div>
                  </div>
                </div>
                </AnimatedGrid>
              </div>
            </div>
          </section>
        </AnimatedSection>



        {/* CTA Section */}
        <AnimatedSection animation="fadeInUp" delay={0.9}>
          <section className="py-20 bg-gradient-to-r from-custom-red to-red-600 w-full overflow-x-hidden">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full overflow-x-hidden">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Jangan Lewatkan Promo Spesial Ini!
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Promo terbatas hanya untuk 10 klien pertama. Konsultasi gratis dan dapatkan penawaran terbaik untuk project digital Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20dengan%20promo%20spesial.%20Mohon%20informasinya."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-custom-red px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 inline-flex items-center justify-center"
              >
                Konsultasi Gratis Sekarang
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-custom-red transition-all duration-300 inline-flex items-center justify-center"
              >
                Lihat Portfolio
              </Link>
            </div>
            </div>
          </section>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection animation="fadeInUp" delay={1.0}>
          <section className="py-20 bg-gray-50 w-full overflow-x-hidden">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Pertanyaan Yang Sering Diajukan❓ 
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Temukan jawaban untuk pertanyaan umum seputar layanan website development kami
                </p>
              </div>

              <AnimatedGrid className="grid lg:grid-cols-2 gap-8 w-full overflow-x-hidden" staggerChildren={0.1} delay={1.1}>
                {/* Kolom Kiri */}
                <div className="space-y-4 w-full">
                {/* FAQ 1 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apa itu Online Shop?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Online Shop adalah sebuah platform atau toko berbasis internet yang memungkinkan penjual dan pembeli bertransaksi secara daring (online) tanpa harus bertemu langsung.
                    </div>
                  </button>
                </div>

                {/* FAQ 2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apa itu Company Profile?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Company Profile adalah sebuah halaman atau dokumen yang menjelaskan tentang profil perusahaan.
                    </div>
                  </button>
                </div>

                {/* FAQ 3 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apa itu Landing Page?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Landing Page adalah halaman web yang dibuat khusus untuk tujuan pemasaran atau kampanye tertentu.
                    </div>
                  </button>
                </div>

                {/* FAQ 4 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apa yang terjadi dengan website saya jika saya tidak lagi menggunakan jasa Welcomplay?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Website yang kami buat sepenuhnya menjadi milik Anda. Jika di kemudian hari Anda memutuskan untuk mengelola website sendiri atau beralih ke penyedia layanan lain, kami tidak akan menghalangi Anda. Kami juga siap memberikan bantuan untuk memastikan transisi berjalan lancar.
                    </div>
                  </button>
                </div>

                {/* FAQ 5 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apakah saya bisa melakukan diskusi online dengan WELCOMPLAY?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Untuk menghemat waktu dan biaya, kami menyarankan untuk melakukan diskusi secara online melalui platform seperti Google Meet atau Zoom. Anda dapat menghubungi kami untuk membantu mengatur jadwal pertemuan virtual sesuai kenyamanan Anda.
                    </div>
                  </button>
                </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4 w-full">
                {/* FAQ 6 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apa itu Katalog?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Katalog adalah daftar produk atau layanan yang ditawarkan oleh suatu perusahaan.
                    </div>
                  </button>
                </div>

                {/* FAQ 7 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Bagaimana Cara Memesan Promo?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Untuk memesan promo, Anda hanya perlu menghubungi kami melalui informasi yang tertera di situs.
                    </div>
                  </button>
                </div>

                {/* FAQ 8 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Berapa lama proses pembuatan website?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Pembuatan website umumnya memakan waktu antara 25 hingga 40 hari kerja.
                    </div>
                  </button>
                </div>

                {/* FAQ 9 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apakah WELCOMPLAY berbadan hukum? Dan dimana lokasi kantornya?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      WELCOMPLAY adalah perusahaan yang telah berbadan hukum dengan nama PT Lab Welcom Play, dan memiliki kantor fisik yang berlokasi di Jakarta. Jika Anda ingin bertemu langsung untuk berdiskusi, kami dengan senang hati mengundang Anda untuk datang ke kantor kami.
                    </div>
                  </button>
                </div>

                {/* FAQ 10 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                  <button className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        Apakah data saya aman saat menggunakan layanan Welcomplay?
                      </h3>
                      
                    </div>
                    <div className="mt-4 text-gray-600 leading-relaxed">
                      Keamanan data Anda adalah prioritas kami. Website yang kami buat dilengkapi dengan sistem keamanan SSL, backup otomatis, dan firewall untuk melindungi data dari ancaman cyber.
                    </div>
                  </button>
                </div>
                </div>
              </AnimatedGrid>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Masih punya pertanyaan? Hubungi kami langsung!
              </p>
              <Link
                href="https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20punya%20pertanyaan%20tentang%20layanan%20website%20development.%20Mohon%20bantuannya."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-custom-red hover:bg-custom-red-hover text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Image 
                      src="/images/whatsapp.svg" 
                      alt="WhatsApp" 
                      width={24} 
                      height={24} 
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 brightness-0 invert" 
                    />
                Tanya Langsung via WhatsApp
              </Link>
            </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}
