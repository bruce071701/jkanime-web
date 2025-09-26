# API 硬编码域名修复总结

## ✅ 已完成的修复

### 1. 客户端API调用 (src/lib/api.ts)
所有方法都直接使用硬编码域名 `https://api-jk.funnyu.xyz`：
- `getHomeData()` - 首页数据
- `getAnimeDetail()` - 动漫详情
- `getEpisodePlay()` - 播放信息
- `getAnimeList()` - 动漫列表
- `getGenres()` - 类型列表
- `searchAnime()` - 搜索功能

### 2. 组件直接调用 (已修复)
- `src/components/sections/HomeContent.tsx` - 直接调用 `https://api-jk.funnyu.xyz/api/v1/anime/home`
- `src/components/sections/AnimeList.tsx` - 直接调用 `https://api-jk.funnyu.xyz/api/v1/anime/list`

### 3. API 路由代理 (使用环境变量)
所有 API 路由都使用 `API_BASE_URL` 环境变量，默认值为 `https://api-jk.funnyu.xyz`：
- `src/app/api/anime/home/route.ts`
- `src/app/api/anime/list/route.ts`
- `src/app/api/anime/detail/[animeId]/route.ts`
- `src/app/api/anime/play/[episodeId]/route.ts`
- `src/app/api/anime/genres/route.ts`

## 🔧 配置文件

### 环境变量配置
```env
# 生产环境
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
USE_MOCK_API=false
NODE_ENV=production
```

### 部署配置
- `wrangler.toml` - Cloudflare 部署配置
- `.env.production` - 生产环境变量
- `.github/workflows/deploy-cloudflare.yml` - CI/CD 配置

## 🚫 已移除的相对路径

不再使用以下相对路径模式：
- ❌ `/api/anime/*`
- ❌ `${baseUrl}/api/*`
- ❌ `window.location.origin + '/api/*'`

## ✅ 当前API调用模式

### 直接硬编码调用
```typescript
// 客户端组件
const response = await fetch('https://api-jk.funnyu.xyz/api/v1/anime/home');
```

### 环境变量 + 硬编码默认值
```typescript
// API 路由
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';
const response = await fetch(`${API_BASE_URL}/api/v1/anime/home`);
```

## 🎯 验证方法

### 1. 检查网络请求
在浏览器开发者工具中验证所有API请求都指向 `https://api-jk.funnyu.xyz`

### 2. 测试脚本
```bash
npm run test:api
```

### 3. 生产环境验证
```bash
curl https://jkanimeflv.com
# 检查页面是否正常加载数据
```

## 📝 注意事项

1. **完全移除相对路径** - 所有API调用现在都使用绝对URL
2. **环境变量备份** - API路由仍使用环境变量，但有硬编码默认值
3. **客户端直接调用** - 组件直接调用生产API，不经过Next.js API路由
4. **缓存策略** - 保持原有的缓存配置

## 🚀 部署状态

- ✅ 生产环境: `https://jkanimeflv.com`
- ✅ API服务器: `https://api-jk.funnyu.xyz`
- ✅ 所有API调用都使用硬编码域名
- ✅ 不依赖相对路径或动态URL构建

现在生产环境应该能够正确调用API并显示数据！