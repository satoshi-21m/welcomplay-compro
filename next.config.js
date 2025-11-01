/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi untuk Next.js 15
  experimental: {
    // Opsi yang valid untuk Next.js 15
  },
  
  // Optimasi untuk memory limit di cPanel (nonaktif untuk Vercel)
  // Vercel tidak support standalone output
  ...(process.env.VERCEL_ENV ? {} : { output: 'standalone' }),
  
  // Matikan ESLint saat build (sementara)
  eslint: {
    ignoreDuringBuilds: true,
    // Nonaktifkan linting di dev juga dengan tidak melintasi direktori apapun
    dirs: [],
  },
  
  // Optimasi webpack untuk memory (Vercel-specific optimizations)
  webpack: (config, { isServer }) => {
    // Hanya untuk non-Vercel environments
    if (!process.env.VERCEL_ENV && isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false, // Disable minification untuk menghemat memory
      }
    }
    
    // Optimasi untuk memory
    config.performance = {
      ...config.performance,
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    
    return config
  },
  
  // Konfigurasi images
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 85, 95, 100], // Tambahkan konfigurasi qualities
    remotePatterns: [
      // Production API server
      {
        protocol: 'https',
        hostname: 'welcomplay.com',
        pathname: '/uploads/**',
      },
    ],
    // Tambahkan domains untuk backward compatibility
    domains: ['welcomplay.com', 'localhost'],
  },
  
  // Konfigurasi untuk development dan production
  async rewrites() {
    // Jika NEXT_PUBLIC_API_URL diset, proxy ke backend eksternal; jika tidak, gunakan API internal Next
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const rules = []
    if (apiUrl) {
      rules.push(
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${apiUrl}/uploads/:path*`,
        },
      )
    }

    // Public admin path -> internal admin route
    rules.push({
      source: '/admin-g30spki/:path*',
      destination: '/admin/:path*',
    })

    return rules
  },
  async redirects() {
    // Hindari redirect pada /admin agar tidak mengganggu Server Actions POST
    return []
  },
  async headers() {
    return [
      {
        source: '/admin-g30spki/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
