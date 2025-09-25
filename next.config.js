/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片配置
  images: {
    domains: [
      'localhost', 
      'jkanimeflv.com',
      'api-jk.funnyu.xyz',
      'image.tmdb.org',
      'latanime.org',
      'cdn.jkdesu.com',
      'www.themoviedb.org'
    ],
    unoptimized: true // Cloudflare Pages 需要
  },
  
  // 压缩和优化
  compress: true,
  poweredByHeader: false,
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig