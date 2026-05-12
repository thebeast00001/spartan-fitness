import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@clerk/nextjs',
      'framer-motion',
      'gsap',
      'lucide-react',
    ],
  },
  async headers() {
    return [
      {
        // Long-term cache for static assets (videos, images, fonts) in /public
        source: '/:path*.(mp4|webm|ogg|jpg|jpeg|png|webp|avif|svg|woff|woff2|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // @ts-ignore - Turbopack workspace configuration
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
