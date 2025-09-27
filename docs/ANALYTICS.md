# Google Analytics 集成文档

## 概述

JKAnime网站已完全集成Google Analytics (GA4)，用于跟踪用户行为、网站性能和业务指标。

## 配置信息

- **测量ID**: `G-F3G0RXE6RW`
- **环境**: 仅在生产环境启用
- **调试**: 开发环境启用调试模式

## 跟踪的事件

### 1. 页面浏览 (Page Views)
- **事件**: `page_view`
- **触发**: 每次路由变化
- **参数**: 
  - `page_path`: 页面路径
  - `page_title`: 页面标题

### 2. 搜索事件 (Search Events)
- **事件**: `search`
- **触发**: 用户执行搜索
- **参数**:
  - `search_term`: 搜索关键词
  - `search_results_count`: 搜索结果数量

### 3. 动漫查看 (Anime Views)
- **事件**: `anime_view`
- **触发**: 用户点击动漫卡片
- **参数**:
  - `content_id`: 动漫ID
  - `item_name`: 动漫名称
  - `item_category`: 动漫类型 (series/movie)
  - `source`: 来源页面

### 4. 剧集播放 (Episode Play)
- **事件**: `episode_play`
- **触发**: 用户开始播放剧集
- **参数**:
  - `anime_id`: 动漫ID
  - `anime_name`: 动漫名称
  - `episode_id`: 剧集ID
  - `episode_number`: 剧集编号
  - `video_server`: 视频服务器

### 5. 筛选使用 (Filter Usage)
- **事件**: `filter_use`
- **触发**: 用户使用筛选器
- **参数**:
  - `filter_type`: 筛选类型 (genre/language/sort)
  - `filter_value`: 筛选值
  - `page_location`: 页面位置

### 6. 分类浏览 (Genre Browsing)
- **事件**: `genre_browse`
- **触发**: 用户浏览特定分类
- **参数**:
  - `item_list_name`: 分类名称
  - `content_type`: 内容类型
  - `category`: 分类

### 7. 用户参与度 (User Engagement)
- **事件**: 各种参与度事件
- **触发**: 用户交互行为
- **常见事件**:
  - `video_loaded`: 视频加载成功
  - `video_error`: 视频加载失败
  - `hero_cta_click`: 首页CTA点击
  - `section_view_all_click`: 查看全部点击
  - `pagination_click`: 分页点击
  - `home_content_loaded`: 首页内容加载

### 8. 错误跟踪 (Error Tracking)
- **事件**: `exception`
- **触发**: 应用错误或异常
- **参数**:
  - `error_message`: 错误信息
  - `fatal`: 是否致命错误
  - `error_page`: 错误页面

### 9. 转换事件 (Conversion Events)
- **事件**: `conversion`
- **触发**: 重要用户操作
- **参数**:
  - `action`: 转换动作
  - `value`: 转换值

## 文件结构

```
src/
├── config/
│   └── analytics.ts          # Analytics配置
├── utils/
│   ├── analytics.ts          # Analytics工具函数
│   └── __tests__/
│       └── analytics.test.ts # Analytics测试
├── components/
│   ├── AnalyticsProvider.tsx # Analytics上下文提供者
│   └── AnalyticsDashboard.tsx # 开发环境Analytics仪表板
└── docs/
    └── ANALYTICS.md          # 本文档
```

## 开发工具

### Analytics Dashboard
在开发环境中，右下角会显示一个Analytics仪表板按钮，点击可以查看实时的Analytics事件。

### 调试模式
开发环境下，所有Analytics事件都会在控制台输出，格式为：
```
[Analytics] event_name { parameter: value }
```

## 测试

运行Analytics测试：
```bash
npm run test src/utils/__tests__/analytics.test.ts
```

## 配置管理

### 环境变量
- `PROD`: 生产环境标识，控制Analytics是否启用
- `DEV`: 开发环境标识，控制调试模式

### 配置文件
`src/config/analytics.ts` 包含所有Analytics配置：
- 测量ID
- 事件名称
- 参数名称
- 转换事件定义

## 最佳实践

1. **事件命名**: 使用清晰、一致的事件名称
2. **参数标准化**: 使用配置文件中定义的参数名称
3. **性能考虑**: 避免过度跟踪，只跟踪有价值的事件
4. **隐私保护**: 不跟踪个人敏感信息
5. **测试覆盖**: 为所有Analytics函数编写测试

## 数据分析

### 关键指标
- **页面浏览量**: 网站流量
- **搜索使用率**: 用户搜索行为
- **动漫观看率**: 内容受欢迎程度
- **筛选使用率**: 用户发现内容的方式
- **错误率**: 网站稳定性

### 报告建议
1. 每周查看流量报告
2. 监控搜索关键词趋势
3. 分析最受欢迎的动漫内容
4. 跟踪用户转换漏斗
5. 监控错误率和性能指标

## 故障排除

### 常见问题
1. **事件未发送**: 检查GA是否正确加载
2. **调试信息不显示**: 确认开发环境设置
3. **测试失败**: 检查mock设置和环境变量

### 检查清单
- [ ] GA脚本已加载
- [ ] 测量ID正确
- [ ] 环境变量设置正确
- [ ] 事件参数符合GA4规范
- [ ] 测试覆盖率充足

## 更新日志

### v1.0.0 (2024-12-27)
- 初始Google Analytics集成
- 完整事件跟踪系统
- 开发工具和测试套件
- 配置管理系统