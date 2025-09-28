#!/usr/bin/env node

/**
 * Cloudflare Pages 统一构建脚本
 * 包含所有必要的构建步骤和优化
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 构建配置
const BUILD_CONFIG = {
  outputDir: 'dist',
  staticDir: 'public/static',
  functionsDir: 'functions',
  enableCompression: true,
  enableOptimization: true,
  generateSitemap: true,
  generateStaticPages: true,
  updateContent: true
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    build: '🔨'
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// 执行命令
function execCommand(command, description) {
  log(`${description}...`, 'build');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`${description} completed`, 'success');
  } catch (error) {
    log(`${description} failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'info');
  }
}

// 复制文件
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    log(`Copied: ${src} → ${dest}`, 'info');
  } catch (error) {
    log(`Failed to copy ${src}: ${error.message}`, 'warning');
  }
}

// 复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  
  ensureDir(dest);
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
}

// 生成构建信息
function generateBuildInfo() {
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    commit: process.env.CF_PAGES_COMMIT_SHA || 'unknown',
    branch: process.env.CF_PAGES_BRANCH || 'main',
    environment: process.env.NODE_ENV || 'production'
  };
  
  const buildInfoPath = path.join(BUILD_CONFIG.outputDir, 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  log(`Generated build info: ${buildInfoPath}`, 'success');
}

// 优化静态资源
function optimizeAssets() {
  log('Optimizing static assets...', 'build');
  
  const distDir = BUILD_CONFIG.outputDir;
  if (!fs.existsSync(distDir)) return;
  
  // 生成资源清单
  const assets = [];
  
  function scanAssets(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        scanAssets(filePath, relativePath);
      } else {
        const stats = fs.statSync(filePath);
        assets.push({
          path: relativePath.replace(/\\/g, '/'),
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    });
  }
  
  scanAssets(distDir);
  
  const manifestPath = path.join(distDir, 'assets-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(assets, null, 2));
  log(`Generated assets manifest with ${assets.length} files`, 'success');
}

// 生成Service Worker
function generateServiceWorker() {
  log('Generating optimized Service Worker...', 'build');
  
  const swContent = `// Cloudflare Pages 优化的 Service Worker
const CACHE_VERSION = 'v${Date.now()}';
const STATIC_CACHE = \`jkanime-static-\${CACHE_VERSION}\`;
const API_CACHE = \`jkanime-api-\${CACHE_VERSION}\`;

// 预缓存资源列表
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/jkanime-icon.svg'
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('SW: Installing for Cloudflare Pages...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('jkanime-') && 
                cacheName !== STATIC_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// 获取事件
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') return;
  
  // 利用 Cloudflare 缓存，不拦截 API 请求
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // 处理静态资源
  if (url.pathname.match(/\\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // 处理 HTML 页面
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHTMLRequest(request));
    return;
  }
});

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Asset not found', { status: 404 });
  }
}

async function handleHTMLRequest(request) {
  try {
    // 优先使用网络，利用 Cloudflare 的边缘缓存
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // 网络失败时返回缓存的首页
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/');
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('SW: Performing background sync...');
  // 这里可以添加后台同步逻辑
}
`;

  const swPath = path.join(BUILD_CONFIG.outputDir, 'sw.js');
  fs.writeFileSync(swPath, swContent);
  log('Service Worker generated', 'success');
}

// 主构建函数
async function main() {
  log('🚀 Starting Cloudflare Pages build process...', 'build');
  
  try {
    // 1. 清理旧的构建文件
    if (fs.existsSync(BUILD_CONFIG.outputDir)) {
      log('Cleaning previous build...', 'build');
      fs.rmSync(BUILD_CONFIG.outputDir, { recursive: true, force: true });
    }
    
    // 2. 运行标准构建流程（包含内容更新、静态页面生成、sitemap生成、编译和构建）
    execCommand('npm run build', 'Running standard build process');
    
    // 7. 复制Cloudflare Pages配置文件
    log('Copying Cloudflare Pages configuration...', 'build');
    copyFile('_headers', path.join(BUILD_CONFIG.outputDir, '_headers'));
    copyFile('_redirects', path.join(BUILD_CONFIG.outputDir, '_redirects'));
    
    // 8. 复制Functions
    if (fs.existsSync(BUILD_CONFIG.functionsDir)) {
      copyDir(BUILD_CONFIG.functionsDir, path.join(BUILD_CONFIG.outputDir, '_functions'));
    }
    
    // 9. 复制静态预渲染页面
    if (fs.existsSync(BUILD_CONFIG.staticDir)) {
      copyDir(BUILD_CONFIG.staticDir, path.join(BUILD_CONFIG.outputDir, 'static'));
    }
    
    // 10. 生成优化的Service Worker
    generateServiceWorker();
    
    // 11. 生成构建信息
    generateBuildInfo();
    
    // 12. 优化资源
    if (BUILD_CONFIG.enableOptimization) {
      optimizeAssets();
    }
    
    // 13. 显示构建统计
    const stats = fs.statSync(BUILD_CONFIG.outputDir);
    log(`Build completed successfully!`, 'success');
    log(`Output directory: ${BUILD_CONFIG.outputDir}`, 'info');
    log(`Build size: ${(getDirSize(BUILD_CONFIG.outputDir) / 1024 / 1024).toFixed(2)} MB`, 'info');
    
  } catch (error) {
    log(`Build failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// 计算目录大小
function getDirSize(dir) {
  let size = 0;
  
  function calculateSize(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        size += stats.size;
      }
    });
  }
  
  if (fs.existsSync(dir)) {
    calculateSize(dir);
  }
  
  return size;
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}