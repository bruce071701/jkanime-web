# 部署指南

## 部署选项

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 自动部署

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 上导入项目
3. 配置环境变量
4. 自动部署完成

#### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

#### 环境变量配置

在 Vercel 控制台中设置：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net
USE_MOCK_API=false
```

### 2. Netlify 部署

#### 构建设置

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 环境变量

在 Netlify 控制台的 Site settings > Environment variables 中配置。

### 3. Docker 部署

#### Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'
services:
  jkanime-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net
      - USE_MOCK_API=false
    restart: unless-stopped
```

#### 构建和运行

```bash
# 构建镜像
docker build -t jkanime-web .

# 运行容器
docker run -p 3000:3000 jkanime-web

# 使用 docker-compose
docker-compose up -d
```

### 4. 传统服务器部署

#### 准备服务器

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

#### 部署脚本

```bash
#!/bin/bash
# deploy.sh

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci

# 构建项目
npm run build

# 重启应用
pm2 restart jkanime-web || pm2 start npm --name "jkanime-web" -- start
```

#### PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'jkanime-web',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_BASE_URL: 'https://api.jkanime.net',
      USE_MOCK_API: 'false'
    }
  }]
};
```

## 性能优化

### 构建优化

#### next.config.js 配置

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    appDir: true,
  },
  
  // 图片优化
  images: {
    domains: ['image.tmdb.org', 'api.jkanime.net'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 压缩
  compress: true,
  
  // 静态导出（如果需要）
  output: 'export',
  trailingSlash: true,
  
  // 分析包大小
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### CDN 配置

#### Cloudflare 设置

1. **缓存规则**:
   - 静态资源: 缓存 1 年
   - API 响应: 缓存 5 分钟
   - HTML 页面: 缓存 1 小时

2. **压缩设置**:
   - 启用 Gzip/Brotli 压缩
   - 启用 Rocket Loader

3. **安全设置**:
   - 启用 SSL/TLS
   - 配置安全头

### 监控和分析

#### 性能监控

```javascript
// 添加到 _app.tsx 或 layout.tsx
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // 发送到分析服务
    console.log(metric);
  }
}
```

#### 错误追踪

```javascript
// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 发送错误到监控服务
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 环境管理

### 多环境配置

```env
# .env.local (开发环境)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
USE_MOCK_API=true
NODE_ENV=development

# .env.staging (测试环境)
NEXT_PUBLIC_API_BASE_URL=https://staging-api.jkanime.net
USE_MOCK_API=false
NODE_ENV=production

# .env.production (生产环境)
NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net
USE_MOCK_API=false
NODE_ENV=production
```

### 构建脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:staging": "env-cmd -f .env.staging next build",
    "build:production": "env-cmd -f .env.production next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true next build"
  }
}
```

## CI/CD 流程

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

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
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 部署检查清单

- [ ] 环境变量配置正确
- [ ] 构建成功无错误
- [ ] 所有测试通过
- [ ] 性能指标达标
- [ ] SEO 配置完整
- [ ] 安全头设置
- [ ] 错误监控配置
- [ ] 备份策略制定

## 故障排除

### 常见部署问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装
   - 检查环境变量

2. **运行时错误**
   - 检查 API 连接
   - 验证环境变量
   - 查看服务器日志

3. **性能问题**
   - 启用压缩
   - 优化图片
   - 配置 CDN

### 回滚策略

```bash
# Vercel 回滚
vercel rollback [deployment-url]

# PM2 回滚
pm2 stop jkanime-web
git checkout [previous-commit]
npm run build
pm2 start jkanime-web
```

## 安全考虑

### 安全头配置

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 环境变量安全

- 敏感信息使用服务器端环境变量
- 客户端变量使用 `NEXT_PUBLIC_` 前缀
- 定期轮换 API 密钥
- 使用密钥管理服务