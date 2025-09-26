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
  
  // Next.js 15 兼容性设置
  experimental: {
    reactCompiler: false,
    ppr: false,
    dynamicIO: false,
  },
  
  // 服务器外部包配置
  serverExternalPackages: [],
  
  // 编译器选项
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 强制客户端渲染某些组件
  transpilePackages: [],
  
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
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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