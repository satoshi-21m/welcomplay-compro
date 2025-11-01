import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, Mail, Phone } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f9] px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/images/logo.png" 
                alt="WelcomPlay Logo" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">WELCOMPLAY</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
            {/* Left Column - Error Message */}
            <div className="flex flex-col justify-center space-y-4">
              {/* 404 Number */}
              <div className="relative">
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 leading-none">
                  404
                </h1>
                <div className="absolute -top-2 -left-2 text-8xl font-black text-red-100 -z-10 leading-none">
                  404
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Ups! Halaman yang Anda cari sepertinya sedang bermain petak umpet. Mari kita bantu Anda menemukan jalan kembali.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                  <Home className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  <Search className="h-4 w-4" />
                  Lihat Portfolio
                </Link>
              </div>
            </div>

            {/* Right Column - Quick Links */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Tautan Populer
                </h3>
                
                <div className="space-y-1.5">
                  <Link 
                    href="/web" 
                    className="block p-2.5 rounded-lg hover:bg-white transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors text-sm">
                      ▸ Jasa Pembuatan Website
                    </span>
                  </Link>
                  <Link 
                    href="/mobile" 
                    className="block p-2.5 rounded-lg hover:bg-white transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors text-sm">
                      ▸ Jasa Mobile App Development
                    </span>
                  </Link>
                  <Link 
                    href="/smm" 
                    className="block p-2.5 rounded-lg hover:bg-white transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors text-sm">
                      ▸ Social Media Marketing
                    </span>
                  </Link>
                  <Link 
                    href="/seo" 
                    className="block p-2.5 rounded-lg hover:bg-white transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors text-sm">
                      ▸ SEO Optimization
                    </span>
                  </Link>
                  <Link 
                    href="/blog" 
                    className="block p-2.5 rounded-lg hover:bg-white transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors text-sm">
                      ▸ Blog & Artikel
                    </span>
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Butuh Bantuan?
                </h3>
                <div className="space-y-2">
                  <a 
                    href="mailto:info@welcomplay.com" 
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">info@welcomplay.com</span>
                  </a>
                  <a 
                    href="https://wa.me/6282113831700" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">+62 821-1383-1700</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
            <p className="text-center text-gray-600 text-xs">
              Halaman ini mungkin sudah dipindahkan atau tidak pernah ada. Jika Anda yakin ini adalah kesalahan, silakan{' '}
              <Link href="/contact" className="text-red-600 hover:text-red-700 font-semibold underline">
                hubungi kami
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} WELCOMPLAY. Solusi Digital Terbaik untuk Bisnis Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
