# JKAnime FLV

一个现代化的动漫流媒体网站，使用 Next.js 14 和 TypeScript 构建。JKAnime FLV 是专为动漫爱好者打造的在线观看平台。

## 🚀 功能特性

- **响应式设计**: 完美适配桌面端和移动端
- **动漫浏览**: 支持电影和系列动漫的分类浏览
- **高级搜索**: 按类型、语言、年份等多维度筛选
- **视频播放**: 集成多个播放源，支持高清播放
- **观看历史**: 自动记录用户观看进度
- **SEO 优化**: 完整的 SEO 支持，包括 sitemap 和 robots.txt

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: Vercel

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── anime/[id]/        # 动漫详情页
│   ├── watch/[episodeId]/ # 视频播放页
│   ├── generos/           # 类型页面
│   ├── series/            # 系列页面
│   ├── peliculas/         # 电影页面
│   ├── historial/         # 观看历史
│   ├── buscar/            # 搜索页面
│   ├── api/               # API 路由
│   └── ...                # 其他页面
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   ├── sections/         # 页面区块组件
│   ├── ui/               # UI 组件
│   └── pages/            # 页面级组件
├── lib/                  # 工具库
│   ├── api.ts           # API 客户端
│   ├── seo.ts           # SEO 工具
│   └── watch-history.ts # 观看历史管理
└── types/               # TypeScript 类型定义
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
USE_MOCK_API=false

# 其他配置...
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

生产环境将部署在 [https://jkanimeflv.com](https://jkanimeflv.com)

### 构建部署

```bash
npm run build
npm start
```

## 📖 API 文档

详细的 API 文档请参考 [ANIME_WEB_API.md](./ANIME_WEB_API.md)

## 🔍 SEO 优化

项目包含完整的 SEO 优化：

- 动态生成的 sitemap
- 自定义 robots.txt
- 页面级 meta 标签优化
- 结构化数据支持

详细信息请查看 [SEO_CHECKLIST.md](./SEO_CHECKLIST.md)

## 📱 页面说明

### 主要页面

- **首页** (`/`): 展示最新电影和系列
- **动漫详情** (`/anime/[id]`): 显示动漫详细信息和剧集列表
- **播放页面** (`/watch/[episodeId]`): 视频播放界面
- **类型页面** (`/generos`): 按类型浏览动漫
- **搜索页面** (`/buscar`): 搜索功能

### 功能页面

- **观看历史** (`/historial`): 用户观看记录
- **系列页面** (`/series`): 系列动漫列表
- **电影页面** (`/peliculas`): 电影列表

### 信息页面

- **关于我们** (`/acerca`)
- **联系我们** (`/contacto`) 
- **隐私政策** (`/privacidad`)
- **服务条款** (`/terminos`)

## 🎨 组件说明

### 布局组件
- `Header`: 顶部导航栏
- `Footer`: 底部信息栏

### UI 组件
- `AnimeCard`: 动漫卡片
- `VideoPlayer`: 视频播放器
- `SearchModal`: 搜索模态框
- `AnimeFilters`: 筛选器
- `Pagination`: 分页组件

### 功能组件
- `HomeContent`: 首页内容
- `AnimeList`: 动漫列表
- `WatchHistory`: 观看历史
- `Hero`: 英雄区块

## 🔧 开发指南

### 添加新页面

1. 在 `src/app` 目录下创建新的路由文件夹
2. 添加 `page.tsx` 文件
3. 可选：添加 `loading.tsx` 和 `error.tsx`

### 添加新组件

1. 在相应的组件目录下创建组件文件
2. 导出组件并添加 TypeScript 类型
3. 在需要的地方导入使用

### API 集成

1. 在 `src/lib/api.ts` 中添加新的 API 方法
2. 在 `src/types/anime.ts` 中定义相关类型
3. 在组件中使用 API 方法

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 这是一个演示项目，用于展示现代 Web 开发技术栈的使用。