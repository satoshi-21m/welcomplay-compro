import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import throttle from 'lodash.throttle'

interface UseNavbarReturn {
  isNavbarVisible: boolean
  isNavbarFixed: boolean
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
  isMobileMenuOpen: boolean
  isMobileServicesDropdownOpen: boolean
  toggleMobileServicesDropdown: () => void
}

export const useNavbar = (): UseNavbarReturn => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [isNavbarFixed, setIsNavbarFixed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileServicesDropdownOpen, setIsMobileServicesDropdownOpen] = useState(false)
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollYRef = useRef(0)

  // Optimasi: Gunakan useCallback untuk event handlers
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollDelta = currentScrollY - lastScrollYRef.current
    
    console.log('Scroll event:', { currentScrollY, scrollDelta, isNavbarFixed, isNavbarVisible })
    
    // Make navbar fixed when scrolling (even in hero section)
    if (currentScrollY > 50) {
      setIsNavbarFixed(true)
      
      // Show navbar when scrolling up (any upward movement)
      if (scrollDelta < 0) {
        console.log('Scroll UP detected, showing navbar - scrollY:', currentScrollY, 'delta:', scrollDelta)
        setIsNavbarVisible(true)
        
        // Clear existing timeout when scrolling up
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
          scrollTimeoutRef.current = null
        }
      } else if (scrollDelta > 3) {
        // Hide navbar when scrolling down significantly
        console.log('Scroll DOWN detected, setting timeout to hide navbar - scrollY:', currentScrollY, 'delta:', scrollDelta)
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
          scrollTimeoutRef.current = null
        }
        
        // Hide navbar after 1.5 seconds of no scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          console.log('Timeout reached, hiding navbar')
          setIsNavbarVisible(false)
        }, 1500)
      }
    } else {
      // At the very top, navbar is relative and always visible
      setIsNavbarFixed(false)
      setIsNavbarVisible(true)
    }
    
    lastScrollYRef.current = currentScrollY
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentScrollY = window.scrollY
    
    // Show navbar when mouse is near the top of the page (only when fixed)
    if (e.clientY < 100 && currentScrollY > 50) {
      setIsNavbarVisible(true)
      
      // Clear timeout when mouse is near navbar
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Add throttled scroll listener for better performance
    let ticking = false
    
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    // Cleanup function yang proper
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
      window.removeEventListener('mousemove', handleMouseMove)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [handleScroll, handleMouseMove])

  // Optimasi: Gunakan useCallback untuk functions
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
    setIsMobileServicesDropdownOpen(false)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
    // Close services dropdown when mobile menu is toggled
    setIsMobileServicesDropdownOpen(false)
  }, [])

  const toggleMobileServicesDropdown = useCallback(() => {
    setIsMobileServicesDropdownOpen(prev => !prev)
  }, [])

  return {
    isNavbarVisible,
    isNavbarFixed,
    closeMobileMenu,
    toggleMobileMenu,
    isMobileMenuOpen,
    isMobileServicesDropdownOpen,
    toggleMobileServicesDropdown
  }
} 