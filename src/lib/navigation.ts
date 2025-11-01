import { NavItem, ServiceItem } from '../types'
import { 
  Code, 
  Smartphone, 
  Instagram, 
  Megaphone, 
  Search, 
  Palette 
} from 'lucide-react'

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Tentang',
    href: '/about'
  },
  {
    label: 'Layanan',
    href: '#services',
    children: [
      {
        label: 'Web Development',
        href: '/jasa-pembuatan-website',
        icon: Code
      },
      {
        label: 'Mobile App Development',
        href: '/jasa-pembuatan-mobile-app',
        icon: Smartphone
      },
      {
        label: 'Social Content Creation',
        href: '/jasa-manajemen-sosial-media',
        icon: Instagram
      },
      {
        label: 'Digital Advertising',
        href: '/jasa-kelola-google-dan-sosial-media-ads',
        icon: Megaphone
      },
      {
        label: 'Search Engine Optimization (SEO)',
        href: '/jasa-search-engine-optimization',
        icon: Search
      },
      {
        label: 'Visual Ad Creation',
        href: '/visual-ad-creation',
        icon: Palette
      }
    ]
  },
  {
    label: 'Blog',
    href: '/blog'
  },
  {
    label: 'Karir',
    href: '/career'
  },
  {
    label: 'Portofolio',
    href: '/portfolio'
  },
  {
    label: 'Kontak',
    href: '/contact'
  },
  {
    label: 'Promo',
    href: '/promo'
  }
]

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Pembuatan Website',
    icon: Code,
    href: '/jasa-pembuatan-website',
    color: 'blue'
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Pembuatan Aplikasi Mobile',
    icon: Smartphone,
    href: '/jasa-pembuatan-mobile-app',
    color: 'green'
  },
  {
    id: 'social-media-management',
    title: 'Social Content Creation',
    description: 'Pembuatan Konten Media Sosial',
    icon: Instagram,
    href: '/jasa-manajemen-sosial-media',
    color: 'purple'
  },
  {
    id: 'google-social-media-ads',
    title: 'Digital Advertising',
    description: 'Periklanan Digital',
    icon: Megaphone,
    href: '/jasa-kelola-google-dan-sosial-media-ads',
    color: 'orange'
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization (SEO)',
    description: 'Search Engine Optimization (SEO)',
    icon: Search,
    href: '/jasa-search-engine-optimization',
    color: 'teal'
  },
  {
    id: 'photography-videography',
    title: 'Visual Ad Creation',
    description: 'Pembuatan Visual Iklan: Video pendek, Carousel Ads, Static Image',
    icon: Palette,
    href: '/visual-ad-creation',
    color: 'pink'
  }
]

export const COMPANY_INFO = {
  name: 'PT LAB WELCOM PLAY',
  tagline: 'Perusahaan transformasi digital, partner bisnis terbaik Anda.',
  description: 'Apakah Anda siap membawa bisnis Anda ke level berikutnya?',
  logo: '/images/welcomplay-logo.svg',
  whatsapp: 'https://wa.me/6282113831700?text=Halo%20WELCOMPLAY%2C%20saya%20tertarik%20konsultasi%20gratis.%20Mohon%20informasinya.',
  contact: {
    email: 'info@welcomplay.com',
    phone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia'
  }
} 