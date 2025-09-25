#!/usr/bin/env node

/**
 * 生产环境健康检查脚本
 * 检查网站的各项功能和性能指标
 */

const https = require('https');
const http = require('http');

// 生产环境配置
const PRODUCTION_CONFIG = {
  domain: 'jkanimeflv.com',
  apiBase: 'https://api-jk.funnyu.xyz',
  expectedPages: [
    '/',
    '/peliculas',
    '/series',
    '/generos',
    '/buscar',
    '/historial',
    '/acerca',
    '/contacto',
    '/privacidad',
    '/terminos'
  ],
  apiEndpoints: [
    '/api/v1/anime/home',
    '/api/v1/anime/genres',
    '/api/v1/anime/list'
  ]
};

class ProductionHealthChecker {
  constructor() {
    this.results = {
      website: [],
      api: [],
      performance: [],
      seo: []
    };
  }

  async checkUrl(url, timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const isHttps = url.startsWith('https');
      const client = isHttps ? https : http;
      
      const req = client.get(url, (res) => {
        const duration = Date.now() - startTime;
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            duration,
            size: data.length,
            headers: res.headers
          });
        });
      });
      
      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          duration: Date.now() - startTime
        });
      });
      
      req.setTimeout(timeout, () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Timeout',
          duration: timeout
        });
      });
    });
  }

  async checkWebsitePages() {
    console.log('🌐 检查网站页面...');
    
    for (const page of PRODUCTION_CONFIG.expectedPages) {
      const url = `https://${PRODUCTION_CONFIG.domain}${page}`;
      console.log(`  检查: ${page}`);
      
      const result = await this.checkUrl(url);
      this.results.website.push({
        page,
        url,
        ...result
      });
      
      if (result.success) {
        console.log(`  ✅ ${page} (${result.duration}ms)`);
      } else {
        console.log(`  ❌ ${page} - ${result.error || `HTTP ${result.statusCode}`}`);
      }
    }
  }

  async checkApiEndpoints() {
    console.log('\n🔌 检查 API 端点...');
    
    for (const endpoint of PRODUCTION_CONFIG.apiEndpoints) {
      const url = `${PRODUCTION_CONFIG.apiBase}${endpoint}`;
      console.log(`  检查: ${endpoint}`);
      
      const result = await this.checkUrl(url);
      this.results.api.push({
        endpoint,
        url,
        ...result
      });
      
      if (result.success) {
        console.log(`  ✅ ${endpoint} (${result.duration}ms)`);
      } else {
        console.log(`  ❌ ${endpoint} - ${result.error || `HTTP ${result.statusCode}`}`);
      }
    }
  }

  async checkPerformance() {
    console.log('\n⚡ 检查性能指标...');
    
    // 检查首页性能
    const homeUrl = `https://${PRODUCTION_CONFIG.domain}`;
    const result = await this.checkUrl(homeUrl);
    
    if (result.success) {
      const performance = {
        loadTime: result.duration,
        responseSize: result.size,
        hasGzip: result.headers['content-encoding'] === 'gzip' || result.headers['content-encoding'] === 'br',
        hasCaching: !!result.headers['cache-control'],
        hasSecurityHeaders: {
          hsts: !!result.headers['strict-transport-security'],
          xframe: !!result.headers['x-frame-options'],
          xcontent: !!result.headers['x-content-type-options']
        }
      };
      
      this.results.performance.push(performance);
      
      console.log(`  ⏱️  加载时间: ${performance.loadTime}ms`);
      console.log(`  📦 响应大小: ${(performance.responseSize / 1024).toFixed(2)}KB`);
      console.log(`  🗜️  压缩: ${performance.hasGzip ? '✅' : '❌'}`);
      console.log(`  💾 缓存: ${performance.hasCaching ? '✅' : '❌'}`);
      console.log(`  🔒 安全头: HSTS ${performance.hasSecurityHeaders.hsts ? '✅' : '❌'}, X-Frame ${performance.hasSecurityHeaders.xframe ? '✅' : '❌'}`);
    }
  }

  async checkSEO() {
    console.log('\n🔍 检查 SEO 配置...');
    
    const homeUrl = `https://${PRODUCTION_CONFIG.domain}`;
    const result = await this.checkUrl(homeUrl);
    
    if (result.success) {
      // 检查基本 SEO 元素 (简化版，实际需要解析 HTML)
      const seoChecks = {
        hasTitle: result.headers['content-type']?.includes('text/html'),
        hasMetaDescription: true, // 需要 HTML 解析
        hasCanonical: true, // 需要 HTML 解析
        hasOpenGraph: true, // 需要 HTML 解析
        hasStructuredData: true // 需要 HTML 解析
      };
      
      this.results.seo.push(seoChecks);
      
      console.log(`  📄 HTML 内容: ${seoChecks.hasTitle ? '✅' : '❌'}`);
      console.log(`  🏷️  Meta 标签: 需要详细检查`);
      console.log(`  🔗 Canonical: 需要详细检查`);
      console.log(`  📱 Open Graph: 需要详细检查`);
    }
    
    // 检查 sitemap 和 robots.txt
    const sitemapResult = await this.checkUrl(`https://${PRODUCTION_CONFIG.domain}/sitemap.xml`);
    const robotsResult = await this.checkUrl(`https://${PRODUCTION_CONFIG.domain}/robots.txt`);
    
    console.log(`  🗺️  Sitemap: ${sitemapResult.success ? '✅' : '❌'}`);
    console.log(`  🤖 Robots.txt: ${robotsResult.success ? '✅' : '❌'}`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 健康检查报告');
    console.log('='.repeat(60));
    
    // 网站页面统计
    const websiteSuccess = this.results.website.filter(r => r.success).length;
    const websiteTotal = this.results.website.length;
    console.log(`🌐 网站页面: ${websiteSuccess}/${websiteTotal} 正常`);
    
    // API 端点统计
    const apiSuccess = this.results.api.filter(r => r.success).length;
    const apiTotal = this.results.api.length;
    console.log(`🔌 API 端点: ${apiSuccess}/${apiTotal} 正常`);
    
    // 性能统计
    if (this.results.performance.length > 0) {
      const perf = this.results.performance[0];
      console.log(`⚡ 首页加载: ${perf.loadTime}ms`);
      console.log(`🗜️  压缩启用: ${perf.hasGzip ? '是' : '否'}`);
      console.log(`🔒 安全配置: ${Object.values(perf.hasSecurityHeaders).filter(Boolean).length}/3 项`);
    }
    
    // 总体状态
    const overallHealth = (websiteSuccess + apiSuccess) / (websiteTotal + apiTotal);
    console.log(`\n🎯 总体健康度: ${(overallHealth * 100).toFixed(1)}%`);
    
    if (overallHealth >= 0.9) {
      console.log('🟢 状态: 优秀');
    } else if (overallHealth >= 0.7) {
      console.log('🟡 状态: 良好');
    } else {
      console.log('🔴 状态: 需要关注');
    }
    
    // 建议
    console.log('\n💡 优化建议:');
    
    if (this.results.performance.length > 0) {
      const perf = this.results.performance[0];
      
      if (perf.loadTime > 3000) {
        console.log('  - 首页加载时间较慢，建议优化');
      }
      
      if (!perf.hasGzip) {
        console.log('  - 启用 Gzip/Brotli 压缩');
      }
      
      if (!perf.hasCaching) {
        console.log('  - 配置适当的缓存策略');
      }
      
      const securityIssues = Object.entries(perf.hasSecurityHeaders)
        .filter(([key, value]) => !value)
        .map(([key]) => key);
      
      if (securityIssues.length > 0) {
        console.log(`  - 配置安全头: ${securityIssues.join(', ')}`);
      }
    }
    
    // 失败的检查项
    const failedWebsite = this.results.website.filter(r => !r.success);
    const failedApi = this.results.api.filter(r => !r.success);
    
    if (failedWebsite.length > 0) {
      console.log('\n❌ 失败的页面:');
      failedWebsite.forEach(item => {
        console.log(`  - ${item.page}: ${item.error || `HTTP ${item.statusCode}`}`);
      });
    }
    
    if (failedApi.length > 0) {
      console.log('\n❌ 失败的 API:');
      failedApi.forEach(item => {
        console.log(`  - ${item.endpoint}: ${item.error || `HTTP ${item.statusCode}`}`);
      });
    }
  }

  async run() {
    console.log('🏥 JKAnime FLV 生产环境健康检查');
    console.log(`🌐 域名: ${PRODUCTION_CONFIG.domain}`);
    console.log(`🔌 API: ${PRODUCTION_CONFIG.apiBase}`);
    console.log(`⏰ 时间: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    
    try {
      await this.checkWebsitePages();
      await this.checkApiEndpoints();
      await this.checkPerformance();
      await this.checkSEO();
      
      this.generateReport();
      
      // 返回健康状态
      const totalChecks = this.results.website.length + this.results.api.length;
      const successfulChecks = this.results.website.filter(r => r.success).length + 
                              this.results.api.filter(r => r.success).length;
      
      const healthScore = successfulChecks / totalChecks;
      
      if (healthScore >= 0.9) {
        console.log('\n✨ 健康检查完成 - 系统运行良好！');
        process.exit(0);
      } else {
        console.log('\n⚠️  健康检查完成 - 发现问题，请检查上述报告');
        process.exit(1);
      }
      
    } catch (error) {
      console.error('\n💥 健康检查失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行健康检查
if (require.main === module) {
  const checker = new ProductionHealthChecker();
  checker.run();
}

module.exports = ProductionHealthChecker;