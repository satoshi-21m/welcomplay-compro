import { ReactNode } from 'react'

interface ServerPageWrapperProps {
  children: ReactNode
  pageType: 'blog' | 'portfolio' | 'about' | 'services'
  className?: string
}

export const ServerPageWrapper = ({ 
  children, 
  pageType, 
  className = "" 
}: ServerPageWrapperProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Blog-specific wrapper - no animations
export const BlogPageWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

// Portfolio-specific wrapper - no animations
export const PortfolioPageWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

// Simple section wrapper - no animations
export const AnimatedSection = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  className = ""
}: {
  children: ReactNode
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn'
  delay?: number
  className?: string
}) => {
  return <div className={className}>{children}</div>
}

// Simple grid wrapper - no animations
export const AnimatedGrid = ({ 
  children, 
  className = "",
  staggerChildren = 0.1,
  delay = 0
}: {
  children: ReactNode
  className?: string
  staggerChildren?: number
  delay?: number
}) => {
  return <div className={className}>{children}</div>
}
