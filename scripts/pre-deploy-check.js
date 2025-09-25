#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证所有配置和 API 连接
 */

const { testAPI } = require('./test-api.js');
const fs = require('fs');
const path = require('path');

async function checkEnvironmentFiles() {
  console.log('📁 检查环境配置文件...');
  
  const files = [
    '.env.example',
    '.env.local.example',
    '.env.cloudflare'
  ];
  
  const missing = [];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 缺失`);
      missing.push(file);
    }
  });
  
  return missing.length === 0;
}

async function checkBuildFiles() {
  console.log('\n🔧 检查构建配置文件...');
  
  const files = [
    'next.config.js',
    'wrangler.toml',
    '_headers',
    '_redirects',
    'package.json'
  ];
  
  const missing = [];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 缺失`);
      missing.push(file);
    }
  });
  
  return missing.length === 0;
}

async function checkAPIConfiguration() {
  console.log('\n🌐 检查 API 配置...');
  
  // 检查生产 API
  const productionResult = await testAPI('生产', 'https://api-jk.funnyu.xyz');
  
  if (productionResult.success) {
    console.log('✅ 生产 API 配置正确');
    return true;
  } else {
    console.log('❌ 生产 API 配置有问题');
    return false;
  }
}

async function checkPackageJson() {
  console.log('\n📦 检查 package.json 配置...');
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 检查必要的脚本
    const requiredScripts = ['dev', 'build', 'start'];
    const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
    
    if (missingScripts.length > 0) {
      console.log(`❌ 缺少脚本: ${missingScripts.join(', ')}`);
      return false;
    }
    
    // 检查项目名称
    if (pkg.name !== 'jkanimeflv') {
      console.log(`⚠️  项目名称: ${pkg.name} (建议: jkanimeflv)`);
    }
    
    console.log('✅ package.json 配置正确');
    return true;
  } catch (error) {
    console.log(`❌ package.json 读取失败: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 JKAnime FLV 部署前检查');
  console.log('检查时间:', new Date().toLocaleString());
  console.log('='.repeat(60));
  
  const checks = [
    { name: '环境配置文件', fn: checkEnvironmentFiles },
    { name: '构建配置文件', fn: checkBuildFiles },
    { name: 'package.json', fn: checkPackageJson },
    { name: 'API 连接', fn: checkAPIConfiguration }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const result = await check.fn();
      results.push({ name: check.name, success: result });
    } catch (error) {
      console.log(`❌ ${check.name} 检查失败: ${error.message}`);
      results.push({ name: check.name, success: false, error: error.message });
    }
  }
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📋 检查总结');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅ 通过' : '❌ 失败';
    console.log(`${result.name}: ${status}`);
    if (result.error) {
      console.log(`   错误: ${result.error}`);
    }
  });
  
  console.log(`\n🎯 总体结果: ${passed}/${total} 检查通过`);
  
  if (passed === total) {
    console.log('🎉 所有检查通过，可以部署！');
    
    console.log('\n📋 部署命令:');
    console.log('Cloudflare Pages: npm run deploy:cloudflare');
    console.log('手动构建: npm run build');
    
    process.exit(0);
  } else {
    console.log('⚠️  请修复上述问题后再部署');
    process.exit(1);
  }
}

// 运行检查
if (require.main === module) {
  main().catch(console.error);
}