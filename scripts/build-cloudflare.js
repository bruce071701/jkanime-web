#!/usr/bin/env node

/**
 * Cloudflare Pages 专用构建脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌐 开始 Cloudflare Pages 构建...');

// 备份 .env.local 文件（如果存在）
const envLocalPath = '.env.local';
const envLocalBackupPath = '.env.local.backup';

let hasEnvLocal = false;

if (fs.existsSync(envLocalPath)) {
  console.log('📁 发现 .env.local 文件，临时备份...');
  if (fs.existsSync(envLocalBackupPath)) {
    fs.unlinkSync(envLocalBackupPath);
  }
  fs.renameSync(envLocalPath, envLocalBackupPath);
  hasEnvLocal = true;
}

// 创建临时的生产环境配置
const prodEnvContent = `# Cloudflare Pages 生产环境配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
USE_MOCK_API=false
NEXT_TELEMETRY_DISABLED=1
`;

fs.writeFileSync(envLocalPath, prodEnvContent);
console.log('✅ 创建 Cloudflare Pages 环境配置');

try {
  // 执行 Next.js 构建
  console.log('🔨 执行 Next.js 构建...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://jkanimeflv.com',
      NEXT_PUBLIC_API_BASE_URL: 'https://api-jk.funnyu.xyz',
      USE_MOCK_API: 'false',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });
  
  console.log('✅ Next.js 构建成功！');
  
  // 创建 Cloudflare Pages 所需的文件
  console.log('📝 创建 Cloudflare Pages 配置文件...');
  
  // 创建 _headers 文件
  const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-cache
`;
  
  fs.writeFileSync('.next/_headers', headersContent);
  
  // 创建 _redirects 文件
  const redirectsContent = `# Next.js 路由重定向
/api/* /api/:splat 200
/_next/* /_next/:splat 200
/* /index.html 200
`;
  
  fs.writeFileSync('.next/_redirects', redirectsContent);
  
  console.log('✅ Cloudflare Pages 配置文件创建完成');
  
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} finally {
  // 清理临时文件
  if (fs.existsSync(envLocalPath)) {
    fs.unlinkSync(envLocalPath);
    console.log('🧹 清理临时配置文件');
  }
  
  // 恢复原始 .env.local 文件
  if (hasEnvLocal && fs.existsSync(envLocalBackupPath)) {
    fs.renameSync(envLocalBackupPath, envLocalPath);
    console.log('📁 恢复原始 .env.local 文件');
  }
}

console.log('🎉 Cloudflare Pages 构建完成！');
console.log('📁 构建输出: .next/');
console.log('🚀 准备部署到 Cloudflare Pages');
console.log('');
console.log('📋 部署说明：');
console.log('1. 构建输出目录: .next');
console.log('2. 构建命令: npm run build:cloudflare');
console.log('3. 环境变量已配置在 wrangler.toml 中');