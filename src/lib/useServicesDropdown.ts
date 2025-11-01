import { useState, useRef } from 'react'

interface UseServicesDropdownReturn {
  isServicesOpen: boolean
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  toggleServicesDropdown: () => void
}

export const useServicesDropdown = (): UseServicesDropdownReturn => {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsServicesOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false)
    }, 150)
  }

  const toggleServicesDropdown = () => {
    setIsServicesOpen(!isServicesOpen)
  }

  return {
    isServicesOpen,
    handleMouseEnter,
    handleMouseLeave,
    toggleServicesDropdown
  }
} 