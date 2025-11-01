"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FrostedCard } from "../../ui/frosted-card"
import { NavigationProgressBar } from "@/components/ui/NavigationProgressBar"
import { useMobileMenuStagger } from "@/hooks/useMobileMenuStagger"

import { Code, Smartphone, Search, Instagram, Megaphone, Palette, Menu, Info, PenTool, Handshake, Briefcase as WorkBag, Phone, Gift, Home } from "lucide-react"
import { useNavbar } from "@/lib/useNavbar"
import { useServicesDropdown } from "@/lib/useServicesDropdown"
import { NAV_ITEMS, COMPANY_INFO, SERVICES } from "@/lib/navigation"
import { NavItem } from "@/types/index"

interface NavbarProps {
  className?: string
  isHomepage?: boolean
}

export const Navbar = ({ className = "", isHomepage = false }: NavbarProps) => {
  const pathname = usePathname()
  
  // Custom CSS for WhatsApp pulse animation & Glass effect optimization
  const pulseStyle = `
    @keyframes whatsapp-pulse {
      0% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.2; }
      100% { transform: scale(1); opacity: 0.3; }
    }

    /* Glass effect dengan fallback untuk browser lama - ULTRA BLUR */
    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
      .glass-dropdown {
        -webkit-backdrop-filter: blur(80px) saturate(220%) brightness(1.1);
        backdrop-filter: blur(80px) saturate(220%) brightness(1.1);
      }
      .glass-item {
        -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(1.05);
        backdrop-filter: blur(30px) saturate(200%) brightness(1.05);
      }
    }

    /* Fallback untuk browser tanpa backdrop-filter support */
    @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
      .glass-dropdown {
        background-color: #ffffff !important;
      }
      .glass-item {
        background-color: #f9fafb !important;
      }
    }

    /* Hardware acceleration untuk smooth animations */
    .dropdown-optimized {
      will-change: opacity, transform;
      transform: translate3d(0, 0, 0);
      -webkit-transform: translate3d(0, 0, 0);
    }
  `;
  
  const {
    isNavbarVisible,
    isNavbarFixed
  } = useNavbar()

  const { 
    isServicesOpen, 
    handleMouseEnter, 
    handleMouseLeave
  } = useServicesDropdown()

  // Hover state untuk Services dropdown (layout split)
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null)

  // Peta gambar untuk tiap service (kanan)
  const serviceImageById: Record<string, string> = {
    'web-development': '/images/featuresimg/web.jpg',
    'mobile-app-development': '/images/featuresimg/mobile.jpg',
    'social-media-management': '/images/featuresimg/smm.jpg',
    'google-social-media-ads': '/images/featuresimg/ads.jpg',
    'seo': '/images/featuresimg/seo.png',
    'photography-videography': '/images/featuresimg/fotovideo.jpg'
  }

  // Mobile detection dengan debounce untuk performa
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 855) // navBreak breakpoint (855px)
      }, 100)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Debug console untuk desktop
  useEffect(() => {
    if (!isMobile) {
      console.log('Desktop Navbar State:', { isNavbarVisible, isNavbarFixed })
    }
  }, [isNavbarVisible, isNavbarFixed, isMobile])

  // Keyboard navigation untuk dropdown - Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isServicesOpen && e.key === 'Escape') {
        handleMouseLeave()
      }
    }

    if (isServicesOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isServicesOpen, handleMouseLeave])

  // Mobile dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  const toggleDropdown = (dropdownName: string) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(dropdownName)
    }
  }
  
  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  // Staggered animation for mobile menu
  const menuPanelRef = useMobileMenuStagger(openDropdown === 'home')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('#mobile-capsule')) {
        closeDropdown()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />
      
      {/* Conditional Rendering: Desktop OR Mobile Navbar */}
      {!isMobile ? (
        // Desktop Navbar
        <header className={`w-full flex justify-center py-0 sm:py-2 ${isHomepage ? 'bg-transparent absolute' : 'bg-[#f5f6f7] relative'} top-0 left-0 right-0 z-50 ${className}`}>
          <FrostedCard 
            className={`navbar-transition navbar-font relative overflow-hidden ${
              isNavbarFixed 
                ? 'fixed top-0 sm:top-2 left-1/2 transform -translate-x-1/2 z-50 shadow-xs' 
                : 'shadow-xs'
            } ${
              isNavbarFixed 
                ? 'w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-6xl xl:max-w-7xl' 
                : 'container max-w-6xl xl:max-w-7xl mx-2 sm:mx-4'
            } flex items-center justify-between rounded-full ${isHomepage ? 'bg-white/20 border-white/10' : 'bg-white/90 border-gray-200/50'} backdrop-blur-xl border px-3 sm:px-4 md:px-6 h-12 sm:h-14 md:h-16 transition-all duration-300 ease-out ${
              isNavbarFixed 
                ? (isNavbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4')
                : 'opacity-100 translate-y-0'
            }`}
            style={{
              display: isNavbarFixed && !isNavbarVisible ? 'none' : 'flex'
            }}
          >
            {/* Desktop Content */}
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900 flex-shrink-0 title-font" prefetch={false}>
                <Image 
                  src={COMPANY_INFO.logo} 
                  alt={`${COMPANY_INFO.name} Logo`} 
                  width={210} 
                  height={60} 
                  className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 lg:w-28 lg:h-14" 
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden navBreak:flex navBreak:gap-1 navBreak:gap-2 xl:gap-3 text-gray-800 items-center text-xs sm:text-xs md:text-sm lg:text-base">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href}>
                    {item.children ? (
                      <div 
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          pathname.startsWith('/jasa-pembuatan-website') || pathname.startsWith('/jasa-pembuatan-mobile-app') || pathname.startsWith('/jasa-search-engine-optimization') || pathname.startsWith('/jasa-manajemen-sosial-media') || pathname.startsWith('/jasa-kelola-google-dan-sosial-media-ads') || pathname.startsWith('/visual-ad-creation')
                            ? 'text-custom-red font-semibold' 
                            : 'text-gray-800 hover:text-custom-red'
                        }`}>
                          {item.label}
                          <svg
                            className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                              isServicesOpen ? "rotate-180" : "rotate-0"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <Link 
                        href={item.href} 
                        className={`transition-all duration-300 px-3 py-2 rounded-xl ${
                          (!item.href.startsWith('#') && (pathname === item.href || pathname.startsWith(item.href + '/')))
                            ? 'bg-custom-red/10 text-red-600 font-medium' 
                            : 'text-gray-800 hover:text-custom-red hover:bg-custom-red/10'
                        }`} 
                        prefetch={false}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <Link href={COMPANY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" prefetch={false}>
                <Button className="bg-custom-red hover:bg-custom-red-hover text-white hidden navBreak:inline-flex rounded-full flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4 py-2">
                  <Image 
                    src="/images/whatsapp.svg" 
                    alt="WhatsApp" 
                    width={16} 
                    height={16} 
                    className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 brightness-0 invert" 
                  />
                  Konsultasi Gratis
                </Button>
              </Link>
            </div>
            
            {/* Progress Bar integrated as border-bottom */}
            <NavigationProgressBar />
          </FrostedCard>

          {/* Services Dropdown */}
          <div 
            className={`${
              isNavbarFixed 
                ? 'fixed top-16 sm:top-18 md:top-20 left-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-6xl xl:max-w-7xl'
                : 'absolute top-full left-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-6xl xl:max-w-7xl'
            } mt-2 z-[9999] transition-all duration-500 ease-out dropdown-optimized`}
            style={{
              transform: isServicesOpen 
                ? 'translateX(-50%) translateY(0) scale(1)' 
                : 'translateX(-50%) translateY(0.5rem) scale(0.95)',
              opacity: isServicesOpen ? 1 : 0,
              pointerEvents: isServicesOpen ? 'auto' : 'none'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="menu"
            aria-label="Services menu"
            aria-hidden={!isServicesOpen}
          >
            <div className="glass-dropdown bg-white shadow-[0_8px_40px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 navBreak:grid-cols-2 gap-0">
                {/* Kiri: daftar layanan dengan pengelompokan */}
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 px-3">Layanan Kami</h3>
                  
                  {/* Technology Group */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-3 mb-2">Technology</div>
                    {SERVICES.filter(svc => ['web-development', 'mobile-app-development'].includes(svc.id)).map((svc) => {
                      const isActive = pathname === svc.href || pathname.startsWith(svc.href + '/');
                      const Icon = svc.icon
                      return (
                        <Link
                          key={svc.id}
                          href={svc.href}
                          className={`flex items-start gap-3 cursor-pointer rounded-2xl transition-all duration-300 group p-3 transform ${
                            isActive
                              ? 'bg-gradient-to-r from-custom-red to-red-600 text-white shadow-lg'
                              : 'glass-item hover:bg-gray-50 text-gray-700 hover:scale-[1.02]'
                          }`}
                          onMouseEnter={() => setHoveredServiceId(svc.id)}
                          onMouseLeave={() => setHoveredServiceId(null)}
                          prefetch={false}
                          role="menuitem"
                          aria-label={`${svc.title}: ${svc.description}`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            isActive ? 'bg-white/20' : 'bg-red-100 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-red-700'
                          }`}>
                            {Icon && <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-red-600 group-hover:text-white'}`} />}
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'group-hover:text-custom-red'}`}>{svc.title}</div>
                            <div className={`text-xs mt-0.5 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>{svc.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Digital Marketing Group */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-3 mb-2">Digital Marketing</div>
                    {SERVICES.filter(svc => ['social-media-management', 'google-social-media-ads', 'seo', 'photography-videography'].includes(svc.id)).map((svc) => {
                      const isActive = pathname === svc.href || pathname.startsWith(svc.href + '/');
                      const Icon = svc.icon
                      return (
                        <Link
                          key={svc.id}
                          href={svc.href}
                          className={`flex items-start gap-3 cursor-pointer rounded-2xl transition-all duration-300 group p-3 transform ${
                            isActive
                              ? 'bg-gradient-to-r from-custom-red to-red-600 text-white shadow-lg'
                              : 'glass-item hover:bg-gray-50 text-gray-700 hover:scale-[1.02]'
                          }`}
                          onMouseEnter={() => setHoveredServiceId(svc.id)}
                          onMouseLeave={() => setHoveredServiceId(null)}
                          prefetch={false}
                          role="menuitem"
                          aria-label={`${svc.title}: ${svc.description}`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            isActive ? 'bg-white/20' : 'bg-red-100 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-red-700'
                          }`}>
                            {Icon && <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-red-600 group-hover:text-white'}`} />}
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'group-hover:text-custom-red'}`}>{svc.title}</div>
                            <div className={`text-xs mt-0.5 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>{svc.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Kanan: gambar dinamis */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 hidden navBreak:flex items-center justify-center">
                  <div className="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden">
                    <Image
                      src={hoveredServiceId ? (serviceImageById[hoveredServiceId] || '/images/featuresimg/web.jpg') : '/images/featuresimg/web.jpg'}
                      alt={hoveredServiceId ? `${SERVICES.find(s => s.id === hoveredServiceId)?.title || 'Layanan'} - WELCOMPLAY` : 'Layanan WELCOMPLAY'}
                      fill
                      className="object-cover transition-opacity duration-300"
                      priority={false}
                      loading="lazy"
                      sizes="(max-width: 855px) 0vw, (max-width: 1280px) 40vw, 35vw"
                      quality={85}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        // Mobile Navbar
        <div
          id="mobile-capsule"
          className={`${
            isNavbarFixed 
              ? 'fixed top-0 left-0 right-0 z-40 shadow-none bg-transparent' 
              : `${isHomepage ? 'absolute' : 'relative'} top-0 left-0 right-0 z-40 shadow-none ${isHomepage ? 'bg-transparent' : 'bg-[#f5f6f7]'}`
          } transition-all duration-300 ease-in-out`}
        >
          {/* Main Navigation Header */}
          <div className={`${isNavbarFixed ? 'mt-0' : 'mt-0'}`}>
            <div className={`relative ${isNavbarFixed ? 'supports-[backdrop-filter]:bg-white/10 bg-white/30 backdrop-blur-2xl' : isHomepage ? 'supports-[backdrop-filter]:bg-white/20 bg-white/30 backdrop-blur-xl' : 'bg-white'} navbar-font`}>
              <div className="flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <Link href="/" className="flex items-center title-font" prefetch={false}>
                  <div className="w-6 h-6 bg-none">
                    <Image 
                      src="/images/logo.png" 
                      alt="WELCOMPLAY Logo" 
                      width={24} 
                      height={24} 
                      className="w-full h-full"
                    />
                  </div>
                  <span className="ml-2 mr-1 text-xs font-semibold text-gray-800">WELCOMPLAY</span>
                </Link>

                {/* Right side - Menu Button */}
                <div className="ml-auto flex items-center gap-2">
                  <div className="mr-2">
                    <button
                      className={`flex items-center gap-1 transition-all duration-200 rounded-lg px-3 py-1.5 shadow-none bg-transparent text-black hover:bg-transparent`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleDropdown('home')
                      }}
                      aria-expanded={openDropdown === 'home'}
                    >
                      <span className="text-xs font-medium whitespace-nowrap text-black">Menu</span>
                      <Menu className="h-3 w-3 text-black" />
                    </button>
                  </div>

                  {/* Dropdown Menu dengan Staggered Animation */}
                  <div 
                    ref={menuPanelRef}
                    className={`mobile-menu-dropdown absolute top-full mt-2 left-0 right-0 mx-auto bg-white/95 backdrop-blur-md rounded-xl border-[0.5px] border-gray-200/50 shadow-lg w-[92vw] sm:w-auto sm:min-w-[360px] md:min-w-[420px] sm:max-w-[420px] max-h-[70vh] overflow-y-auto overscroll-contain transition-all duration-300 ease-out z-[9999] ${
                      openDropdown === 'home' 
                        ? 'opacity-100 scale-100 pointer-events-auto' 
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                    style={{
                      transformOrigin: 'center top',
                      WebkitTransformOrigin: 'center top',
                    }}
                  >
                    <div className="py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2">
                        {/* Left Column - Company Pages */}
                        <div className="px-2 min-w-[120px] sm:min-w-[140px] w-auto">
                          <Link
                            href="/"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/' || pathname === '/home'
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <Home className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/' || pathname === '/home'
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Home</span>
                          </Link>
                          <Link
                            href="/about"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/about' || pathname.startsWith('/about')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <Info className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/about' || pathname.startsWith('/about')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Tentang</span>
                          </Link>
                          <Link
                            href="/blog"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/blog' || pathname.startsWith('/blog')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <PenTool className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/blog' || pathname.startsWith('/blog')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Blog</span>
                          </Link>
                          <Link
                            href="/career"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/career' || pathname.startsWith('/career')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <Handshake className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/career' || pathname.startsWith('/career')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Karir</span>
                          </Link>
                          <Link
                            href="/portfolio"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/portfolio' || pathname.startsWith('/portfolio')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <WorkBag className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/portfolio' || pathname.startsWith('/portfolio')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Portofolio</span>
                          </Link>
                          <Link
                            href="/contact"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/contact' || pathname.startsWith('/contact')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <Phone className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/contact' || pathname.startsWith('/contact')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Kontak</span>
                          </Link>
                          <Link
                            href="/promo"
                            className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              pathname === '/promo' || pathname.startsWith('/promo')
                                ? 'bg-custom-red text-white'
                                : 'text-gray-700 hover:bg-custom-red hover:text-white'
                            }`}
                            onClick={closeDropdown}
                            prefetch={false}
                          >
                            <Gift className={`h-3.5 w-3.5 transition-colors duration-200 ${
                              pathname === '/promo' || pathname.startsWith('/promo')
                                ? 'text-white'
                                : 'text-custom-red group-hover:text-white'
                            }`} />
                            <span className="text-xs">Promo</span>
                          </Link>
                        </div>
                        
                        {/* Right Column - Services */}
                        <div className="px-3 border-l border-gray-200/50">
                          {/* Technology Group */}
                          <div className="mb-3">
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Technology</div>
                            <Link
                              href="/jasa-pembuatan-website"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/jasa-pembuatan-website' || pathname.startsWith('/jasa-pembuatan-website')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Code className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/jasa-pembuatan-website' || pathname.startsWith('/jasa-pembuatan-website')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Web Development</span>
                            </Link>
                            <Link
                              href="/jasa-pembuatan-mobile-app"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/jasa-pembuatan-mobile-app' || pathname.startsWith('/jasa-pembuatan-mobile-app')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Smartphone className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/jasa-pembuatan-mobile-app' || pathname.startsWith('/jasa-pembuatan-mobile-app')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Mobile App Development</span>
                            </Link>
                          </div>

                          {/* Digital Marketing Group */}
                          <div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Digital Marketing</div>
                            <Link
                              href="/jasa-manajemen-sosial-media"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/jasa-manajemen-sosial-media' || pathname.startsWith('/jasa-manajemen-sosial-media')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Instagram className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/jasa-manajemen-sosial-media' || pathname.startsWith('/jasa-manajemen-sosial-media')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Social Content Creation</span>
                            </Link>
                            <Link
                              href="/jasa-kelola-google-dan-sosial-media-ads"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/jasa-kelola-google-dan-sosial-media-ads' || pathname.startsWith('/jasa-kelola-google-dan-sosial-media-ads')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Megaphone className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/jasa-kelola-google-dan-sosial-media-ads' || pathname.startsWith('/jasa-kelola-google-dan-sosial-media-ads')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Digital Advertising</span>
                            </Link>
                            <Link
                              href="/jasa-search-engine-optimization"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/jasa-search-engine-optimization' || pathname.startsWith('/jasa-search-engine-optimization')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Search className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/jasa-search-engine-optimization' || pathname.startsWith('/jasa-search-engine-optimization')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Search Engine Optimization (SEO)</span>
                            </Link>
                            <Link
                              href="/visual-ad-creation"
                              className={`mobile-menu-item group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                pathname === '/visual-ad-creation' || pathname.startsWith('/visual-ad-creation')
                                  ? 'bg-custom-red text-white'
                                  : 'text-gray-700 hover:bg-custom-red hover:text-white'
                              }`}
                              onClick={closeDropdown}
                              prefetch={false}
                            >
                              <Palette className={`h-3.5 w-3.5 transition-colors duration-200 ${
                                pathname === '/visual-ad-creation' || pathname.startsWith('/visual-ad-creation')
                                  ? 'text-white'
                                  : 'text-custom-red group-hover:text-white'
                              }`} />
                              <span className="text-xs">Visual Ad Creation</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 