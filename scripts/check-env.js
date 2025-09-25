#!/usr/bin/env node

/**
 * 环境配置检查脚本
 * 检查当前环境变量配置是否正确
 */

const fs = require('fs');
const path = require('path');

function checkEnvFile(filePath, description) {
  console.log(`\n📁 检查 ${description}: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ 文件不存在`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const env = {};
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  console.log(`  ✅ 文件存在，包含 ${Object.keys(env).length} 个变量`);
  
  // 检查关键变量
  const apiUrl = env.NEXT_PUBLIC_API_BASE_URL;
  const useMock = env.USE_MOCK_API;
  const nodeEnv = env.NODE_ENV;
  
  if (apiUrl) {
    console.log(`  🔌 API URL: ${apiUrl}`);
    if (apiUrl.includes('localhost')) {
      console.log(`  ⚠️  使用本地 API (确保本地服务器运行)`);
    } else if (apiUrl.includes('api-jk.funnyu.xyz')) {
      console.log(`  🌐 使用生产 API`);
    }
  } else {
    console.log(`  📝 未设置 API URL (将使用默认: https://api-jk.funnyu.xyz)`);
  }
  
  if (useMock === 'true') {
    console.log(`  🎭 使用 Mock API`);
  }
  
  if (nodeEnv) {
    console.log(`  🏷️  环境: ${nodeEnv}`);
  }
  
  return env;
}

function main() {
  console.log('🔍 JKAnime FLV 环境配置检查');
  console.log('='.repeat(50));
  
  // 检查各种环境文件
  const envFiles = [
    { path: '.env.local', desc: '本地开发配置' },
    { path: '.env.production', desc: '生产环境配置' },
    { path: '.env.example', desc: '示例配置' },
    { path: '.env.local.example', desc: '本地示例配置' }
  ];
  
  const configs = {};
  
  envFiles.forEach(({ path: filePath, desc }) => {
    configs[filePath] = checkEnvFile(filePath, desc);
  });
  
  // 分析当前运行环境
  console.log('\n🎯 当前运行环境分析');
  console.log('='.repeat(30));
  
  const currentEnv = process.env.NODE_ENV || 'development';
  console.log(`当前 NODE_ENV: ${currentEnv}`);
  
  // 模拟 Next.js 环境变量加载顺序
  let effectiveApiUrl = 'https://api-jk.funnyu.xyz'; // 默认值
  let effectiveUseMock = false;
  
  // .env.local 优先级最高 (开发环境)
  if (configs['.env.local']) {
    const localConfig = configs['.env.local'];
    if (localConfig.NEXT_PUBLIC_API_BASE_URL) {
      effectiveApiUrl = localConfig.NEXT_PUBLIC_API_BASE_URL;
    }
    if (localConfig.USE_MOCK_API === 'true') {
      effectiveUseMock = true;
    }
  }
  
  // .env.production (生产环境)
  if (currentEnv === 'production' && configs['.env.production']) {
    const prodConfig = configs['.env.production'];
    if (prodConfig.NEXT_PUBLIC_API_BASE_URL) {
      effectiveApiUrl = prodConfig.NEXT_PUBLIC_API_BASE_URL;
    }
    if (prodConfig.USE_MOCK_API === 'true') {
      effectiveUseMock = true;
    }
  }
  
  console.log(`\n📊 有效配置:`);
  console.log(`  API URL: ${effectiveApiUrl}`);
  console.log(`  使用 Mock: ${effectiveUseMock}`);
  
  // 给出建议
  console.log('\n💡 建议:');
  
  if (currentEnv === 'development') {
    if (effectiveApiUrl.includes('localhost')) {
      console.log('  🔧 开发环境使用本地 API - 确保本地 API 服务器在运行');
      console.log('  💡 如果没有本地 API，建议修改 .env.local:');
      console.log('     NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz');
    } else if (effectiveUseMock) {
      console.log('  🎭 开发环境使用 Mock API - 适合离线开发');
    } else {
      console.log('  🌐 开发环境使用生产 API - 推荐配置');
    }
  } else if (currentEnv === 'production') {
    if (effectiveApiUrl.includes('localhost')) {
      console.log('  ⚠️  生产环境不应使用 localhost API！');
      console.log('  🔧 请检查环境变量配置');
    } else if (effectiveUseMock) {
      console.log('  ⚠️  生产环境不应使用 Mock API！');
    } else {
      console.log('  ✅ 生产环境配置正确');
    }
  }
  
  // 快速修复建议
  if (currentEnv === 'production' && (effectiveApiUrl.includes('localhost') || effectiveUseMock)) {
    console.log('\n🚨 快速修复:');
    console.log('  删除或重命名 .env.local 文件:');
    console.log('  mv .env.local .env.local.backup');
    console.log('  或者修改 .env.local 中的配置');
  }
  
  if (currentEnv === 'development' && effectiveApiUrl.includes('localhost')) {
    console.log('\n🔧 如果本地 API 未运行，可以:');
    console.log('  1. 启动本地 API 服务器');
    console.log('  2. 或修改 .env.local 使用生产 API:');
    console.log('     NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz');
  }
}

if (require.main === module) {
  main();
}