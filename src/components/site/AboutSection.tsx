"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { FrostedCard } from "../ui/frosted-card"
import { PainPointCardProps } from "../../types/index"
import { PAIN_POINTS } from "../../lib/data"

const PainPointCard = ({ painPoint }: PainPointCardProps) => {
  const IconComponent = painPoint.icon

  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${painPoint.gradient} rounded-xl navBreak:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <FrostedCard className="relative p-4 navBreak:p-6 rounded-xl navBreak:rounded-2xl hover:shadow-xl transition-all duration-500 transform bg-white/80 backdrop-blur-xl border border-white/20">
        <div className="space-y-3 navBreak:space-y-4">
          <div className={`w-10 h-10 navBreak:w-12 navBreak:h-12 bg-gradient-to-br ${painPoint.gradient} rounded-lg navBreak:rounded-xl flex items-center justify-center group- transition-transform duration-300 shadow-lg`}>
            <IconComponent className="w-5 h-5 navBreak:w-6 navBreak:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base navBreak:text-lg font-bold text-gray-900 mb-1 navBreak:mb-2">
              {painPoint.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs navBreak:text-sm">
              {painPoint.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-red font-semibold text-xs navBreak:text-sm">
              {painPoint.solution}
            </span>
            <div className={`w-6 h-6 navBreak:w-8 navBreak:h-8 bg-gradient-to-br ${painPoint.gradient} rounded-full flex items-center justify-center group- transition-transform duration-300`}>
              <svg className="w-3 h-3 navBreak:w-4 navBreak:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </FrostedCard>
    </div>
  )
}

export const AboutSection = () => {
  const dividerRef = useRef<HTMLDivElement>(null)
  const [dividerHeight, setDividerHeight] = useState(8) // Start with very small height (8px)
  const lastScrollYRef = useRef(0) // Store last scroll position

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (dividerRef.current) {
            const rect = dividerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const elementTop = rect.top
            const elementBottom = rect.bottom
            
            // Calculate how much of the element is visible
            const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0)
            const totalHeight = rect.height
            const visibilityRatio = Math.max(0, Math.min(1, visibleHeight / totalHeight))
            
            // Calculate scroll progress for line extension
            const scrollY = window.scrollY
            const sectionTop = dividerRef.current.offsetTop
            const sectionHeight = windowHeight * 2 // Approximate section height
            
            // Calculate full section height for line extension
            const sectionElement = dividerRef.current.closest('section')
            const sectionRect = sectionElement?.getBoundingClientRect()
            const fullSectionHeight = sectionRect ? sectionRect.height : windowHeight * 2
            
            // Apply line height to reach bottom of section with scroll effect
            const minHeight = 8 // Start with very small height (8px)
            const maxHeight = fullSectionHeight * 0.6 // 60% of section height
            
            // Add delay before starting the growth animation
            const delayDistance = windowHeight * 0.8 // Start growing after 80% of viewport height
            const scrollEffect = Math.min(1, Math.max(0, (scrollY - sectionTop + delayDistance) / (sectionHeight * 0.3)))
            
            // Add easing function for smoother and slower animation
            const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
            const easedScrollEffect = easeOutQuart(scrollEffect * 0.6) // Slightly faster than before
            
            // Calculate position relative to the section to slow down in specific areas
            const sectionProgress = sectionRect ? (windowHeight - sectionRect.top) / (sectionRect.height + windowHeight) : 0
            
            // Slow down the growth when in the "Get Postgres in an Instant" area (first half of section)
            const slowDownFactor = sectionProgress < 0.6 ? 0.5 : 1.0 // Less slow down
            const adjustedScrollEffect = easedScrollEffect * slowDownFactor
            
            // Detect scroll direction
            const currentScrollY = window.scrollY
            const isScrollingUp = currentScrollY < lastScrollYRef.current
            lastScrollYRef.current = currentScrollY
            
            // Calculate height based on scroll direction
            let currentHeight
            if (isScrollingUp) {
              // When scrolling up, reduce height more quickly
              const shrinkEffect = Math.max(0, adjustedScrollEffect - 0.3)
              currentHeight = minHeight + (shrinkEffect * (maxHeight - minHeight))
            } else {
              // When scrolling down, normal growth
              currentHeight = minHeight + (adjustedScrollEffect * (maxHeight - minHeight))
            }
            
            // Apply brightness and opacity based on scroll position
            const brightness = 0.5 + (visibilityRatio * 0.5) // 0.5 to 1.0
            const opacity = Math.max(0, Math.min(1, scrollEffect * 2)) // Start invisible, fade in as it grows
            
            dividerRef.current.style.filter = `brightness(${brightness})`
            dividerRef.current.style.opacity = opacity.toString()
            
            // Update state for smooth height transition
            setDividerHeight(currentHeight)
            
            // Add visible class when divider should be shown
            const lineElement = dividerRef.current.querySelector('.divider-line') as HTMLElement
            const glowElement = dividerRef.current.querySelector('.divider-glow') as HTMLElement
            const glowOuterElement = dividerRef.current.querySelector('.divider-glow-outer') as HTMLElement
            
            if (scrollEffect > 0.1) {
              lineElement?.classList.add('visible')
              glowElement?.classList.add('visible')
              glowOuterElement?.classList.add('visible')
              
              // Add scrolling-up class for faster animation when scrolling up
              if (isScrollingUp) {
                lineElement?.classList.add('scrolling-up')
                glowElement?.classList.add('scrolling-up')
                glowOuterElement?.classList.add('scrolling-up')
              } else {
                lineElement?.classList.remove('scrolling-up')
                glowElement?.classList.remove('scrolling-up')
                glowOuterElement?.classList.remove('scrolling-up')
              }
            } else {
              lineElement?.classList.remove('visible')
              glowElement?.classList.remove('visible')
              glowOuterElement?.classList.remove('visible')
              lineElement?.classList.remove('scrolling-up')
              glowElement?.classList.remove('scrolling-up')
              glowOuterElement?.classList.remove('scrolling-up')
            }
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
              <section id="about" className="w-full pt-4 sm:pt-6 lg:pt-8 pb-16 navBreak:pb-20 lg:pb-24 bg-gradient-to-b from-[#f5f6f7] via-white to-red-100/40 relative px-4 sm:px-6 lg:px-8">
               <div className="container max-w-7xl mx-0 lg:mx-auto">
                 {/* Header Section - Centered */}
                   <div className="text-left sm:text-start md:text-start lg:text-center xl:text-center space-y-4 mb-6 navBreak:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm text-gray-900 text-start sm:text-start md:text-start lg:text-center xl:text-center">
              Solusi Digital Terbaik untuk Bisnis
            </h2>
           <p className="mx-0 lg:mx-auto max-w-4xl text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-700/70 leading-relaxed font-normal text-left sm:text-left md:text-left lg:text-center xl:text-center">
           Kami percaya bahwa teknologi dapat mengubah cara bisnis beroperasi dan berinteraksi dengan pelanggan mereka.
           </p>
         </div>

                 {/* Vertical Divider with Arrow - Section Level */}
         <div ref={dividerRef} className="hidden lg:flex absolute left-1/2 top-1/3 transform -translate-x-1/2 z-10 transition-all duration-300 opacity-0">
           <div className="relative">
                           {/* Main Line */}
              <div 
                className="divider-line w-1 bg-gradient-to-b from-red-400 via-red-500 to-red-600 shadow-lg rounded-full animate-slow-pulse transition-all duration-1500"
                style={{ height: `${dividerHeight}px` }}
              ></div>
             
                            {/* Arrow */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-red-500 drop-shadow-lg animate-bounce"></div>
               </div>
             
                           {/* Glow Effect */}
              <div 
                className="divider-glow absolute inset-0 w-1 bg-gradient-to-b from-red-300 via-red-400 to-red-500 rounded-full blur-sm opacity-50 animate-slow-pulse transition-all duration-1500"
                style={{ height: `${dividerHeight}px` }}
              ></div>
             
                           {/* Additional Glow for Scroll Effect */}
              <div 
                className="divider-glow-outer absolute inset-0 w-3 bg-gradient-to-b from-red-300 via-red-400 to-red-500 rounded-full blur-md opacity-30 transition-all duration-1500"
                style={{ height: `${dividerHeight}px` }}
              ></div>
           </div>
         </div>

         {/* Two Rows of Content */}
         <div className="space-y-16 navBreak:space-y-20 px-4 lg:px-8">
           {/* First Row */}
           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             {/* Left: Image */}
             <div className="flex items-center justify-center lg:justify-start">
               <div className="relative w-full max-w-md bg-[f5f6f7] rounded-2xl group overflow-hidden">
                 <Image
                   src="/images/visi-2.png"
                   alt="Visi Kami"
                   width={400}
                   height={300}
                   className="w-full h-auto rounded-2xl object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                 />
                 <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
               </div>
             </div>

             {/* Right: Text Content */}
             <div className="text-left lg:text-left space-y-6 lg:ml-8 xl:ml-12">
               <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight text-left lg:text-left">
               Visi Kami
               </h3>
               <div className="space-y-4">
                 <p className="text-base sm:text-lg lg:text-xl text-gray-700/70 leading-relaxed font-normal text-left lg:text-left">
                 Menjadi mitra teknologi terpercaya yang membantu bisnis di indonesia untuk berinovasi dan berkembang melalui solusi teknologi yang handal dan efektif.
                 </p>
               </div>
             </div>
           </div>

          {/* Second Row */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                         {/* Left: Text Content */}
             <div className="text-left lg:text-left space-y-6 order-2 lg:order-1 lg:mr-8 xl:mr-12">
               <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight text-left lg:text-left">
               Misi Kami
               </h3>
               <div className="space-y-4">
                 <p className="text-base sm:text-lg lg:text-xl text-gray-700/70 leading-relaxed font-normal text-left lg:text-left">
                 Memberikan layanan pengembangan teknologi yang berkualitas dan inovatif yang membantu klien kami mencapai tujuan bisnis mereka. Kami berkomitmen untuk terus belajar dan beradaptasi dengan perkembangan teknologi terbaru untuk memberikan solusi terbaik bagi klien kami.
                 </p>
               </div>
             </div>

            {/* Right: Image */}
            <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 bg-none">
              <div className="relative w-full max-w-md bg-none">
                <div className="bg-none rounded-2xl group overflow-hidden">
                  <Image
                    src="/images/visi-1.png"
                    alt="Visi Kami"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-2xl bg-none object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
