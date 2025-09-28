#!/usr/bin/env node

/**
 * 内容更新脚本
 * 定时更新sitemap和静态页面内容
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://api-jk.funnyu.xyz/api/v1';
const SITE_URL = 'https://jkanimeflv.com';

// 配置
const UPDATE_CONFIG = {
  maxRetries: 3,
  retryDelay: 2000,
  timeout: 30000,
  cacheDir: path.join(__dirname, '../.cache'),
  lastUpdateFile: path.join(__dirname, '../.cache/last-update.json')
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    update: '🔄'
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// 确保缓存目录存在
function ensureCacheDir() {
  if (!fs.existsSync(UPDATE_CONFIG.cacheDir)) {
    fs.mkdirSync(UPDATE_CONFIG.cacheDir, { recursive: true });
  }
}

// 获取上次更新时间
function getLastUpdateTime() {
  try {
    if (fs.existsSync(UPDATE_CONFIG.lastUpdateFile)) {
      const data = JSON.parse(fs.readFileSync(UPDATE_CONFIG.lastUpdateFile, 'utf8'));
      return new Date(data.timestamp);
    }
  } catch (error) {
    log(`Failed to read last update time: ${error.message}`, 'warning');
  }
  return new Date(0); // 如果没有记录，返回很久以前的时间
}

// 保存更新时间
function saveUpdateTime() {
  const updateData = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  };
  
  try {
    fs.writeFileSync(UPDATE_CONFIG.lastUpdateFile, JSON.stringify(updateData, null, 2));
    log('Update time saved', 'success');
  } catch (error) {
    log(`Failed to save update time: ${error.message}`, 'error');
  }
}

// 带重试的API请求
async function apiRequest(endpoint, retries = UPDATE_CONFIG.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      log(`Fetching ${endpoint} (attempt ${i + 1}/${retries})`, 'update');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), UPDATE_CONFIG.timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'JKAnime-ContentUpdater/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
      
    } catch (error) {
      log(`Request failed (attempt ${i + 1}): ${error.message}`, 'warning');
      
      if (i === retries - 1) {
        throw error;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, UPDATE_CONFIG.retryDelay));
    }
  }
}

// 检查内容是否需要更新
async function shouldUpdate() {
  const lastUpdate = getLastUpdateTime();
  const now = new Date();
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  
  // 如果距离上次更新超过6小时，则需要更新
  const needsUpdate = hoursSinceUpdate >= 6;
  
  log(`Last update: ${lastUpdate.toISOString()}`, 'info');
  log(`Hours since update: ${hoursSinceUpdate.toFixed(2)}`, 'info');
  log(`Needs update: ${needsUpdate}`, 'info');
  
  return needsUpdate;
}

// 更新首页内容缓存
async function updateHomeContent() {
  try {
    log('Updating home content...', 'update');
    const homeData = await apiRequest('/anime/home');
    
    const cacheFile = path.join(UPDATE_CONFIG.cacheDir, 'home-data.json');
    fs.writeFileSync(cacheFile, JSON.stringify({
      data: homeData,
      timestamp: new Date().toISOString(),
      ttl: 6 * 60 * 60 * 1000 // 6小时TTL
    }, null, 2));
    
    log(`Home content cached: ${homeData.latestMovies?.length || 0} movies, ${homeData.latestSeries?.length || 0} series`, 'success');
    return homeData;
  } catch (error) {
    log(`Failed to update home content: ${error.message}`, 'error');
    return null;
  }
}

// 更新分类数据
async function updateGenresData() {
  try {
    log('Updating genres data...', 'update');
    const genresData = await apiRequest('/anime/genres');
    
    const cacheFile = path.join(UPDATE_CONFIG.cacheDir, 'genres-data.json');
    fs.writeFileSync(cacheFile, JSON.stringify({
      data: genresData,
      timestamp: new Date().toISOString(),
      ttl: 24 * 60 * 60 * 1000 // 24小时TTL
    }, null, 2));
    
    log(`Genres data cached: ${genresData.genres?.length || 0} genres`, 'success');
    return genresData;
  } catch (error) {
    log(`Failed to update genres data: ${error.message}`, 'error');
    return null;
  }
}

// 更新热门动漫列表
async function updatePopularAnime() {
  try {
    log('Updating popular anime list...', 'update');
    const popularData = await apiRequest('/anime/list?page=1&size=50');
    
    const cacheFile = path.join(UPDATE_CONFIG.cacheDir, 'popular-anime.json');
    fs.writeFileSync(cacheFile, JSON.stringify({
      data: popularData,
      timestamp: new Date().toISOString(),
      ttl: 12 * 60 * 60 * 1000 // 12小时TTL
    }, null, 2));
    
    log(`Popular anime cached: ${popularData.list?.length || 0} items`, 'success');
    return popularData;
  } catch (error) {
    log(`Failed to update popular anime: ${error.message}`, 'error');
    return null;
  }
}

// 生成内容统计报告
function generateContentReport(homeData, genresData, popularData) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalMovies: homeData?.latestMovies?.length || 0,
      totalSeries: homeData?.latestSeries?.length || 0,
      totalGenres: genresData?.genres?.length || 0,
      popularAnime: popularData?.list?.length || 0
    },
    lastUpdate: {
      home: homeData ? 'success' : 'failed',
      genres: genresData ? 'success' : 'failed',
      popular: popularData ? 'success' : 'failed'
    }
  };
  
  const reportFile = path.join(UPDATE_CONFIG.cacheDir, 'content-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  log('Content report generated:', 'success');
  log(`- Movies: ${report.summary.totalMovies}`, 'info');
  log(`- Series: ${report.summary.totalSeries}`, 'info');
  log(`- Genres: ${report.summary.totalGenres}`, 'info');
  log(`- Popular: ${report.summary.popularAnime}`, 'info');
  
  return report;
}

// 清理过期缓存
function cleanupCache() {
  try {
    const files = fs.readdirSync(UPDATE_CONFIG.cacheDir);
    let cleanedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(UPDATE_CONFIG.cacheDir, file);
      
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (content.timestamp && content.ttl) {
          const age = Date.now() - new Date(content.timestamp).getTime();
          if (age > content.ttl) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        }
      } catch (error) {
        // 忽略无法解析的文件
      }
    });
    
    if (cleanedCount > 0) {
      log(`Cleaned up ${cleanedCount} expired cache files`, 'success');
    }
  } catch (error) {
    log(`Cache cleanup failed: ${error.message}`, 'warning');
  }
}

// 主更新函数
async function main() {
  log('🔄 Starting content update process...', 'update');
  
  try {
    ensureCacheDir();
    
    // 检查是否需要更新
    const needsUpdate = await shouldUpdate();
    
    if (!needsUpdate && !process.argv.includes('--force')) {
      log('Content is up to date, skipping update', 'info');
      return;
    }
    
    if (process.argv.includes('--force')) {
      log('Forced update requested', 'info');
    }
    
    // 清理过期缓存
    cleanupCache();
    
    // 并行更新内容
    log('Updating content in parallel...', 'update');
    const [homeData, genresData, popularData] = await Promise.allSettled([
      updateHomeContent(),
      updateGenresData(),
      updatePopularAnime()
    ]);
    
    // 处理结果
    const results = {
      home: homeData.status === 'fulfilled' ? homeData.value : null,
      genres: genresData.status === 'fulfilled' ? genresData.value : null,
      popular: popularData.status === 'fulfilled' ? popularData.value : null
    };
    
    // 生成报告
    generateContentReport(results.home, results.genres, results.popular);
    
    // 保存更新时间
    saveUpdateTime();
    
    log('✅ Content update completed successfully!', 'success');
    
  } catch (error) {
    log(`Content update failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateHomeContent, updateGenresData, updatePopularAnime };