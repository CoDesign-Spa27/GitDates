import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      }
    }
    return config
},
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'wrmaspjmyjwjapxdfwkl.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'gitdate-files.blr1.cdn.digitaloceanspaces.com',
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/socket/:path*',
  //       destination: 'http://localhost:3001/api/socket/:path*'
  //     }
  //   ]
  // }
}

export default nextConfig
