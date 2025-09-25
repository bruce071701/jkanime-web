#!/usr/bin/env node

/**
 * API 连接测试脚本
 * 测试本地和生产环境的 API 连接
 */

const https = require('https');
const http = require('http');

// API 端点配置
const APIs = {
  local: 'http://localhost:8080',
  production: 'https://api-jk.funnyu.xyz'
};

// 测试端点
const endpoints = [
  '/api/v1/anime/home',
  '/api/v1/anime/genres',
  '/api/v1/anime/list'
];

function testEndpoint(baseUrl, endpoint) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${endpoint}`;
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    console.log(`🔍 测试: ${url}`);
    
    const startTime = Date.now();
    const req = client.get(url, (res) => {
      const duration = Date.now() - startTime;
      
      if (res.statusCode === 200) {
        console.log(`✅ 成功: ${endpoint} (${duration}ms)`);
        resolve({ success: true, duration, status: res.statusCode });
      } else {
        console.log(`❌ 失败: ${endpoint} - HTTP ${res.statusCode} (${duration}ms)`);
        resolve({ success: false, duration, status: res.statusCode });
      }
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - startTime;
      console.log(`❌ 错误: ${endpoint} - ${error.message} (${duration}ms)`);
      resolve({ success: false, duration, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ 超时: ${endpoint} (10s)`);
      req.destroy();
      resolve({ success: false, duration: 10000, error: 'Timeout' });
    });
  });
}

async function testAPI(name, baseUrl) {
  console.log(`\n🚀 测试 ${name} API: ${baseUrl}`);
  console.log('='.repeat(50));
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(baseUrl, endpoint);
    results.push({ endpoint, ...result });
  }
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 ${name} API 测试结果: ${successful}/${total} 成功`);
  
  if (successful === total) {
    console.log(`🎉 ${name} API 完全可用！`);
  } else if (successful > 0) {
    console.log(`⚠️  ${name} API 部分可用`);
  } else {
    console.log(`💥 ${name} API 不可用`);
  }
  
  return { name, baseUrl, results, success: successful === total };
}

async function main() {
  console.log('🔧 JKAnime FLV API 连接测试');
  console.log('测试时间:', new Date().toLocaleString());
  
  const testResults = [];
  
  // 测试本地 API
  testResults.push(await testAPI('本地', APIs.local));
  
  // 测试生产 API
  testResults.push(await testAPI('生产', APIs.production));
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📋 测试总结');
  console.log('='.repeat(60));
  
  testResults.forEach(result => {
    const status = result.success ? '✅ 可用' : '❌ 不可用';
    console.log(`${result.name} API (${result.baseUrl}): ${status}`);
  });
  
  const availableAPIs = testResults.filter(r => r.success);
  
  if (availableAPIs.length > 0) {
    console.log(`\n🎯 推荐配置:`);
    const recommended = availableAPIs[0];
    console.log(`NEXT_PUBLIC_API_BASE_URL=${recommended.baseUrl}`);
    console.log(`USE_MOCK_API=false`);
  } else {
    console.log(`\n🔄 建议使用 Mock API:`);
    console.log(`USE_MOCK_API=true`);
  }
  
  console.log('\n✨ 测试完成！');
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAPI, testEndpoint };