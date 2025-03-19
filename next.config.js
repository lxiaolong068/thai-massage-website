const withNextIntl = require('next-intl/plugin')('./src/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'cdn-icons-png.flaticon.com', 'example.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withNextIntl(nextConfig); 