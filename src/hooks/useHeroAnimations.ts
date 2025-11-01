import { useEffect, MutableRefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface UseHeroAnimationsProps {
  titleRef: MutableRefObject<HTMLDivElement | null>
  subtitleRef: MutableRefObject<HTMLDivElement | null>
  ctaRef: MutableRefObject<HTMLDivElement | null>
  imageRef: MutableRefObject<HTMLDivElement | null>
  logoTitleRef: MutableRefObject<HTMLHeadingElement | null>
  logoSliderRef: MutableRefObject<HTMLDivElement | null>
}

export function useHeroAnimations({
  titleRef,
  subtitleRef,
  ctaRef,
  imageRef,
  logoTitleRef,
  logoSliderRef,
}: UseHeroAnimationsProps) {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    // Skip GSAP animations di iOS, use pure CSS animations instead
    if (isIOS) {
      return
    }

    const ctx = gsap.context(() => {
      // Set untuk hardware acceleration di semua elemen
      const elements = [
        titleRef.current,
        subtitleRef.current,
        ctaRef.current,
        imageRef.current,
        logoTitleRef.current,
        logoSliderRef.current,
      ].filter(Boolean)

      // Force hardware acceleration - lebih aggressive untuk iOS
      gsap.set(elements, {
        force3D: true,
        z: 0.01,
        transformOrigin: "50% 50%",
      })

      // Timeline dengan optimasi khusus iOS
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: isIOS ? "power2.out" : "power3.out", // Simpler easing untuk iOS
          force3D: true,
        },
      })

      // Animasi settings untuk iOS vs non-iOS
      const animationConfig = {
        duration: isIOS ? 0.8 : 1.0, // Lebih cepat di iOS untuk reduce jank
        yDistance: isIOS ? 40 : 60,   // Shorter distance di iOS
      }

      // GRUP 1: Title, Subtitle, dan CTA Button - animasi dengan stagger halus
      const contentElements = [titleRef.current, subtitleRef.current, ctaRef.current].filter(Boolean)
      
      if (contentElements.length > 0) {
        heroTimeline.fromTo(
          contentElements,
          {
            opacity: 0,
            y: animationConfig.yDistance,
          },
          {
            opacity: 1,
            y: 0,
            duration: animationConfig.duration * 1.2, // Durasi lebih lambat 20%
            stagger: 0.15, // Stagger halus antar elemen untuk efek lebih smooth
          }
        )
      }

      // GRUP 2: Image animation - mulai setelah grup content
      if (imageRef.current) {
        heroTimeline.fromTo(
          imageRef.current,
          {
            opacity: 0,
            y: animationConfig.yDistance,
          },
          {
            opacity: 1,
            y: 0,
            duration: animationConfig.duration,
          },
          "-=0.3" // Slight overlap dengan grup sebelumnya
        )
      }

      // GRUP 3: Logo Title dan Logo Slider - animasi bersamaan
      const logoElements = [logoTitleRef.current, logoSliderRef.current].filter(Boolean)
      
      if (logoElements.length > 0) {
        heroTimeline.fromTo(
          logoElements,
          {
            opacity: 0,
            y: animationConfig.yDistance,
          },
          {
            opacity: 1,
            y: 0,
            duration: animationConfig.duration,
            stagger: 0, // Tidak ada delay antar elemen, muncul bersamaan
          },
          "-=0.3" // Slight overlap dengan image
        )
      }
    })

    return () => ctx.revert() // Cleanup
  }, [titleRef, subtitleRef, ctaRef, imageRef, logoTitleRef, logoSliderRef])
}
