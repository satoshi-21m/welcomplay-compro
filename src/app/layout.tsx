import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { ThirdPartyScripts, GTMNoScript, CustomBodyScripts } from "@/components/ThirdPartyScripts"
import { getSiteSettings } from "@/lib/services/settings-service"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://welcomplay.com'),
  title: "WELCOMPLAY - Solusi Digital Terbaik untuk Bisnis Anda",
  description: "WELCOMPLAY menyediakan layanan web development, mobile app development, digital marketing, SEO, dan content creation untuk membantu bisnis Anda tumbuh secara digital.",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch site settings for third party scripts (with timeout protection)
  const settings = await getSiteSettings()
  
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* GTM NoScript - must be immediately after opening body tag */}
        <GTMNoScript googleTagManagerId={settings.google_tag_manager_id} />
        
        {/* Third Party Scripts - injected via Next.js Script component */}
        <ThirdPartyScripts
          googleAnalyticsId={settings.google_analytics_id}
          googleTagManagerId={settings.google_tag_manager_id}
          facebookPixelId={settings.facebook_pixel_id}
          customHeadScripts={settings.custom_head_scripts}
        />
        
        {/* Main content */}
        {children}
        
        {/* Toast notifications */}
        <ToastProvider />
        
        {/* Custom body scripts - loaded last with lazyOnload strategy */}
        <CustomBodyScripts customBodyScripts={settings.custom_body_scripts} />
      </body>
    </html>
  )
}
