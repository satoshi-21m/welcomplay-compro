"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShimmerButton } from "../magicui/shimmer-button"
import { HeroSectionProps } from "../../types/index"
import { COMPANY_INFO } from "../../lib/navigation"
import { AuroraText } from "@/components/magicui/aurora-text"
import LiquidEther from "@/components/LiquidEther"
import { useHeroAnimations } from "@/hooks/useHeroAnimations"

export const HeroSection = ({ 
  title, 
  subtitle, 
  ctaText, 
  imageSrc, 
  imageAlt 
}: HeroSectionProps) => {
  // Single hero image - no carousel
  const heroImage = { 
    src: "/images/hero-main.webp", 
    alt: "WELCOMPLAY Digital Solutions" 
  }

  // Detect iOS untuk conditional rendering
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(checkIOS)
  }, [])

  // Refs untuk animasi GSAP
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const logoTitleRef = useRef<HTMLHeadingElement>(null)
  const logoSliderRef = useRef<HTMLDivElement>(null)

  // Gunakan custom hook untuk animasi (akan skip untuk iOS jika perlu)
  useHeroAnimations({
    titleRef,
    subtitleRef,
    ctaRef,
    imageRef,
    logoTitleRef,
    logoSliderRef,
  })

  return (
    <section className="relative w-full h-auto lg:h-screen flex flex-col items-start justify-center overflow-visible lg:overflow-hidden px-2 sm:px-6 lg:px-8">
      {/* LiquidEther Background - Full Screen */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#ffffff', '#ffd9d9', '#ffcdcd', '#ffc6c6']}
          // colors={['#dc2626', '#ef4444', '#f87171']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      <div className="container relative z-10 max-w-7xl mx-auto pt-12 sm:pt-20 md:pt-24 lg:pt-28 pb-0 flex-1 flex flex-col">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3 xl:gap-4 items-center flex-1">
          {/* Left Column: Copywriting and Button */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-4 text-center lg:text-left order-1 lg:order-1 mt-10 sm:mt-12 lg:mt-0">
            <div 
              ref={titleRef} 
              className={`${isIOS ? 'hero-animate-1' : 'opacity-0'} will-change-transform`} 
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 leading-tight text-balance max-w-[22ch] sm:max-w-none mx-auto lg:mx-0">
                <AuroraText speed={2}>Ubah Tantangan Digital</AuroraText> {title}
              </h1>
            </div>
            <div 
              ref={subtitleRef} 
              className={`${isIOS ? 'hero-animate-2' : 'opacity-0'} will-change-transform`} 
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              <p className="hero-content mx-auto lg:mx-0 max-w-2xl lg:max-w-none text-sm sm:text-base lg:text-lg xl:text-xl text-gray-800 leading-normal sm:leading-relaxed font-normal">
                {subtitle}
              </p>
            </div>
            <div 
              ref={ctaRef}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center lg:justify-start items-center lg:items-start mt-3 sm:mt-4 lg:mt-2 ${isIOS ? 'hero-animate-3' : 'opacity-0'} will-change-transform`}
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              <Link href={COMPANY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" prefetch={false}>
                <ShimmerButton 
                  className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-200 transform shadow-lg hover:shadow-xl whitespace-pre-wrap shadow-2xl w-auto"
                  shimmerColor="rgba(255, 255, 255, 0.8)"
                  shimmerSize="0.15em"
                  shimmerDuration="2s"
                  borderRadius="100px"
                  background="linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                >
                  <Image 
                    src="/images/whatsapp.svg" 
                    alt="WhatsApp" 
                    width={24} 
                    height={24} 
                    className="h-4 w-4 sm:h-4 sm:w-4 mr-2 brightness-0 invert" 
                  />
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    {ctaText}
                  </span>
                </ShimmerButton>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image - Single Static Image */}
          <div className="flex items-start justify-center lg:justify-end order-2 lg:order-2 mt-5 sm:mt-0 mb-10 sm:mb-8 pt-0 w-full">
            {/* Image Container dengan Hover Scale - hanya 1 wrapper */}
            <div 
              ref={imageRef}
              className={`relative w-full lg:max-w-[550px] xl:max-w-[650px] 2xl:max-w-[700px] mx-auto lg:mx-0 aspect-video rounded-2xl ${isIOS ? 'hero-animate-4' : 'opacity-0'} will-change-transform`}
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                className="object-cover rounded-2xl transition-transform duration-500 ease-out hover:scale-110"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = imageSrc
                }}
              />
            </div>
          </div>
        </div>

        {/* Client Logos Section */}
        <div className="w-full py-1 sm:py-4 text-center mt-0 sm:mt-4 lg:mt-8 mb-1 sm:mb-6">
          <div>
            <h2 
              ref={logoTitleRef}
              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight tracking-tight whitespace-normal break-words mb-2 sm:mb-4 lg:mb-5 ${isIOS ? 'hero-animate-5' : 'opacity-0'} will-change-transform`}
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              Dipercaya{" "}
              <span className="bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent font-bold">
                100+ brand lokal & nasional
              </span>
            </h2>
          </div>
        
        {/* Logo Slider */}
        <div 
          ref={logoSliderRef}
          className={`relative w-full overflow-hidden ${isIOS ? 'hero-animate-6' : 'opacity-0'} will-change-transform`}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div className="flex animate-logo-slide-fast">
              {/* First set of logos */}
              {[
                { src: "/images/clientlogo/logo-scs.png", alt: "SCS" },
                { src: "/images/clientlogo/logo-welcomtax.png", alt: "WelcomTax" },
                { src: "/images/clientlogo/logo-manrose.png", alt: "Manrose" },
                { src: "/images/clientlogo/logo-zaira.png", alt: "Zaira" },
                { src: "/images/clientlogo/logo-welcomlegal.png", alt: "WelcomLegal" },
                { src: "/images/clientlogo/logo-anglow.png", alt: "Anglow" },
                { src: "/images/clientlogo/logo-rg.png", alt: "RG" },
                { src: "/images/clientlogo/logo-st.png", alt: "ST" },
                { src: "/images/clientlogo/logo-pande.png", alt: "Pande" },
                { src: "/images/clientlogo/logo-eagle.png", alt: "Eagle" },
                { src: "/images/clientlogo/logo-sal.png", alt: "SAL" },
                { src: "/images/clientlogo/logo-hans.png", alt: "Hans" },
                { src: "/images/clientlogo/onesolid.png", alt: "OneSolid" },
                { src: "/images/clientlogo/sabrinasalon.png", alt: "Sabrina Salon" },
                { src: "/images/clientlogo/callaweddingshoes.png", alt: "Calla Wedding Shoes" },
                { src: "/images/clientlogo/baex.png", alt: "Baex" },
                { src: "/images/clientlogo/rumah-keyboard.png", alt: "Rumah Keyboard" },
                { src: "/images/clientlogo/rumah-modifikasi.png", alt: "Rumah Modifikasi" }
              ].map((logo, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 px-3 sm:px-4 md:px-6 lg:px-10">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={120}
                    className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                    priority
                  />
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { src: "/images/clientlogo/logo-scs.png", alt: "SCS" },
                { src: "/images/clientlogo/logo-welcomtax.png", alt: "WelcomTax" },
                { src: "/images/clientlogo/logo-manrose.png", alt: "Manrose" },
                { src: "/images/clientlogo/logo-zaira.png", alt: "Zaira" },
                { src: "/images/clientlogo/logo-welcomlegal.png", alt: "WelcomLegal" },
                { src: "/images/clientlogo/logo-anglow.png", alt: "Anglow" },
                { src: "/images/clientlogo/logo-rg.png", alt: "RG" },
                { src: "/images/clientlogo/logo-st.png", alt: "ST" },
                { src: "/images/clientlogo/logo-pande.png", alt: "Pande" },
                { src: "/images/clientlogo/logo-eagle.png", alt: "Eagle" },
                { src: "/images/clientlogo/logo-sal.png", alt: "SAL" },
                { src: "/images/clientlogo/logo-hans.png", alt: "Hans" },
                { src: "/images/clientlogo/onesolid.png", alt: "OneSolid" },
                { src: "/images/clientlogo/sabrinasalon.png", alt: "Sabrina Salon" },
                { src: "/images/clientlogo/callaweddingshoes.png", alt: "Calla Wedding Shoes" },
                { src: "/images/clientlogo/baex.png", alt: "Baex" },
                { src: "/images/clientlogo/rumah-keyboard.png", alt: "Rumah Keyboard" },
                { src: "/images/clientlogo/rumah-modifikasi.png", alt: "Rumah Modifikasi" }
              ].map((logo, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 px-3 sm:px-4 md:px-6 lg:px-10">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={120}
                    className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 