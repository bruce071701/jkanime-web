# Cloudflare Pages 部署指南

## 概述

本指南将帮助你将 JKAnime FLV 项目部署到 Cloudflare Pages，享受全球 CDN 加速和优秀的性能。

## 🚀 快速部署

### 方法 1: 通过 Git 集成（推荐）

1. **连接 GitHub 仓库**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 Pages 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择你的 GitHub 仓库

2. **配置构建设置**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Root directory: /
   ```

3. **设置环境变量**
   在 Cloudflare Pages 项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
   NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
   USE_MOCK_API=false
   NODE_ENV=production
   ```

### 方法 2: 使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   npm run deploy:cloudflare
   ```

## ⚙️ 配置详解

### 构建配置

项目已经配置了适合 Cloudflare Pages 的设置：

```javascript
// next.config.js
const nextConfig = {
  output: 'export',           // 静态导出
  trailingSlash: true,        // 添加尾部斜杠
  images: {
    unoptimized: true,        // 禁用 Next.js 图片优化
    loader: 'custom',         // 使用自定义加载器
  },
}
```

### 环境变量

在 Cloudflare Pages 控制台中设置以下环境变量：

#### 生产环境
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net
USE_MOCK_API=false
NEXT_TELEMETRY_DISABLED=1
```

#### 预览环境
```
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=https://jkanimeflv-preview.pages.dev
USE_MOCK_API=true
```

### 自定义域名配置

1. **添加自定义域名**
   - 在 Cloudflare Pages 项目中点击 "Custom domains"
   - 添加 `jkanimeflv.com`
   - 按照指示配置 DNS 记录

2. **SSL/TLS 配置**
   - Cloudflare 自动提供免费 SSL 证书
   - 确保 SSL/TLS 模式设置为 "Full (strict)"

## 🔧 性能优化

### 缓存配置

项目包含 `_headers` 文件，配置了最佳的缓存策略：

```
# 静态资源缓存 1 年
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# 图片缓存
/images/*
  Cache-Control: public, max-age=31536000

# API 路由不缓存
/api/*
  Cache-Control: no-cache, no-store, must-revalidate
```

### 图片优化

使用 Cloudflare 的图片优化服务：

```javascript
// src/lib/imageLoader.js
export default function cloudflareImageLoader({ src, width, quality }) {
  const params = [`w=${width}`];
  if (quality) params.push(`q=${quality}`);
  return `/cdn-cgi/image/${params.join(',')}/${src}`;
}
```

### 压缩和 Minification

Cloudflare 自动提供：
- Gzip/Brotli 压缩
- HTML/CSS/JS Minification
- 自动优化

## 🛡️ 安全配置

### 安全头

项目配置了完整的安全头：

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### WAF 规则

在 Cloudflare 控制台中可以配置：
- DDoS 保护
- Bot 管理
- 速率限制
- 地理位置阻止

## 📊 监控和分析

### Cloudflare Analytics

Cloudflare 提供详细的分析数据：
- 流量统计
- 性能指标
- 安全事件
- 缓存命中率

### 集成 Google Analytics

在环境变量中设置：
```
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

## 🔄 CI/CD 工作流

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://jkanimeflv.com
          NEXT_PUBLIC_API_BASE_URL: https://api.jkanime.net
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: jkanimeflv
          directory: out
```

## 🐛 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查 Node.js 版本
   node --version  # 应该是 18+
   
   # 清理缓存
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **图片不显示**
   - 检查图片 URL 是否正确
   - 确认 `unoptimized: true` 设置
   - 验证自定义图片加载器

3. **API 调用失败**
   - 检查 CORS 设置
   - 验证 API 端点 URL
   - 确认环境变量配置

4. **路由问题**
   - 检查 `_redirects` 文件
   - 确认 `trailingSlash: true` 设置
   - 验证动态路由配置

### 调试工具

1. **Cloudflare 日志**
   ```bash
   wrangler pages deployment tail
   ```

2. **本地预览**
   ```bash
   npm run preview
   ```

3. **构建分析**
   ```bash
   npm run analyze
   ```

## 📈 性能优化建议

### Core Web Vitals

优化建议：
- 使用 Cloudflare 的自动优化
- 启用 Early Hints
- 配置 HTTP/3
- 使用 Argo Smart Routing

### 缓存策略

- 静态资源：长期缓存
- API 响应：短期缓存或不缓存
- HTML 页面：适中缓存时间

### 全球分发

Cloudflare 的 200+ 数据中心确保：
- 低延迟访问
- 高可用性
- 自动故障转移

## 🎯 SEO 优化

### 自动优化

Cloudflare 提供：
- 自动 minification
- 图片优化
- 移动端优化
- AMP 支持

### 结构化数据

项目已包含完整的结构化数据：
- WebSite Schema
- Movie/TVSeries Schema
- BreadcrumbList Schema

---

**部署完成后，你的 JKAnime FLV 网站将享受 Cloudflare 的全球 CDN 加速和企业级安全保护！** 🚀