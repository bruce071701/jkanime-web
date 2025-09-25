# 🌐 Cloudflare Pages 部署指南

## 📋 部署步骤

### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "Configure Cloudflare Pages deployment"
git push origin main
```

### 2. 在 Cloudflare Pages 中配置项目

#### 访问 Cloudflare Pages 控制台
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Pages" 
3. 点击 "Create a project"

#### 连接 GitHub 仓库
1. 选择 "Connect to Git"
2. 选择你的 GitHub 仓库：`jkanime-web`
3. 点击 "Begin setup"

#### 配置构建设置
```
项目名称: jkanimeflv
生产分支: main
构建命令: npm run build:cloudflare
构建输出目录: .next
根目录: /
```

#### 环境变量设置
在 "Environment variables" 部分添加：
```
NODE_ENV = production
NEXT_PUBLIC_SITE_URL = https://jkanimeflv.com
NEXT_PUBLIC_API_BASE_URL = https://api-jk.funnyu.xyz
USE_MOCK_API = false
```

### 3. 部署项目
1. 点击 "Save and Deploy"
2. 等待构建完成（约 2-5 分钟）
3. 构建成功后会提供一个 `.pages.dev` 域名

## 🔧 配置文件说明

### wrangler.toml
- 包含 Cloudflare Pages 的基本配置
- 定义了构建命令和输出目录
- 设置了环境变量

### functions/_middleware.js
- 处理 Next.js 路由在 Cloudflare Pages 上的兼容性
- 确保客户端路由正常工作

### scripts/build-cloudflare.js
- 专门为 Cloudflare Pages 优化的构建脚本
- 自动配置生产环境变量
- 创建必要的配置文件

## 🚀 部署后验证

### 检查网站功能
1. **首页加载** - 访问主域名
2. **API 连接** - 检查动漫列表是否加载
3. **路由导航** - 测试页面间跳转
4. **搜索功能** - 验证搜索是否工作

### 常见问题解决

#### 1. 网站显示 404
- 检查构建输出目录是否正确设置为 `.next`
- 确认 `functions/_middleware.js` 文件存在

#### 2. API 请求失败
- 验证环境变量 `NEXT_PUBLIC_API_BASE_URL` 设置正确
- 检查 API 服务器 `https://api-jk.funnyu.xyz` 是否可访问

#### 3. 静态资源加载失败
- 确认 `_headers` 和 `_redirects` 文件在 `.next` 目录中
- 检查 Cloudflare Pages 的缓存设置

## 📊 性能优化

### 缓存策略
- 静态资源：1 年缓存
- API 响应：无缓存
- HTML 页面：智能缓存

### CDN 配置
Cloudflare Pages 自动提供：
- 全球 CDN 分发
- 自动 HTTPS
- HTTP/2 支持
- Brotli 压缩

## 🔄 更新部署

### 自动部署
每次推送到 `main` 分支时，Cloudflare Pages 会自动：
1. 拉取最新代码
2. 运行 `npm run build:cloudflare`
3. 部署到生产环境

### 手动部署
在 Cloudflare Pages 控制台中：
1. 进入项目页面
2. 点击 "Create deployment"
3. 选择分支并部署

## 📝 监控和日志

### 构建日志
- 在 Cloudflare Pages 控制台查看构建过程
- 检查是否有构建错误或警告

### 访问日志
- 使用 Cloudflare Analytics 监控访问情况
- 设置 Real User Monitoring (RUM)

### 错误监控
- 配置 Cloudflare Web Analytics
- 设置错误告警

## 🎯 下一步

1. **自定义域名** - 配置 `jkanimeflv.com` 域名
2. **SSL 证书** - Cloudflare 自动提供
3. **性能优化** - 启用更多 Cloudflare 功能
4. **监控设置** - 配置告警和分析

## 📞 支持

如果遇到问题：
1. 检查 Cloudflare Pages 文档
2. 查看构建日志
3. 验证环境变量配置
4. 测试 API 连接性