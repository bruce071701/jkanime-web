# 🚀 JKAnime FLV 生产环境配置指南

## 📋 目录
1. [Cloudflare Pages 配置](#cloudflare-pages-配置)
2. [自定义域名设置](#自定义域名设置)
3. [环境变量配置](#环境变量配置)
4. [性能优化](#性能优化)
5. [安全配置](#安全配置)
6. [监控和分析](#监控和分析)
7. [SEO 优化](#seo-优化)
8. [备份和维护](#备份和维护)

## 🌐 Cloudflare Pages 配置

### 基本设置
```
项目名称: jkanimeflv
生产分支: main
构建命令: npm run build
构建输出目录: .next
Node.js 版本: 18.x 或 20.x
```

### 环境变量 (生产环境)
在 Cloudflare Pages 控制台 → Settings → Environment variables 中配置：

```env
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
NEXT_PUBLIC_SITE_NAME="JKAnime FLV"

# API 配置
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
USE_MOCK_API=false

# 性能优化
NEXT_TELEMETRY_DISABLED=1

# SEO 配置
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your-bing-verification-code

# 分析工具
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER=GTM-XXXXXXX

# 社交媒体
NEXT_PUBLIC_TWITTER_HANDLE=@JKAnimeFLV
NEXT_PUBLIC_FACEBOOK_PAGE=JKAnimeFLV
```

## 🌍 自定义域名设置

### 1. 在 Cloudflare Pages 中添加域名
1. 进入 Cloudflare Pages 项目
2. 点击 "Custom domains"
3. 添加 `jkanimeflv.com`
4. 添加 `www.jkanimeflv.com` (可选)

### 2. DNS 配置
在你的域名注册商或 Cloudflare DNS 中设置：

```dns
# 主域名
jkanimeflv.com    CNAME    jkanime-web.pages.dev

# WWW 重定向 (可选)
www.jkanimeflv.com    CNAME    jkanime-web.pages.dev
```

### 3. SSL/TLS 设置
- Cloudflare 自动提供 SSL 证书
- 确保 SSL/TLS 模式设置为 "Full (strict)"
- 启用 "Always Use HTTPS"

## ⚙️ 环境变量配置

### 生产环境变量详解

#### 必需变量
```env
NODE_ENV=production                           # 生产环境标识
NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com  # 网站完整 URL
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz  # API 基础 URL
USE_MOCK_API=false                           # 禁用 Mock API
```

#### SEO 优化变量
```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123  # Google 站点验证
NEXT_PUBLIC_BING_SITE_VERIFICATION=def456    # Bing 站点验证
```

#### 分析工具变量
```env
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX    # Google Analytics
NEXT_PUBLIC_GOOGLE_TAG_MANAGER=GTM-XXXXXXX  # Google Tag Manager
```

#### 社交媒体变量
```env
NEXT_PUBLIC_TWITTER_HANDLE=@JKAnimeFLV      # Twitter 账号
NEXT_PUBLIC_FACEBOOK_PAGE=JKAnimeFLV        # Facebook 页面
```

## 🚀 性能优化

### 1. Cloudflare 缓存设置

#### 页面规则配置
```
规则 1: jkanimeflv.com/_next/static/*
- 缓存级别: 缓存所有内容
- 边缘缓存 TTL: 1 年
- 浏览器缓存 TTL: 1 年

规则 2: jkanimeflv.com/api/*
- 缓存级别: 绕过缓存
- 禁用性能功能

规则 3: jkanimeflv.com/*
- 缓存级别: 标准
- 边缘缓存 TTL: 2 小时
- 浏览器缓存 TTL: 4 小时
```

#### 速度优化
```
✅ 启用 Auto Minify (HTML, CSS, JS)
✅ 启用 Brotli 压缩
✅ 启用 HTTP/3
✅ 启用 0-RTT Connection Resumption
✅ 启用 Early Hints
```

### 2. 图片优化
```
✅ 启用 Polish (图片压缩)
✅ 启用 WebP 转换
✅ 启用 Mirage (自适应图片)
```

### 3. 网络优化
```
✅ 启用 Argo Smart Routing
✅ 启用 Railgun (如果可用)
✅ 配置 CNAME Flattening
```

## 🔒 安全配置

### 1. SSL/TLS 设置
```
SSL/TLS 加密模式: Full (strict)
最低 TLS 版本: TLS 1.2
TLS 1.3: 启用
HSTS: 启用 (max-age=31536000; includeSubDomains; preload)
```

### 2. 安全头配置
在 `_headers` 文件中已配置：
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 3. WAF 规则
```
✅ 启用 Cloudflare Managed Rules
✅ 启用 OWASP Core Rule Set
✅ 配置速率限制 (100 请求/分钟)
✅ 启用 Bot Fight Mode
```

### 4. DDoS 保护
```
✅ 启用 HTTP DDoS Attack Protection
✅ 启用 Network-layer DDoS Attack Protection
✅ 配置 Under Attack Mode (如需要)
```

## 📊 监控和分析

### 1. Google Analytics 4 配置

#### 安装代码
在 `src/app/layout.tsx` 中添加：
```typescript
{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
      `}
    </Script>
  </>
)}
```

#### 关键指标追踪
- 页面浏览量
- 用户会话时长
- 跳出率
- 转化率
- Core Web Vitals

### 2. Cloudflare Analytics
```
✅ 启用 Web Analytics
✅ 配置 Real User Monitoring (RUM)
✅ 监控 Core Web Vitals
✅ 设置性能预算
```

### 3. 错误监控
推荐集成 Sentry：
```bash
npm install @sentry/nextjs
```

### 4. 正常运行时间监控
推荐工具：
- UptimeRobot
- Pingdom
- StatusCake

## 🔍 SEO 优化

### 1. Google Search Console 配置
1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加 `jkanimeflv.com` 属性
3. 验证所有权 (使用 HTML 标签方法)
4. 提交 sitemap: `https://jkanimeflv.com/sitemap.xml`

### 2. Bing Webmaster Tools
1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加网站
3. 验证所有权
4. 提交 sitemap

### 3. 结构化数据验证
使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 验证：
- WebSite schema
- Movie/TVSeries schema
- BreadcrumbList schema

### 4. 页面速度优化
目标指标：
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🔄 备份和维护

### 1. 代码备份
```bash
# 自动备份到 GitHub
git push origin main

# 创建发布标签
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### 2. 数据库备份 (如适用)
- 定期备份用户数据
- 备份观看历史
- 备份配置设置

### 3. 定期维护任务

#### 每周
- 检查网站正常运行时间
- 审查 Analytics 数据
- 检查 Core Web Vitals

#### 每月
- 更新依赖包
- 安全漏洞扫描
- 性能优化审查

#### 每季度
- 全面安全审计
- SEO 表现分析
- 用户体验优化

## 🚨 故障排除

### 常见问题

#### 1. 网站无法访问
```bash
# 检查 DNS 解析
nslookup jkanimeflv.com

# 检查 SSL 证书
openssl s_client -connect jkanimeflv.com:443

# 检查 Cloudflare 状态
curl -I https://jkanimeflv.com
```

#### 2. API 连接问题
```bash
# 测试 API 连接
curl https://api-jk.funnyu.xyz/api/v1/anime/home

# 检查 CORS 设置
curl -H "Origin: https://jkanimeflv.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api-jk.funnyu.xyz/api/v1/anime/home
```

#### 3. 性能问题
- 检查 Cloudflare Analytics
- 使用 PageSpeed Insights 测试
- 检查 Core Web Vitals

### 紧急联系信息
- Cloudflare 支持: [support.cloudflare.com](https://support.cloudflare.com)
- 域名注册商支持
- API 服务提供商支持

## 📋 生产环境检查清单

### 部署前检查
- [ ] 所有环境变量已配置
- [ ] DNS 记录已设置
- [ ] SSL 证书已配置
- [ ] 安全头已启用
- [ ] 缓存规则已配置
- [ ] 监控工具已设置

### 部署后验证
- [ ] 网站可正常访问
- [ ] API 连接正常
- [ ] 搜索功能工作
- [ ] 视频播放正常
- [ ] 移动端适配良好
- [ ] SEO 标签正确

### 持续监控
- [ ] 正常运行时间 > 99.9%
- [ ] 页面加载时间 < 3s
- [ ] Core Web Vitals 达标
- [ ] 错误率 < 0.1%
- [ ] API 响应时间 < 500ms

---

**配置完成后，你的 JKAnime FLV 网站将拥有企业级的性能、安全性和可靠性！** 🚀