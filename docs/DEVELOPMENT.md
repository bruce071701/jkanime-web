# 开发指南

## 项目架构

### 技术选型说明

- **Next.js 14**: 使用最新的 App Router，提供更好的性能和开发体验
- **TypeScript**: 提供类型安全，减少运行时错误
- **Tailwind CSS**: 实用优先的 CSS 框架，快速构建响应式界面
- **Lucide React**: 现代化的图标库

### 目录结构详解

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (routes)/          # 路由组织
│   ├── api/               # API 路由处理
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── loading.tsx        # 全局加载组件
│   ├── not-found.tsx      # 404 页面
│   ├── manifest.ts        # PWA 清单
│   ├── robots.ts          # 搜索引擎爬虫规则
│   └── sitemap.ts         # 站点地图
├── components/            # 可复用组件
│   ├── layout/           # 布局相关组件
│   │   ├── Header.tsx    # 顶部导航
│   │   └── Footer.tsx    # 底部信息
│   ├── sections/         # 页面区块组件
│   │   ├── Hero.tsx      # 英雄区块
│   │   ├── HomeContent.tsx # 首页内容
│   │   ├── AnimeList.tsx # 动漫列表
│   │   └── WatchHistory.tsx # 观看历史
│   ├── ui/               # 基础 UI 组件
│   │   ├── AnimeCard.tsx # 动漫卡片
│   │   ├── VideoPlayer.tsx # 视频播放器
│   │   ├── SearchModal.tsx # 搜索模态框
│   │   ├── AnimeFilters.tsx # 筛选器
│   │   ├── Pagination.tsx # 分页
│   │   ├── PlayerTabs.tsx # 播放器标签
│   │   ├── PlayerSelector.tsx # 播放器选择
│   │   ├── Breadcrumbs.tsx # 面包屑导航
│   │   └── AnimeListSkeleton.tsx # 加载骨架
│   └── pages/            # 页面级组件
│       └── WatchPageClient.tsx # 观看页客户端组件
├── lib/                  # 工具库和配置
│   ├── api.ts           # API 客户端封装
│   ├── mock-api.ts      # 模拟 API 数据
│   ├── seo.ts           # SEO 工具函数
│   └── watch-history.ts # 观看历史管理
├── types/               # TypeScript 类型定义
│   └── anime.ts         # 动漫相关类型
└── styles/              # 样式文件（如需要）
```

## 开发规范

### 代码风格

1. **组件命名**: 使用 PascalCase
2. **文件命名**: 组件文件使用 PascalCase，工具文件使用 kebab-case
3. **变量命名**: 使用 camelCase
4. **常量命名**: 使用 UPPER_SNAKE_CASE

### 组件开发规范

```typescript
// 组件示例
interface ComponentProps {
  title: string;
  optional?: boolean;
}

export default function Component({ title, optional = false }: ComponentProps) {
  return (
    <div className="component-container">
      <h1>{title}</h1>
      {optional && <p>Optional content</p>}
    </div>
  );
}
```

### API 开发规范

```typescript
// API 方法示例
async function getAnimeList(params: AnimeListParams): Promise<AnimeListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/anime/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## 状态管理

项目使用 React 内置的状态管理：

- **useState**: 组件内部状态
- **useEffect**: 副作用处理
- **useContext**: 跨组件状态共享（如需要）

### 本地存储

观看历史使用 localStorage 进行持久化：

```typescript
// 观看历史管理示例
export const watchHistoryManager = {
  add: (item: WatchHistoryItem) => {
    const history = getWatchHistory();
    const updated = [item, ...history.filter(h => h.episodeId !== item.episodeId)];
    localStorage.setItem('watchHistory', JSON.stringify(updated.slice(0, 50)));
  },
  
  get: (): WatchHistoryItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('watchHistory');
    return stored ? JSON.parse(stored) : [];
  }
};
```

## 性能优化

### 图片优化

使用 Next.js Image 组件：

```typescript
import Image from 'next/image';

<Image
  src={anime.poster}
  alt={anime.title}
  width={300}
  height={450}
  className="rounded-lg"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 代码分割

- 使用动态导入进行代码分割
- 懒加载非关键组件

```typescript
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/ui/VideoPlayer'), {
  loading: () => <div>Loading player...</div>,
  ssr: false
});
```

### 缓存策略

- API 响应缓存
- 静态资源缓存
- 页面级缓存

## 测试策略

### 单元测试

使用 Jest 和 React Testing Library：

```typescript
import { render, screen } from '@testing-library/react';
import AnimeCard from '@/components/ui/AnimeCard';

test('renders anime card with title', () => {
  const anime = { id: 1, title: 'Test Anime', poster: '/test.jpg' };
  render(<AnimeCard anime={anime} />);
  expect(screen.getByText('Test Anime')).toBeInTheDocument();
});
```

### 集成测试

测试组件间的交互和 API 集成。

### E2E 测试

使用 Playwright 进行端到端测试。

## 部署指南

### 环境变量

```env
# 生产环境
NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net
USE_MOCK_API=false

# 开发环境
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
USE_MOCK_API=true
```

### 构建优化

```bash
# 分析包大小
npm run build
npm run analyze

# 性能检查
npm run lighthouse
```

### 部署流程

1. **代码检查**: ESLint + Prettier
2. **类型检查**: TypeScript 编译
3. **测试**: 运行所有测试
4. **构建**: 生产环境构建
5. **部署**: 自动部署到 Vercel

## 调试技巧

### 开发工具

1. **React Developer Tools**: 组件调试
2. **Next.js DevTools**: 性能分析
3. **Network Tab**: API 请求调试

### 常见问题

1. **Hydration 错误**: 确保服务端和客户端渲染一致
2. **API 超时**: 检查网络连接和 API 状态
3. **样式问题**: 检查 Tailwind 类名和响应式设计

### 日志记录

```typescript
// 开发环境日志
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// 生产环境错误追踪
try {
  // 业务逻辑
} catch (error) {
  console.error('Error:', error);
  // 发送到错误追踪服务
}
```

## 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 提交规范

使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```