import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UsePageAnimationOptions {
  initialDelay?: number
  staggerDelay?: number
  animationDuration?: number
  enableExitAnimation?: boolean
}

interface AnimationState {
  isVisible: boolean
  isExiting: boolean
  currentStep: number
}

export const usePageAnimation = (options: UsePageAnimationOptions = {}) => {
  const {
    initialDelay = 0.1,
    staggerDelay = 0.15,
    animationDuration = 0.6,
    enableExitAnimation = false
  } = options

  const [animationState, setAnimationState] = useState<AnimationState>({
    isVisible: false,
    isExiting: false,
    currentStep: 0
  })

  const router = useRouter()

  // Trigger entrance animation
  const triggerEntrance = () => {
    setAnimationState(prev => ({
      ...prev,
      isVisible: true,
      currentStep: 0
    }))
  }

  // Trigger exit animation
  const triggerExit = () => {
    if (!enableExitAnimation) return
    
    setAnimationState(prev => ({
      ...prev,
      isExiting: true
    }))
  }

  // Navigate to next page with exit animation
  const navigateWithAnimation = (path: string, delay: number = 500) => {
    if (enableExitAnimation) {
      triggerExit()
      setTimeout(() => {
        router.push(path)
      }, delay)
    } else {
      router.push(path)
    }
  }

  // Get animation delay for staggered elements
  const getStaggerDelay = (index: number) => {
    return initialDelay + (index * staggerDelay)
  }

  // Get animation duration
  const getAnimationDuration = () => {
    return animationDuration
  }

  // Reset animation state
  const resetAnimation = () => {
    setAnimationState({
      isVisible: false,
      isExiting: false,
      currentStep: 0
    })
  }

  // Auto-trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEntrance()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !animationState.isVisible) {
        triggerEntrance()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [animationState.isVisible])

  return {
    animationState,
    triggerEntrance,
    triggerExit,
    navigateWithAnimation,
    getStaggerDelay,
    getAnimationDuration,
    resetAnimation
  }
}

// Preset configurations for different page types
export const pageAnimationPresets = {
  contact: {
    initialDelay: 0.1,
    staggerDelay: 0.15,
    animationDuration: 0.6,
    enableExitAnimation: false
  },
  about: {
    initialDelay: 0.2,
    staggerDelay: 0.2,
    animationDuration: 0.7,
    enableExitAnimation: false
  },
  services: {
    initialDelay: 0.1,
    staggerDelay: 0.1,
    animationDuration: 0.5,
    enableExitAnimation: false
  },
  portfolio: {
    initialDelay: 0.15,
    staggerDelay: 0.12,
    animationDuration: 0.65,
    enableExitAnimation: false
  },
  blog: {
    initialDelay: 0.1,
    staggerDelay: 0.08,
    animationDuration: 0.55,
    enableExitAnimation: false
  }
}

// Hook for specific page types
export const useContactPageAnimation = () => usePageAnimation(pageAnimationPresets.contact)
export const useAboutPageAnimation = () => usePageAnimation(pageAnimationPresets.about)
export const useServicesPageAnimation = () => usePageAnimation(pageAnimationPresets.services)
export const usePortfolioPageAnimation = () => usePageAnimation(pageAnimationPresets.portfolio)
export const useBlogPageAnimation = () => usePageAnimation(pageAnimationPresets.blog)
