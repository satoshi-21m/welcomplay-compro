'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Navigation Progress Bar Hook & Component
 * ⚡ Triggers on link click (BEFORE navigation)
 * ✅ Stays visible until pathname actually changes
 * 🎯 Integrated as border-bottom of navbar capsule
 */
export function NavigationProgressBar() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  // Function untuk start progress animation
  const startProgressAnimation = () => {
    // Clear any existing intervals
    intervalsRef.current.forEach(interval => clearInterval(interval))
    intervalsRef.current = []

    setIsVisible(true)
    setProgress(0)

    // Quick initial progress (0 -> 40% in 150ms)
    const interval1 = setInterval(() => {
      setProgress(prev => {
        if (prev >= 40) {
          clearInterval(interval1)
          return prev
        }
        return prev + 8
      })
    }, 25)
    intervalsRef.current.push(interval1)

    // Medium progress (40% -> 70% in 200ms)
    setTimeout(() => {
      const interval2 = setInterval(() => {
        setProgress(prev => {
          if (prev >= 70) {
            clearInterval(interval2)
            return prev
          }
          return prev + 5
        })
      }, 40)
      intervalsRef.current.push(interval2)
    }, 150)

    // Slow progress (70% -> 85% - STAYS HERE until pathname changes)
    setTimeout(() => {
      const interval3 = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval3)
            return 85 // Stop at 85%, wait for navigation complete
          }
          return prev + 2
        })
      }, 60)
      intervalsRef.current.push(interval3)
    }, 350)
  }

  // ⚡ OPTIMIZATION 1: Trigger on link click (BEFORE navigation)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href) {
        const href = link.getAttribute('href')
        
        // Only trigger for internal navigation
        if (href && 
            !href.startsWith('http') && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            href !== pathname) {
          
          // ✅ Start progress IMMEDIATELY on click (before navigation)
          startProgressAnimation()
        }
      }
    }

    // Capture phase untuk catch event sebelum Next.js Link handler
    document.addEventListener('click', handleLinkClick, true)
    
    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      intervalsRef.current.forEach(interval => clearInterval(interval))
    }
  }, [pathname])

  // ⚡ OPTIMIZATION 2: Complete ONLY when pathname actually changes
  useEffect(() => {
    if (pathname !== prevPathname.current && isVisible) {
      // ✅ Navigation complete! Jump to 100%
      intervalsRef.current.forEach(interval => clearInterval(interval))
      setProgress(100)
      
      // Hide after showing 100% briefly
      setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
        prevPathname.current = pathname
      }, 500)
    }
  }, [pathname, isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Desktop - Integrated border-bottom di navbar capsule */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-2xl z-10">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 transition-all duration-300 ease-out relative"
          style={{
            width: `${progress}%`,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5), 0 0 12px rgba(239, 68, 68, 0.3)'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Mobile - Full width di top (hanya untuk mobile nav) */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 transition-all duration-300 ease-out relative"
          style={{
            width: `${progress}%`,
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      </div>
    </>
  )
}

