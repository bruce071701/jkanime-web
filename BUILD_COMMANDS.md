# 🚀 JKAnime FLV 构建命令指南

## 📋 可用的构建命令

### 🌐 生产环境构建
```bash
npm run build:prod
```
**配置**:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com`
- `NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz`
- `USE_MOCK_API=false`
- `NEXT_TELEMETRY_DISABLED=1`

**用途**: Cloudflare Pages 部署、生产环境构建

### 🔧 开发环境构建
```bash
npm run build:dev
```
**配置**:
- `NODE_ENV=development`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
- `USE_MOCK_API=false`

**用途**: 本地开发环境构建，需要本地 API 服务器

### 🎭 Mock API 构建
```bash
npm run build:mock
```
**配置**:
- `NODE_ENV=development`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `USE_MOCK_API=true`

**用途**: 离线开发，使用模拟数据

### 📊 分析构建
```bash
npm run analyze
```
**用途**: 分析打包大小和性能

### 👀 预览构建
```bash
npm run preview
```
**用途**: 构建生产版本并本地预览

## 🎯 使用场景

### 本地开发
```bash
# 启动开发服务器
npm run dev

# 如果需要构建测试
npm run build:dev    # 使用本地 API
# 或
npm run build:mock   # 使用 Mock API
```

### 生产部署
```bash
# 构建生产版本
npm run build:prod

# 启动生产服务器
npm run start:prod
```

### Cloudflare Pages 部署
Cloudflare Pages 会自动使用环境变量，但你也可以在本地测试：
```bash
npm run build:prod
```

### 性能分析
```bash
npm run analyze
```

## 🔍 环境变量优先级

1. **命令行参数** (最高优先级)
   - `npm run build:prod` 中设置的变量

2. **环境变量文件**
   - `.env.local` (本地开发)
   - `.env.production` (生产环境)
   - `.env` (通用)

3. **代码默认值** (最低优先级)
   - `https://api-jk.funnyu.xyz`

## 📝 自定义构建

如果需要自定义配置，可以直接使用 `cross-env`:

```bash
# 自定义 API URL
cross-env NEXT_PUBLIC_API_BASE_URL=https://your-api.com next build

# 使用不同的网站 URL
cross-env NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build:prod
```

## 🔧 故障排除

### 检查当前环境配置
```bash
npm run env:check
```

### 测试 API 连接
```bash
npm run test:api
```

### 健康检查
```bash
npm run health:check
```

## 💡 最佳实践

1. **本地开发**: 使用 `npm run dev`
2. **本地测试构建**: 使用 `npm run build:mock` (无需 API 服务器)
3. **生产构建**: 使用 `npm run build:prod`
4. **部署前检查**: 使用 `npm run preview`

## 🚀 CI/CD 集成

### GitHub Actions
```yaml
- name: Build for production
  run: npm run build:prod
```

### Cloudflare Pages
构建命令设置为: `npm run build:prod`

---

**现在你可以通过简单的命令直接构建不同环境的版本！** 🎉