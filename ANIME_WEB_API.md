# 动漫网站接口文档

## 概述
这是一套全新的动漫网站接口，基于现有的 `mx_animes`、`mx_episodes`、`mx_players` 数据表设计，不会影响现有的接口服务。

## 接口列表

### 1. 健康检查
- **URL**: `GET /api/v1/test/health`
- **描述**: 检查接口服务是否正常运行
- **响应**: `"Anime Web API is running!"`

### 2. 首页接口
- **URL**: `GET /api/v1/anime/home`
- **描述**: 获取首页数据，包含最新电影和最新系列
- **缓存**: 30分钟

### 3. 动漫详情接口
- **URL**: `GET /api/v1/anime/detail/{animeId}`
- **描述**: 获取指定动漫的详细信息和剧集列表
- **参数**: 
  - `animeId`: 动漫ID
- **缓存**: 1小时

### 4. 播放页面接口
- **URL**: `GET /api/v1/anime/play/{episodeId}`
- **描述**: 获取指定剧集的播放信息
- **参数**: 
  - `episodeId`: 剧集ID
- **缓存**: 15分钟

### 5. 动漫列表接口
- **URL**: `GET /api/v1/anime/list`
- **描述**: 分页查询动漫列表，支持多种筛选和排序
- **参数**: 
  - `page`: 页码，默认1
  - `size`: 每页数量，默认20，最大100
  - `type`: 类型筛选（movie/series），可选
  - `status`: 状态筛选（ongoing/completed），可选
  - `genre`: 类型筛选，可选
  - `sort`: 排序方式（latest/popular/rating），默认latest
  - `keyword`: 搜索关键词，可选
- **缓存**: 10分钟

### 6. 动漫类型接口
- **URL**: `GET /api/v1/anime/genres`
- **描述**: 获取所有动漫类型及其数量统计
- **缓存**: 30分钟

### 7. 搜索接口
- **URL**: `GET /api/v1/anime/search`
- **描述**: 搜索动漫
- **参数**: 
  - `q`: 搜索关键词（必填）
  - `page`: 页码，默认1
  - `size`: 每页数量，默认20

## 响应格式
所有接口都使用统一的响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1640995200000
}
```

## 错误码
- `200`: 成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## 技术实现
- **控制器**: `AnimeWebController`
- **服务层**: `AnimeWebService` 和 `AnimeWebServiceImpl`
- **数据访问**: `AnimeWebMapper` 和对应的XML映射文件
- **缓存**: 使用Caffeine缓存，不同接口有不同的缓存时间
- **数据表**: 基于现有的 `mx_animes`、`mx_episodes`、`mx_players` 表

## 部署说明
1. 确保数据库连接正常
2. 确保现有的缓存配置正常工作
3. 新接口使用独立的路径 `/api/v1/anime/*`，不会与现有接口冲突
4. 可以通过 `/api/v1/test/health` 接口检查服务状态

## 注意事项
- 新接口完全独立，不会影响现有的接口服务
- 使用了现有的缓存配置和工具类
- 所有查询都基于现有的数据表结构
- 支持分页、搜索、筛选等功能
- 响应数据格式针对前端展示进行了优化