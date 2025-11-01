import { useEffect, useRef, MutableRefObject } from "react"
import { gsap } from "gsap"

export function useMobileMenuStagger(isOpen: boolean) {
  const panelRef = useRef<HTMLDivElement>(null)
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!panelRef.current) return

    const panel = panelRef.current
    const itemEls = Array.from(panel.querySelectorAll('.mobile-menu-item')) as HTMLElement[]

    if (isOpen) {
      // Kill previous animations
      closeTweenRef.current?.kill()
      openTlRef.current?.kill()

      // Set initial states
      gsap.set(itemEls, { 
        yPercent: 140, 
        rotate: 10,
        opacity: 0,
        force3D: true,
      })

      // Create open timeline
      const tl = gsap.timeline({ 
        defaults: { ease: 'power4.out' },
      })

      // Stagger animation for menu items
      tl.to(itemEls, { 
        yPercent: 0, 
        rotate: 0,
        opacity: 1,
        duration: 0.8, 
        stagger: { 
          each: 0.08, 
          from: 'start' 
        },
        force3D: true,
        clearProps: 'transform,opacity',
      })

      openTlRef.current = tl
    } else {
      // Quick close animation
      closeTweenRef.current?.kill()
      openTlRef.current?.kill()

      closeTweenRef.current = gsap.to(itemEls, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: 'power2.in',
        stagger: {
          each: 0.03,
          from: 'end'
        }
      })
    }

    return () => {
      openTlRef.current?.kill()
      closeTweenRef.current?.kill()
    }
  }, [isOpen])

  return panelRef
}

