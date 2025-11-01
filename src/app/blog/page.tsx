import { Navbar } from "../../components/site/layout/Navbar"
import { Footer } from "../../components/site/layout/Footer"
import { WhatsAppButton } from "../../components/ui/WhatsAppButton"
import { BlogPost } from "../../types/blog"
import Link from "next/link"
import { CategoryList } from "../../components/blog/CategoryList"
import { 
  BlogPageWrapper, 
  AnimatedSection, 
  AnimatedGrid
} from "../../components/animations"
import { BlogSearchClient } from "./BlogSearchClient"
import { sanitizeSlug } from '../../lib/utils'
import { Metadata } from "next"

// Import blog actions with caching
import { getAllBlogPostsForPage, getLandingBlogCategories } from '../../lib/actions/blog-actions'

// Metadata untuk SEO
export const metadata: Metadata = {
  title: "Blog - WELCOMPLAY | Artikel Digital Marketing & Web Development",
  description: "Temukan insight dan tips terbaru seputar digital marketing, web development, dan teknologi dari tim ahli WELCOMPLAY.",
  keywords: ["blog welcomplay", "digital marketing", "web development", "tips teknologi", "artikel bisnis"],
  openGraph: {
    title: "Blog - WELCOMPLAY | Artikel Digital Marketing & Web Development",
    description: "Temukan insight dan tips terbaru seputar digital marketing dan web development",
    type: "website",
    url: "https://welcomplay.com/blog",
  },
}

// Server Component - Fetch all published posts
export default async function BlogPage() {
  // Fetch semua published posts untuk ditampilkan di landing page
  // Client-side pagination (9 posts per page) akan handle display
  const [posts, categories] = await Promise.all([
    getAllBlogPostsForPage(), // Fetch all posts - client pagination will handle display
    getLandingBlogCategories()
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-[#f5f6f7]">
        {/* Breadcrumb */}
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <div className="py-4 bg-f5f6f7">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="text-custom-red hover:text-red-600 transition-colors duration-300">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Blog</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Main Content with Sidebar */}
        <BlogPageWrapper>
          <BlogSearchClient 
            initialPosts={posts} 
            initialCategories={categories}
          />
        </BlogPageWrapper>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  )
}

// Dynamic rendering - no ISR untuk menghindari database timeout saat build
export const dynamic = 'force-dynamic'
export const revalidate = 0