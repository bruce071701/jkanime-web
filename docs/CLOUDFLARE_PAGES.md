# Cloudflare Pages 部署指南

## 🚀 部署配置

### 构建设置
- **构建命令**: `npm run build:pages`
- **构建输出目录**: `dist`
- **Node.js 版本**: `18.x` 或更高

### 环境变量

#### 生产环境变量
```
NODE_VERSION=18
VITE_API_BASE_URL=https://api-jk.funnyu.xyz
SITE_URL=https://jkanimeflv.com
```

#### 可选环境变量
```
API_BASE_URL=https://api-jk.funnyu.xyz/api/v1
PRERENDERED_PAGES=your-kv-namespace (如果使用KV存储)
```

## 📋 Cloudflare Pages 功能

### 1. 自动缓存优化
- **静态资源**: 1年缓存 + immutable
- **HTML页面**: 1小时浏览器缓存 + 1天边缘缓存
- **API响应**: 5分钟浏览器缓存 + 10分钟边缘缓存

### 2. SEO优化
- 自动为搜索引擎爬虫提供预渲染内容
- 完整的结构化数据支持
- Open Graph 和 Twitter Card 元数据

### 3. API代理
- 自动代理 `/api/v1/*` 到后端API
- 解决CORS问题
- 自动添加缓存头

### 4. 重定向规则
- 旧URL自动重定向到新URL
- SPA路由回退到index.html
- SEO友好的URL重写

## 🔧 Functions 功能

### 中间件 (`functions/_middleware.ts`)
- 爬虫检测和预渲染内容服务
- API代理处理
- 安全头和缓存头设置

### SEO路由 (`functions/seo/[...path].ts`)
- 动态生成SEO优化内容
- KV存储缓存预渲染页面
- 结构化数据生成

## 📊 性能优化

### Cloudflare 边缘缓存
- 全球CDN分发
- 自动压缩 (Gzip/Brotli)
- 图片优化 (Polish)
- Minification

### 缓存策略
```
静态资源 (JS/CSS/图片): Cache-Control: public, max-age=31536000, immutable
HTML页面: Cache-Control: public, max-age=3600, s-maxage=86400
API响应: Cache-Control: public, max-age=300, s-maxage=600
```

## 🛠️ 本地开发

### 使用 Wrangler 本地测试
```bash
# 安装 Wrangler
npm install -g wrangler

# 本地开发 Functions
wrangler pages dev dist --compatibility-date=2023-12-01

# 测试构建
npm run build:pages
```

### 环境变量设置
创建 `.env.local` 文件：
```
VITE_API_BASE_URL=https://api-jk.funnyu.xyz
```

## 📈 监控和分析

### Cloudflare Analytics
- 自动启用 Web Analytics
- Core Web Vitals 监控
- 流量和性能指标

### 自定义监控
- Google Analytics 集成
- 性能监控自动上报
- 错误跟踪

## 🔒 安全配置

### 安全头
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### HTTPS
- 自动HTTPS重定向
- HSTS预加载
- TLS 1.3支持

## 🚀 部署流程

### 自动部署
1. 推送代码到GitHub
2. Cloudflare Pages自动检测变更
3. 运行构建命令 `npm run build:pages`
4. 自动部署到全球边缘网络

### 手动部署
```bash
# 构建项目
npm run build:pages

# 使用 Wrangler 部署
wrangler pages publish dist --project-name=jkanime-flv
```

## 🔍 故障排除

### 常见问题

1. **Functions 超时**
   - 检查API响应时间
   - 优化数据获取逻辑
   - 使用KV缓存减少API调用

2. **缓存问题**
   - 使用 Cloudflare 仪表板清除缓存
   - 检查 Cache-Control 头设置
   - 验证 _headers 文件配置

3. **SEO内容不显示**
   - 检查爬虫检测逻辑
   - 验证API响应格式
   - 查看Functions日志

### 调试工具
- Cloudflare Pages 仪表板
- Real-time Logs
- Wrangler tail 命令

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Functions 文档](https://developers.cloudflare.com/pages/platform/functions/)
- [KV 存储文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/)