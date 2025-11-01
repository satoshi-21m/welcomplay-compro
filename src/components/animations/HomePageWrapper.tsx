import { ReactNode } from 'react'

interface HomePageWrapperProps {
  children: ReactNode
  className?: string
}

export const HomePageWrapper = ({
  children,
  className = ""
}: HomePageWrapperProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Simple homepage section wrappers - no animations
export const HeroWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const AboutWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const PremiumServicesWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const FeaturesWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const TestimonialsWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const PortfolioWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const LatestArticlesWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)

export const FAQWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
)