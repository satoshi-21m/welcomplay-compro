import { Navbar } from "../../components/site/layout/Navbar";
import { HeroSection } from "../../components/site/HeroSection";
import { ServiceHighlights } from "@/components/site/ServiceHighlights";
import { PremiumServicesSection } from "../../components/site/PremiumServicesSection";
import { ConsequenceSection } from "../../components/site/ConsequenceSection";
import { ClientSuccessSection } from "../../components/site/ClientSuccessSection";
import { WorkflowSection } from "../../components/site/WorkflowSection";
import { TestimonialsSection } from "../../components/site/TestimonialsSection";
import { FeaturesSection } from "../../components/site/FeaturesSection";
import { PortfolioSection } from "../../components/site/PortfolioSection" ;
import { LatestArticlesSection } from "../../components/site/LatestArticlesSection";
import { FAQSection } from "../../components/site/FAQSection";
import { WhatsAppButton } from "../../components/ui/WhatsAppButton";
import { Footer } from "../../components/site/layout/Footer";
import { getHomeData } from "@/lib/data";
import { 
  HomePageWrapper, 
  HeroWrapper, 
  PremiumServicesWrapper,
  FeaturesWrapper, 
  TestimonialsWrapper, 
  PortfolioWrapper, 
  LatestArticlesWrapper, 
  FAQWrapper 
} from "../../components/animations";
import { Article } from "../../types"
import { Metadata } from "next"

// Import Server Actions with caching
import { getLandingPortfolioItems } from '../../lib/actions/portfolio-actions'
import { getLandingBlogPosts } from '../../lib/actions/blog-actions'

// Metadata untuk homepage
export const metadata: Metadata = {
  title: "WELCOMPLAY - Solusi Digital Terbaik untuk Bisnis Anda",
  description: "WELCOMPLAY menyediakan layanan web development, mobile app development, digital marketing, SEO, dan content creation untuk membantu bisnis Anda tumbuh secara digital.",
  keywords: ["web development", "mobile app", "digital marketing", "SEO", "content creation", "welcomplay"],
  openGraph: {
    title: "WELCOMPLAY - Solusi Digital Terbaik untuk Bisnis Anda",
    description: "WELCOMPLAY menyediakan layanan web development, mobile app development, digital marketing, SEO, dan content creation untuk membantu bisnis Anda tumbuh secara digital.",
    type: "website",
    url: "https://welcomplay.com",
  },
}

// Server Component dengan caching - ⚡ OPTIMIZED
export default async function HomePage() {
  // Fetch static home data
  const homeData = await getHomeData()
  
  // ⚡ OPTIMIZED: Fetch only what we need (6 portfolio + 3 blog)
  const [portfolioItems, blogPosts] = await Promise.all([
    getLandingPortfolioItems(6),  // Hanya fetch 6 untuk homepage
    getLandingBlogPosts(3)         // Hanya fetch 3 untuk homepage
  ])
  
  // Transform portfolio data
  const portfolioData = portfolioItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    image: item.image,
    technologies: item.technologies || [],
    url: `/portfolio/${item.slug}`,
    projectUrl: '',
    client: 'Client',
    year: new Date(item.createdAt).getFullYear().toString()
  }))
  
  // Transform blog data - sudah 3 dari server
  const blogData: Article[] = blogPosts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    slug: post.slug,
    category: post.category,
    image: post.image?.url
  }))

  return (
    <HomePageWrapper>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-[#f5f6f7]">
          {/* Hero Section with Navbar floating on top - HOMEPAGE ONLY */}
          <div className="relative">
            <Navbar isHomepage={true} />
            <HeroWrapper>
              <HeroSection
                title={homeData.hero.title}
                subtitle={homeData.hero.subtitle}
                ctaText={homeData.hero.ctaText}
                imageSrc="/placeholder.svg?height=700&width=400"
                imageAlt="Smartphone with Health App"
              />
            </HeroWrapper>
          </div>

          {/* Premium Services Section */}
          <PremiumServicesWrapper>
            <PremiumServicesSection />
          </PremiumServicesWrapper>

          {/* Consequence Section - Warning */}
          <ConsequenceSection />

          {/* Service Highlights Section */}
          <ServiceHighlights />

          {/* Client Success Stories */}
          <ClientSuccessSection />

          {/* Workflow Section */}
          <WorkflowSection />

          <FeaturesWrapper>
            <FeaturesSection />
          </FeaturesWrapper>

          <PortfolioWrapper>
            <PortfolioSection 
              title="Portfolio Terbaru"
              subtitle="Lihat hasil karya terbaik kami dalam mengembangkan solusi digital"
              items={portfolioData}
              showViewAll={true}
            />
          </PortfolioWrapper>

          <LatestArticlesWrapper>
            <LatestArticlesSection 
              title="Artikel Terbaru"
              subtitle="Temukan insight dan tips terbaru seputar digital marketing dan web development"
              articles={blogData}
            />
          </LatestArticlesWrapper>

          <TestimonialsWrapper>
            <TestimonialsSection />
          </TestimonialsWrapper>

          <FAQWrapper>
            <FAQSection />
          </FAQWrapper>
        </main>

        <WhatsAppButton />
        <Footer />
      </div>
    </HomePageWrapper>
  )
}