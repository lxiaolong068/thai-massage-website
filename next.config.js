const withNextIntl = require('next-intl/plugin')('./src/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    optimizeCss: false,
    isrFlushToDisk: false,
  },
  async rewrites() {
    return [
      {
        source: '/_next/image',
        has: [
          {
            type: 'query',
            key: 'url',
            value: '(^/http|/uploads/therapists|example\.com)',
          }
        ],
        destination: '/images/placeholder-therapist.jpg'
      },
      {
        // 重定向/placeholder-avatar.jpg请求到正确的占位图
        source: '/placeholder-avatar.jpg',
        destination: '/images/placeholder-therapist.jpg'
      },
      {
        // 重定向/placeholder-image.jpg请求到正确的占位图
        source: '/placeholder-image.jpg',
        destination: '/images/placeholder-therapist.jpg'
      },
      {
        // 处理任何带语言前缀的占位图请求
        source: '/:locale/placeholder-:slug*',
        destination: '/images/placeholder-therapist.jpg'
      }
    ]
  }
};

module.exports = withNextIntl(nextConfig); 