import { PainPoint, SolutionCard, PortfolioItem } from '../types/index'
import { 
  Code, 
  Smartphone, 
  Users, 
  Megaphone, 
  Search, 
  Palette,
  Monitor,
  Zap,
  Shield,
  Headphones,
  BarChart
} from 'lucide-react'

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 'website-slow',
    title: 'Website Lambat & Tidak Responsif',
    description: 'Website yang loading lama, tidak mobile-friendly, dan performa buruk membuat pengunjung kabur sebelum melihat konten Anda.',
    icon: Code,
    solution: 'Solusi Web Development',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    id: 'social-media-engagement',
    title: 'Social Media Tidak Ada Engagement',
    description: 'Posting rutin tapi likes dan komentar minim? Konten tidak menarik dan tidak ada strategi yang jelas.',
    icon: Users,
    solution: 'Solusi Social Media Content Creation',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'no-mobile-app',
    title: 'Tidak Ada Aplikasi Mobile',
    description: 'Pelanggan mencari kemudahan akses via mobile, tapi bisnis Anda belum memiliki aplikasi yang user-friendly.',
    icon: Smartphone,
    solution: 'Solusi Mobile App Development',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'expensive-ads',
    title: 'Iklan Mahal Tapi Tidak Ada Hasil',
    description: 'Budget iklan habis tapi konversi rendah? Targeting tidak tepat dan strategi iklan tidak optimal.',
    icon: Megaphone,
    solution: 'Solusi Digital Advertising',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    id: 'poor-seo',
    title: 'Website Tidak Muncul di Google',
    description: 'Website ada tapi tidak ditemukan di mesin pencari? SEO buruk membuat bisnis Anda tidak terlihat online.',
    icon: Search,
    solution: 'Solusi SEO Optimization',
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'poor-content',
    title: 'Konten Tidak Menarik & Berkualitas',
    description: 'Foto blur, video jelek, dan konten tidak profesional membuat brand Anda terlihat amatir.',
    icon: Palette,
    solution: 'Solusi Visual Ad Creation',
    gradient: 'from-pink-500 to-rose-500'
  }
]

export const SOLUTIONS: SolutionCard[] = [
  {
    id: 'web',
    title: 'Web Development',
    description: 'Website yang cepat, responsif, dan SEO-friendly',
    features: [
      'Responsive Design',
      'SEO Optimization',
      'Performance Optimization',
      'Content Management System'
    ],
    price: 'Mulai dari Rp 5.000.000',
    gradient: 'from-blue-500 to-indigo-600',
    icon: Code
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    description: 'Aplikasi mobile native dan cross-platform yang user-friendly',
    features: [
      'iOS & Android Development',
      'Cross-Platform Solutions',
      'App Store Optimization',
      'User Experience Design'
    ],
    price: 'Mulai dari Rp 15.000.000',
    gradient: 'from-green-500 to-emerald-600',
    icon: Smartphone
  },
  {
    id: 'social',
    title: 'Social Media Content Creation',
    description: 'Kelola dan optimasi sosial media bisnis Anda',
    features: [
      'Content Strategy',
      'Community Management',
      'Analytics & Reporting',
      'Paid Advertising'
    ],
    price: 'Mulai dari Rp 2.000.000/bulan',
    gradient: 'from-purple-500 to-indigo-600',
    icon: Users
  },
  {
    id: 'ads',
    title: 'Digital Advertising',
    description: 'Iklan digital yang tepat sasaran dan ROI tinggi',
    features: [
      'Google Ads Management',
      'Social Media Ads',
      'Targeting Optimization',
      'ROI Tracking'
    ],
    price: 'Mulai dari Rp 1.000.000/bulan',
    gradient: 'from-orange-500 to-red-600',
    icon: Megaphone
  },
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Optimasi mesin pencari untuk meningkatkan ranking dan traffic',
    features: [
      'On-page & Off-page SEO',
      'Keyword Research',
      'Technical SEO',
      'Monthly Reports'
    ],
    price: 'Mulai dari Rp 3.000.000/bulan',
    gradient: 'from-teal-500 to-cyan-600',
    icon: Search
  },
  {
    id: 'content',
    title: 'Visual Ad Creation',
    description: 'Pembuatan aset visual iklan yang menarik dan efektif',
    features: [
      'Ad Creative Design',
      'Social Media Ads',
      'Display Advertising',
      'Video Ads Production'
    ],
    price: 'Mulai dari Rp 1.500.000/paket',
    gradient: 'from-pink-500 to-rose-600',
    icon: Palette
  }
]

export const CLIENT_LOGOS = [
  '/placeholder.svg?height=60&width=150',
  '/placeholder.svg?height=60&width=150',
  '/placeholder.svg?height=60&width=150',
  '/placeholder.svg?height=60&width=150',
  '/placeholder.svg?height=60&width=150'
]

// Testimonials data
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Marianita",
    role: "Business Owner",
    company: "Calla Wedding Shoes",
    content: "Pelayanan sangat profesional dan hasilnya memuaskan. Social media bisnis saya jadi lebih menarik dan engagement meningkat!",
    rating: 5,
    avatar: "/images/testimonial1.jpg"
  },
  {
    id: "2",
    name: "Widjaya",
    role: "Direktur Utama",
    company: "PT. Rumah Inovasi Internasional",
    content: "Timnya responsif dan hasil kontennya selalu fresh. Engagement naik signifikan!",
    rating: 5,
    avatar: "/images/testimonial2.jpg"
  },
  {
    id: "3",
    name: "Denis",
    role: "Business Owner",
    company: "Graha Variasi",
    content: "Strategi yang diberikan sangat membantu brand kami lebih dikenal di media sosial.",
    rating: 5,
    avatar: "/images/testimonial3.jpg"
  },
  {
    id: "4",
    name: "Bofan",
    role: "Direktur Utama",
    company: "PT. Limbong Buana Global",
    content: "Laporan analitiknya detail dan mudah dipahami. Sangat direkomendasikan!",
    rating: 5,
    avatar: "/images/testimonial1.jpg"
  },
  {
    id: "5",
    name: "William",
    role: "Founder",
    company: "PT. Berlian Somba Sinergi",
    content: "Konten kreatif dan pelayanan after sales yang sangat baik.",
    rating: 5,
    avatar: "/images/testimonial2.jpg"
  },
  {
    id: "6",
    name: "Indra",
    role: "Sales Manager",
    company: "PT. Sinar Cahaya Sentosa",
    content: "Proses kerja sama sangat profesional dan transparan.",
    rating: 5,
    avatar: "/images/testimonial3.jpg"
  },
  {
    id: "7",
    name: "Kennedy",
    role: "Marketing",
    company: "PT. Jayant Perdana Indonesia",
    content: "Tim selalu siap membantu dan memberikan solusi terbaik.",
    rating: 5,
    avatar: "/images/testimonial1.jpg"
  },
  {
    id: "8",
    name: "Hasian Purba",
    role: "Tax Consultant",
    company: "PT. Pande Sinergy Utama",
    content: "Hasil kerja sangat memuaskan, social media kami jadi lebih hidup.",
    rating: 5,
    avatar: "/images/testimonial2.jpg"
  }
]

// Features data - Updated to match services
export const FEATURES = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Website yang cepat, responsif, dan SEO-friendly.",
    icon: Code,
    color: "blue",
    gradient: "from-blue-600 to-blue-700",
    href: "/jasa-pembuatan-website"
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description: "Aplikasi mobile native, cross-platform, user-friendly.",
    icon: Smartphone,
    color: "green",
    gradient: "from-green-600 to-green-700",
    href: "/jasa-pembuatan-mobile-app"
  },
  {
    id: "social-media-management",
    title: "Social Media Content Creation",
    description: "Kelola dan optimasi sosial media bisnis yang tepat.",
    icon: Users,
    color: "purple",
    gradient: "from-purple-600 to-purple-700",
    href: "/jasa-manajemen-sosial-media"
  },
  {
    id: "google-social-media-ads",
    title: "Digital Advertising",
    description: "Iklan digital yang tepat sasaran dan ROI tinggi.",
    icon: Megaphone,
    color: "amber",
    gradient: "from-amber-400 to-yellow-500",
    href: "/jasa-kelola-google-dan-sosial-media-ads"
  },
  {
    id: "seo",
    title: "Search Engine Optimization",
    description: "Optimasi mesin pencari untuk ranking dan traffic.",
    icon: Search,
    color: "teal",
    gradient: "from-teal-600 to-teal-700",
    href: "/jasa-search-engine-optimization"
  },
  {
    id: "visual-ad-creation",
    title: "Visual Ad Creation",
    description: "Pembuatan aset visual iklan yang menarik dan efektif.",
    icon: Palette,
    color: "pink",
    gradient: "from-pink-600 to-pink-700",
    href: "/visual-ad-creation"
  }
]

// Portfolio data - sekarang menggunakan API dinamis
export const PORTFOLIO_ITEMS: PortfolioItem[] = []

// FAQ data
export const FAQS = [
  {
    id: "1",
    question: "Apa itu WELCOMPLAY?",
    answer: "WELCOMPLAY adalah brand perusahaan dengan badan usaha resmi PT LAB WELCOM PLAY, yang menyediakan layanan pengembangan aplikasi mobile, pembuatan website, solusi e-commerce, solusi software, SEO dan digital marketing untuk membantu bisnis Anda tumbuh secara digital.",
    category: "Umum"
  },
  {
    id: "2",
    question: "Layanan apa saja yang ditawarkan?",
    answer: "WELCOMPLAY menawarkan layanan berikut: Pembuatan Aplikasi Mobile: Aplikasi Native Android/iOS, Aplikasi Cross-platform, PWA, Aplikasi Hybrid, Pemeliharaan & Dukungan. Pembuatan Website: Pembuatan Website, Website Kustom, CMS, Pemeliharaan & Dukungan Website. Solusi E-Commerce: Fitur Lengkap Sistem E-commerce, Web atau Mobile (Spesialis E-commerce), E-Commerce Management, Pemeliharaan & Dukungan. Solusi Software: Software Kustom Berbasis Cloud. Digital Marketing: Social Media Marketing, Google Ads dan Social Media Ads. SEO: Meningkatkan traffic organik, SEO On-Page, SEO Off-Page, SEO Teknis.",
    category: "Layanan"
  },
  {
    id: "3",
    question: "Bagaimana cara WELCOMPLAY bekerja dengan klien?",
    answer: "Kami menggunakan metodologi Agile untuk memastikan proyek berjalan dengan efisien dan transparan. Tim kami bekerja sama dengan klien melalui fase-fase berikut: Analisis Kebutuhan: Diskusi untuk memahami visi dan analisis mendalam. Perancangan: Mendesain kebutuhan proyek secara presisi. Pengembangan: Tim ahli teknologi kami mengkode dan memperhatikan keandalan dan keamanan. Pengujian: Proyek diuji secara menyeluruh oleh tim pengujian berpengalaman. Peluncuran: Proyek diluncurkan setelah mendapatkan kepuasan penuh dari klien. Pemeliharaan: Kami menyediakan pemeliharaan berkelanjutan untuk memastikan inovasi terus berjalan.",
    category: "Layanan"
  },
  {
    id: "4",
    question: "Berapa biaya layanan yang ditawarkan?",
    answer: "Biaya layanan kami bervariasi tergantung pada jenis dan kompleksitas proyek. Silakan hubungi kami untuk mendapatkan penawaran yang lebih spesifik sesuai dengan kebutuhan Anda.Biaya layanan kami bervariasi tergantung pada jenis dan kompleksitas proyek. Silakan hubungi kami untuk mendapatkan penawaran yang lebih spesifik sesuai dengan kebutuhan Anda.",
    category: "Layanan"
  },
  {
    id: "5",
    question: "Apa saja industri yang dilayani?",
    answer: "Kami melayani berbagai industri termasuk Retail & E-commerce, Restoran, Real Estate, Otomotif, Pendidikan, Fintech, Kesehatan, Olahraga, Pariwisata, Konstruksi, Logistik, Media & Hiburan, dan banyak lagi.",
    category: "Layanan"
  },
  {
    id: "6",
    question: "Apakah WELCOMPLAY menawarkan dukungan setelah peluncuran proyek?",
    answer: "Ya, kami menyediakan dukungan pasca-peluncuran untuk memastikan aplikasi atau website Anda berjalan dengan lancar dan siap untuk skalabilitas lebih lanjut. Kami menawarkan dukungan gratis selama 30 hari pertama setelah peluncuran, serta opsi pemeliharaan berkelanjutan. Jika ada pertanyaan lain yang ingin Anda tanyakan, jangan ragu untuk segera menghubungi kami!",
    category: "Layanan"
  }
] 

export const LATEST_ARTICLES = [
  {
    id: "1",
    title: "5 Strategi SEO yang Wajib Diterapkan di 2024",
    excerpt: "Pelajari teknik SEO terbaru yang akan membantu website Anda ranking di Google dan mendapatkan traffic organik yang lebih tinggi.",
    publishedAt: "2024-01-15",
    slug: "strategi-seo-2024",
    category: "SEO"
  },
  {
    id: "2",
    title: "Tips Membuat Website E-commerce yang Konversi Tinggi",
    excerpt: "Optimalkan website e-commerce Anda dengan tips dan trik yang terbukti meningkatkan conversion rate dan penjualan.",
    publishedAt: "2024-01-10",
    slug: "tips-website-ecommerce",
    category: "Web Development"
  },
  {
    id: "3",
    title: "Social Media Marketing: Dari Zero to Hero",
    excerpt: "Panduan lengkap untuk memulai social media marketing dari nol hingga menjadi expert dalam mengelola brand di social media.",
    publishedAt: "2024-01-05",
    slug: "social-media-marketing-guide",
    category: "Digital Marketing"
  }
] 

// Home data function
export async function getHomeData() {
  return {
    hero: {
      title: "Jadi Kesempatan Besar",
      subtitle: "Web & Mobile Development, Digital Marketing, SEO hingga Visual Content Creation sebagai solusi untuk bisnis Anda.",
      ctaText: "Mulai Konsultasi Gratis"
    }
  }
} 