# 页面错误诊断

## 🐛 问题描述
- 首页正常工作
- 其他页面（动漫详情、播放页面、系列页面等）出现 500 Internal Server Error

## 🔍 可能的原因

### 1. API路由问题
API路由使用了 `edge` runtime，可能在Cloudflare Pages环境中有兼容性问题：

```typescript
export const runtime = 'edge';
```

### 2. 数据获取问题
页面在服务端渲染时调用API可能失败：
- `apiClient.getAnimeDetail()` 
- `apiClient.getEpisodePlay()`
- `apiClient.getAnimeList()`

### 3. 环境变量问题
生产环境中的环境变量可能没有正确设置。

## 🔧 诊断步骤

### 步骤1: 检查API路由是否工作
测试直接访问API路由：
- `/api/anime/home` - 应该返回JSON数据
- `/api/anime/list` - 应该返回动漫列表
- `/api/anime/detail/3496` - 应该返回动漫详情

### 步骤2: 检查环境变量
确认生产环境中的环境变量：
```
NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
USE_MOCK_API=false
NODE_ENV=production
```

### 步骤3: 检查Edge Runtime兼容性
Edge Runtime可能不支持某些Node.js API或第三方库。

## 🚀 修复方案

### 方案1: 移除Edge Runtime
将所有API路由的runtime改为默认的Node.js runtime：

```typescript
// 移除这行
// export const runtime = 'edge';
```

### 方案2: 简化API调用
直接在组件中调用外部API，不通过Next.js API路由：

```typescript
// 直接调用
const response = await fetch('https://api-jk.funnyu.xyz/api/v1/anime/detail/3496');
```

### 方案3: 添加错误处理和降级
为所有API调用添加更好的错误处理和fallback。

## 📝 下一步行动
1. 测试API路由是否正常工作
2. 如果API路由有问题，移除edge runtime
3. 添加更详细的错误日志
4. 实现客户端渲染作为备选方案