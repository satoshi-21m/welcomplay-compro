"use client"

import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react"
import Image from "next/image"
import { 
  StaggerContainer, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  ScaleIn,
  AnimatedButton,
  contactPageVariants,
  contactFormVariants,
  contactInfoVariants,
  contactMapVariants
} from "../../components/animations"
import { useContactPageAnimation } from "../../hooks/usePageAnimation"

export function ContactContent() {
  const { getStaggerDelay } = useContactPageAnimation()

  // Contact data
  const contactData = {
    hero: {
      title: "Hubungi Kami",
      subtitle: "Siap membantu mewujudkan ide digital Anda menjadi kenyataan",
      description: "Tim ahli WELCOMPLAY siap memberikan solusi terbaik untuk kebutuhan digital bisnis Anda"
    },
    contactInfo: {
      email: "info@welcomplay.com",
      phone: "+62 812-3456-7890",
      whatsapp: "+62 812-3456-7890",
      address: "Jakarta, Indonesia",
      workingHours: "Senin - Jumat: 09:00 - 18:00 WIB"
    },
    services: [
      {
        icon: "🌐",
        title: "Web Development",
        description: "Website modern dan responsive"
      },
      {
        icon: "📱",
        title: "Mobile App",
        description: "Aplikasi mobile native & cross-platform"
      },
      {
        icon: "📢",
        title: "Digital Marketing",
        description: "Strategi marketing yang efektif"
      },
      {
        icon: "📸",
        title: "Photography & Video",
        description: "Konten visual berkualitas tinggi"
      }
    ]
  }

  return (
    <>
      {/* Breadcrumb */}
      <FadeInUp delay={0.1}>
        <div className="py-4 bg-[#f5f6f7]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <a href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-700 font-medium">Contact</span>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Hero Section */}
      <FadeInUp delay={0.2}>
        <div className="py-6 bg-[#f5f6f7]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-start">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                Hubungi Kami
              </h1>
            </div>
          </div>
        </div>
      </FadeInUp>
      
      {/* Contact Content */}
      <StaggerContainer 
        className="py-2 bg-[#f5f6f7] mb-16"
        staggerChildren={0.15}
        delay={0.3}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unified Contact Card (Image + Info) */}
          <ScaleIn delay={getStaggerDelay(0)}>
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
              <div className="flex flex-col lg:flex-row items-stretch">
                {/* Image and Social Media Container */}
                <div className="flex flex-row lg:flex-col items-start gap-2 sm:gap-3 md:gap-4 lg:gap-0">
                  {/* Image */}
                  <FadeInLeft delay={getStaggerDelay(1)}>
                    <div className="flex-none w-auto lg:w-auto flex justify-center lg:justify-start p-2 sm:p-3 md:p-4 lg:p-6">
                      <div className="aspect-[9/16] w-20 sm:w-24 md:w-32 lg:w-40 xl:w-56">
                        <img
                          src="/images/contact-us.jpg"
                          alt="Contact Us"
                          className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl shadow-md"
                        />
                      </div>
                    </div>
                  </FadeInLeft>

                  {/* Social Media - Right side of image on mobile */}
                  <div className="lg:hidden flex flex-col gap-1.5 sm:gap-2 md:gap-3 justify-center pt-2 sm:pt-4 md:pt-6 lg:pt-8">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <a href="https://www.instagram.com/welcomplay/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(228, 64, 95, 0.1)' }}>
                        <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#E4405F' }} />
                      </a>
                      <span className="text-gray-700 font-medium text-xs">@welcomplay</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <a href="https://www.facebook.com/welcomplay.official" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="group w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(24, 119, 242, 0.1)' }}>
                        <Facebook className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#1877F2' }} />
                      </a>
                      <span className="text-gray-700 font-medium text-xs">welcomplay.official</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <a href="https://id.linkedin.com/company/welcomplay" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(10, 102, 194, 0.1)' }}>
                        <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#0A66C2' }} />
                      </a>
                      <span className="text-gray-700 font-medium text-xs">welcomplay</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <a href="https://www.tiktok.com/@welcomplay.official" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="group w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                        <Image 
                          src="/images/tiktok-welcomplay.svg" 
                          alt="TikTok" 
                          width={16} 
                          height={16} 
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-opacity duration-200 group-hover:opacity-90" 
                        />
                      </a>
                      <span className="text-gray-700 font-medium text-xs">@welcomplay.official</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <FadeInRight delay={getStaggerDelay(2)}>
                  <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
                    {/* Pindahan teks header */}
                    <div className="mb-3 sm:mb-4 md:mb-6">
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-custom-red mb-1.5 sm:mb-2">Butuh Bantuan atau Konsultasi?</p>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
                        Kami siap membantu kebutuhan digital dan bisnis Anda. Silakan hubungi kami melalui WhatsApp, email, atau kunjungi kantor kami. Kami akan merespon secepatnya di jam operasional.
                      </p>
                    </div>

                    <StaggerContainer 
                      className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-6"
                      staggerChildren={0.1}
                      delay={getStaggerDelay(3)}
                    >
                      <FadeInUp delay={getStaggerDelay(4)}>
                        <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-custom-red/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-custom-red/20 transition-colors duration-200">
                            <Image 
                              src="/images/whatsapp.svg" 
                              alt="WhatsApp" 
                              width={24} 
                              height={24} 
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 filter"
                              style={{ filter: 'invert(21%) sepia(92%) saturate(4046%) hue-rotate(350deg) brightness(92%) contrast(105%)' }}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">WhatsApp</h4>
                            <p className="text-gray-700 text-sm sm:text-base">+62 821-1383-1700</p>
                          </div>
                        </div>
                      </FadeInUp>

                      <FadeInUp delay={getStaggerDelay(5)}>
                        <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-custom-red/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-custom-red/20 transition-colors duration-200">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-custom-red" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Email</h4>
                            <p className="text-gray-700 text-sm sm:text-base">sales@welcomplay.com</p>
                          </div>
                        </div>
                      </FadeInUp>

                      <FadeInUp delay={getStaggerDelay(6)}>
                        <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-custom-red/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-custom-red/20 transition-colors duration-200">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-custom-red" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Telepon</h4>
                            <p className="text-gray-700 text-sm sm:text-base">(021) 2309 3037</p>
                          </div>
                        </div>
                      </FadeInUp>

                      <FadeInUp delay={getStaggerDelay(7)}>
                        <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-custom-red/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-custom-red/20 transition-colors duration-200">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-custom-red" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Alamat</h4>
                            <p className="text-gray-700 text-sm sm:text-base">
                              Jl. Kedoya Agave Raya No.34 Blok A1, Kedoya Sel., Kec. Kb. Jeruk, Jakarta Barat
                            </p>
                          </div>
                        </div>
                      </FadeInUp>

                      <FadeInUp delay={getStaggerDelay(8)}>
                        <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-custom-red/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-custom-red/20 transition-colors duration-200">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-custom-red" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Jam Operasional</h4>
                            <p className="text-gray-700 text-sm sm:text-base">Senin - Jumat, 09.00 - 18.00 WIB</p>
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Social Icons - Hidden on Mobile, Visible on Desktop */}
                      <FadeInUp delay={getStaggerDelay(9)}>
                        <div className="pt-2 hidden lg:block">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-3">
                              <a href="https://www.instagram.com/welcomplay/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(228, 64, 95, 0.1)' }}>
                                <Instagram className="w-5 h-5 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#E4405F' }} />
                              </a>
                              <span className="text-gray-700 font-medium text-sm sm:text-base">@welcomplay</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <a href="https://www.facebook.com/welcomplay.official" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(24, 119, 242, 0.1)' }}>
                                <Facebook className="w-5 h-5 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#1877F2' }} />
                              </a>
                              <span className="text-gray-700 font-medium text-sm sm:text-base">welcomplay.official</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <a href="https://id.linkedin.com/company/welcomplay" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(10, 102, 194, 0.1)' }}>
                                <Linkedin className="w-5 h-5 transition-opacity duration-200 group-hover:opacity-90" style={{ color: '#0A66C2' }} />
                              </a>
                              <span className="text-gray-700 font-medium text-sm sm:text-base">welcomplay</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <a href="https://www.tiktok.com/@welcomplay.official" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-sm hover:scale-[1.03] flex-shrink-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                                <Image 
                                  src="/images/tiktok-welcomplay.svg" 
                                  alt="TikTok" 
                                  width={20} 
                                  height={20} 
                                  className="w-5 h-5 transition-opacity duration-200 group-hover:opacity-90" 
                                />
                              </a>
                              <span className="text-gray-700 font-medium text-sm sm:text-base">@welcomplay.official</span>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>
                    </StaggerContainer>
                  </div>
                </FadeInRight>
              </div>
            </div>
          </ScaleIn>
        </div>
      </StaggerContainer>

      {/* CTA Section */}
      <FadeInUp delay={getStaggerDelay(10)}>
        <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-custom-red to-red-600">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Siap Memulai Project Digital?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Konsultasi gratis dengan tim ahli kami untuk membahas kebutuhan digital bisnis Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <AnimatedButton 
                className="bg-white text-custom-red px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
                delay={getStaggerDelay(11)}
              >
                Konsultasi Gratis
              </AnimatedButton>
              <AnimatedButton 
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white hover:text-custom-red transition-all duration-300"
                delay={getStaggerDelay(12)}
              >
                Lihat Portfolio
              </AnimatedButton>
            </div>
          </div>
        </div>
      </FadeInUp>
    </>
  )
}
