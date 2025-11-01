// Common types used across the application
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

export interface PainPoint {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  solution: string
  gradient: string
}

export interface SolutionCard {
  id: string
  title: string
  description: string
  features: string[]
  price: string
  gradient: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
}

export interface FormData {
  name: string
  email: string
  message: string
}

// Component props types
export interface NavbarProps {
  isFixed?: boolean
  isVisible?: boolean
}

export interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  imageSrc: string
  imageAlt: string
}

export interface ServiceCardProps {
  service: ServiceItem
  onClick?: () => void
}

export interface PainPointCardProps {
  painPoint: PainPoint
}

export interface SolutionCardProps {
  solution: SolutionCard
  isActive: boolean
}

export interface ContactFormProps {
  onSubmit: (data: FormData) => void
  isLoading?: boolean
}

// New section types
export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  gradient: string
  href: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  readTime: string
}

export interface PortfolioItem {
  id: number
  title: string
  description: string
  category: string
  image: string
  technologies: string[]
  url: string // URL untuk detail portfolio
  projectUrl?: string // URL untuk live project (opsional)
  slug?: string // Slug untuk URL generation
  featured?: boolean
  client?: string
  year?: string
  // Tambahan field untuk filtering
  categoryName?: string
  projectTypeName?: string
  isActive?: boolean
  isFeatured?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  categoryColor?: string
  projectTypeColor?: string
}

export interface PortfolioResponse {
  portfolio: PortfolioItem[]
  total: number
  categories: string[]
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

// Section props types
export interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  testimonials?: Testimonial[]
}

export interface FeaturesSectionProps {
  title?: string
  subtitle?: string
  features?: Feature[]
}



export interface PortfolioSectionProps {
  title?: string
  subtitle?: string
  items?: PortfolioItem[]
  showViewAll?: boolean
}

export interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs?: FAQ[]
}

// Article types for LatestArticlesSection
export interface Article {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  slug: string
  category: string
  image?: string // Tambahkan field image untuk featuredImage
}

export interface LatestArticlesSectionProps {
  title?: string
  subtitle?: string
  articles?: Article[]
} 

// Service page specific types
export interface WhyItem {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  points?: string[]
}

export interface OfferingItem {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  points?: string[]
  image?: { src: string; alt: string }
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  highlight?: boolean
  badges?: string[]
  originalPrice?: string
  discount?: string
  borderColor?: string
  badgeGradient?: string
  buttonGradient?: string
}

export interface ProcessStep {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface CTAProps {
  title: string
  subtitle?: string
  buttonText: string
  buttonHref: string
}