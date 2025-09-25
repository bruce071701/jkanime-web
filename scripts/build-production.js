#!/usr/bin/env node

/**
 * 强制生产环境构建脚本
 * 临时重命名 .env.local 文件，确保使用生产环境配置
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 开始生产环境构建...');

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
const prodEnvContent = `# 临时生产环境配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
USE_MOCK_API=false
NEXT_TELEMETRY_DISABLED=1
`;

fs.writeFileSync(envLocalPath, prodEnvContent);
console.log('✅ 创建临时生产环境配置');

try {
  // 执行构建
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
  
  console.log('✅ 生产环境构建成功！');
  
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

console.log('🎉 生产环境构建完成！');
console.log('📁 构建输出: .next/');
console.log('🚀 可以部署到 Cloudflare Pages');