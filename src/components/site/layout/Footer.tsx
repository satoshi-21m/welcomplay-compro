import { COMPANY_INFO } from "@/lib/navigation"
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
        <footer className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-custom-red/5 via-transparent to-custom-red/5"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-custom-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-custom-red/10 rounded-full blur-3xl"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Top Section with Logo and Description */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <img src="/images/welcomplay-logo.svg" alt="WELCOMPLAY" className="h-12 w-auto sm:h-16" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm px-4">
            Perusahaan transformasi digital yang membantu bisnis Anda tumbuh secara digital dengan solusi teknologi terdepan.
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Layanan Kami */}
          <div className="group col-start-1 row-start-1 lg:col-start-1 lg:row-start-1">
            <h3 className="text-xs sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 text-gray-900">
              Layanan Kami
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                "Web Development",
                "Mobile App Development", 
                "Social Media Content Creation",
                "Digital Advertising",
                "Search Engine Optimization (SEO)",
                "Visual Ad Creation"
              ].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-custom-red transition-all duration-300 flex items-center gap-2 group/link text-xs sm:text-sm lg:text-base">
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">{service}</span>
                    <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 opacity-0 group-hover/link:opacity-100 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div className="group col-start-2 row-start-1 lg:col-start-2 lg:row-start-1">
            <h3 className="text-xs sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 text-gray-900">
              Perusahaan
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                "Tentang",
                "Blog", 
                "Karir",
                "Portfolio",
                "Kontak"
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-custom-red transition-all duration-300 flex items-center gap-2 group/link text-xs sm:text-sm lg:text-base">
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">{item}</span>
                    <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 opacity-0 group-hover/link:opacity-100 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="group col-start-1 row-start-2 lg:col-start-3 lg:row-start-1">
            <h3 className="text-xs sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 text-gray-900">
              Social Media
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { 
                  icon: Instagram, 
                  name: "@welcomplay", 
                  color: "hover:text-pink-600",
                  href: "https://www.instagram.com/welcomplay/",
                  bgColor: "bg-pink-50 hover:bg-pink-100"
                },
                { 
                  icon: Facebook, 
                  name: "welcomplay.official", 
                  color: "hover:text-blue-600",
                  href: "https://www.facebook.com/welcomplay.official",
                  bgColor: "bg-blue-50 hover:bg-blue-100"
                },
                { 
                  icon: Linkedin, 
                  name: "welcomplay", 
                  color: "hover:text-blue-700",
                  href: "https://id.linkedin.com/company/welcomplay",
                  bgColor: "bg-blue-50 hover:bg-blue-100"
                },
                { 
                  icon: "tiktok", 
                  name: "@welcomplay.official", 
                  color: "hover:text-black",
                  href: "https://www.tiktok.com/@welcomplay.official",
                  bgColor: "bg-gray-50 hover:bg-gray-100"
                }
              ].map((social, index) => (
                <li key={index}>
                  <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-gray-600 transition-all duration-300 flex items-center gap-2 group/link text-xs sm:text-sm lg:text-base ${social.color}`}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center group-hover/link:bg-white group-hover/link:shadow-md transition-all duration-300 ${social.bgColor}`}>
                      {social.icon === "tiktok" ? (
                        <Image 
                          src="/images/tiktok-welcomplay.svg" 
                          alt="TikTok" 
                          width={20} 
                          height={20} 
                          className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" 
                        />
                      ) : (
                        <social.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                      )}
                    </div>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div className="group col-start-2 row-start-2 lg:col-start-4 lg:row-start-1">
            <h3 className="text-xs sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 text-gray-900">
              Hubungi Kami
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 group/contact">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover/contact:bg-custom-red group-hover/contact:text-white transition-all duration-300 flex-shrink-0">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base group-hover/contact:text-gray-900 transition-colors duration-300">
                  Jl. Kedoya Agave Raya Blok A1 No.34, Kb. Jeruk, Jakarta Barat 11520
                </p>
              </div>
              <div className="flex items-center gap-2 group/contact">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover/contact:bg-custom-red group-hover/contact:text-white transition-all duration-300 flex-shrink-0">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </div>
                <a href="tel:+6282113831700" className="text-gray-600 hover:text-custom-red transition-colors duration-300 text-xs sm:text-sm lg:text-base">
                  +62 821-1383-1700
                </a>
              </div>
              <div className="flex items-center gap-2 group/contact">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover/contact:bg-custom-red group-hover/contact:text-white transition-all duration-300 flex-shrink-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </div>
                <a href="mailto:sales@welcomplay.com" className="text-gray-600 hover:text-custom-red transition-colors duration-300 text-xs sm:text-sm lg:text-base">
                  sales@welcomplay.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200/50 pt-4 sm:pt-6">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
