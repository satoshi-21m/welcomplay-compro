"use client"

import { ParticlesBackground } from "@/components/ui/ParticlesBackground"
import { ServicesSkeleton, WhyChooseUsSkeleton } from "@/components/ui/ServicesSkeleton"
import { Users, Target, Award, Globe, TrendingUp, Heart, CheckCircle, Star, Shield, Lightbulb, Clock, Zap, RefreshCw, Search } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { 
  StaggerContainer, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  ScaleIn,
  AnimatedButton
} from "../../components/animations"
import { useAboutPageAnimation } from "../../hooks/usePageAnimation"
import { AboutSection } from "../../components/site/AboutSection"

export function AboutContent() {
  const { getStaggerDelay } = useAboutPageAnimation()

  return (
    <main className="flex-1 bg-[#f5f6f7]">
      {/* Breadcrumb */}
      <FadeInUp delay={0.1}>
        <div className="py-4 bg-[#f5f6f7]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <a href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-700 font-medium">Tentang</span>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Company Overview */}
      <StaggerContainer 
        className="pt-8 pb-16 bg-[#f5f6f7] relative overflow-hidden"
        staggerChildren={0.15}
        delay={0.2}
      >
        {/* Particles Animation Background */}
        <ParticlesBackground />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInLeft delay={getStaggerDelay(0)}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-custom-red to-red-600 bg-clip-text text-transparent">WELCOMPLAY</span> <br /> Solusi Teknologi Inovatif
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  WELCOMPLAY adalah perusahaan teknologi yang didirikan dengan visi untuk 
                  membuka akses teknologi digital bagi bisnis di Indonesia. 
                  Kami percaya bahwa setiap bisnis, baik UMKM maupun korporat, 
                  berhak mendapatkan solusi digital yang berkualitas tinggi.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Dengan tim ahli yang berpengalaman dan teknologi terkini, 
                  kami membantu klien mengatasi tantangan digital dan mencapai 
                  pertumbuhan bisnis yang berkelanjutan.
                </p>
              </div>
            </FadeInLeft>
            
            <FadeInRight delay={getStaggerDelay(1)}>
              <div className="relative">
                <div className="aspect-square bg-none rounded-3xl overflow-hidden">
                  <Image
                    src="/images/visi-2.png"
                    alt="WELCOMPLAY Vision"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeInRight>
          </div>
        </div>
      </StaggerContainer>

      {/* Visi & Misi dari Homepage */}
      <AboutSection />

      {/* Core Values */}
      <StaggerContainer 
        className="py-20 bg-[#f5f6f7]"
        staggerChildren={0.15}
        delay={0.4}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp delay={getStaggerDelay(0)}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nilai-nilai Inti Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Prinsip yang memandu setiap keputusan dan tindakan kami dalam melayani klien
              </p>
            </div>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Innovation */}
            <FadeInUp delay={getStaggerDelay(1)}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Inovasi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Selalu mencari cara baru dan lebih baik untuk menyelesaikan tantangan teknologi
                </p>
              </div>
            </FadeInUp>

            {/* Quality */}
            <FadeInUp delay={getStaggerDelay(2)}>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kualitas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Berkomitmen memberikan hasil terbaik dengan standar kualitas internasional
                </p>
              </div>
            </FadeInUp>

            {/* Integrity */}
            <FadeInUp delay={getStaggerDelay(3)}>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Integritas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Menjaga kepercayaan klien dengan transparansi dan etika bisnis yang tinggi
                </p>
              </div>
            </FadeInUp>

            {/* Collaboration */}
            <FadeInUp delay={getStaggerDelay(4)}>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kolaborasi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bekerja sama dengan klien dan tim untuk mencapai hasil yang optimal
                </p>
              </div>
            </FadeInUp>

            {/* Excellence */}
            <FadeInUp delay={getStaggerDelay(5)}>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Keunggulan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Berusaha mencapai standar tertinggi dalam setiap proyek dan layanan
                </p>
              </div>
            </FadeInUp>

            {/* Customer Focus */}
            <FadeInUp delay={getStaggerDelay(6)}>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fokus Pelanggan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Memprioritaskan kepuasan dan kesuksesan klien dalam setiap keputusan
                </p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </StaggerContainer>

      {/* Why Choose Us */}
      <StaggerContainer 
        className="py-20 bg-[#f5f6f7]"
        staggerChildren={0.2}
        delay={0.5}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp delay={getStaggerDelay(0)}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih WELCOMPLAY?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Keunggulan yang membedakan kami dari kompetitor dan menjamin kepuasan klien
              </p>
            </div>
          </FadeInUp>

          <div className="max-w-4xl mx-auto">
            <FadeInLeft delay={getStaggerDelay(1)}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tim Ahli Berpengalaman</h3>
                    <p className="text-gray-600">
                      Tim kami terdiri dari profesional teknologi yang telah berpengalaman 
                      dalam berbagai proyek digital dan memahami kebutuhan bisnis lokal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dukungan 24/7</h3>
                    <p className="text-gray-600">
                      Kami memberikan dukungan teknis dan layanan pelanggan yang responsif 
                      untuk memastikan bisnis Anda berjalan lancar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Solusi Cepat & Efisien</h3>
                    <p className="text-gray-600">
                      Menggunakan metodologi Agile untuk memberikan solusi yang cepat, 
                      efisien, dan sesuai dengan timeline yang dijanjikan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-custom-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pemeliharaan Berkelanjutan</h3>
                    <p className="text-gray-600">
                      Tidak hanya membangun, kami juga memberikan layanan pemeliharaan 
                      dan pengembangan berkelanjutan untuk solusi digital Anda.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInLeft>
          </div>
        </div>
      </StaggerContainer>

      {/* CTA Section */}
      <FadeInUp delay={getStaggerDelay(3)}>
        <div className="py-16 bg-gradient-to-r from-custom-red to-red-600">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Siap Bekerja Sama dengan Kami?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Mari diskusikan bagaimana WELCOMPLAY dapat membantu bisnis Anda 
              mencapai tujuan digital dan pertumbuhan yang berkelanjutan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton 
                className="bg-white text-custom-red px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
                delay={getStaggerDelay(4)}
              >
                Konsultasi Gratis
              </AnimatedButton>
              <AnimatedButton 
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-custom-red transition-all duration-300"
                delay={getStaggerDelay(5)}
              >
                Lihat Portfolio
              </AnimatedButton>
            </div>
          </div>
        </div>
      </FadeInUp>
    </main>
  )
}
