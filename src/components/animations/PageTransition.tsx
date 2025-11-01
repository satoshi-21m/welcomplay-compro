import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  variants?: any
  delay?: number
  staggerChildren?: number
}

// Simple page transition wrapper - no animations
export const PageTransition = ({ 
  children, 
  className = "",
  variants,
  delay = 0
}: PageTransitionProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Simple stagger container - no animations
export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerChildren = 0.1,
  delay = 0
}: PageTransitionProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Simple animation components - no animations
export const FadeInUp = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}

export const FadeInLeft = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}

export const FadeInRight = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}

export const ScaleIn = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}

export const SlideInTop = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}

// Contact page variants - no animations
export const contactPageVariants = {}
export const contactFormVariants = {}
export const contactInfoVariants = {}
export const contactMapVariants = {}