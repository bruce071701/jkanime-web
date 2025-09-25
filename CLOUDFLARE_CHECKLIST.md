# Cloudflare Pages 部署检查清单

## 🚀 部署前检查

### 代码准备
- [ ] 所有代码已提交到 Git 仓库
- [ ] 构建脚本正常运行 (`npm run build`)
- [ ] 本地测试通过 (`npm run dev`)
- [ ] 环境变量配置正确

### 配置文件
- [ ] `next.config.js` 已优化
- [ ] `_headers` 文件已创建
- [ ] `_redirects` 文件已创建
- [ ] `wrangler.toml` 配置正确

## 🌐 Cloudflare Pages 设置

### 项目创建
- [ ] 在 Cloudflare Dashboard 中创建 Pages 项目
- [ ] 连接到 GitHub 仓库
- [ ] 设置构建配置：
  - Framework: Next.js
  - Build command: `npm run build`
  - Build output directory: `.next`

### 环境变量
- [ ] `NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com`
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://api.jkanime.net`
- [ ] `USE_MOCK_API=false`
- [ ] `NODE_ENV=production`
- [ ] `NEXT_TELEMETRY_DISABLED=1`

### 自定义域名
- [ ] 添加 `jkanimeflv.com` 域名
- [ ] 配置 DNS 记录
- [ ] 验证 SSL 证书

## 🔧 性能优化

### 缓存设置
- [ ] 静态资源缓存配置
- [ ] API 路由缓存策略
- [ ] 图片优化设置

### 安全配置
- [ ] 安全头配置
- [ ] HTTPS 重定向
- [ ] WAF 规则设置

## 📊 监控设置

### 分析工具
- [ ] Google Analytics 配置
- [ ] Cloudflare Analytics 启用
- [ ] 性能监控设置

### SEO 配置
- [ ] Google Search Console 验证
- [ ] Sitemap 提交
- [ ] Robots.txt 验证

## 🧪 测试验证

### 功能测试
- [ ] 首页加载正常
- [ ] 动漫详情页正常
- [ ] 搜索功能正常
- [ ] 播放页面正常
- [ ] 移动端适配正常

### 性能测试
- [ ] PageSpeed Insights 测试
- [ ] Core Web Vitals 检查
- [ ] 加载速度测试
- [ ] 移动端性能测试

### SEO 测试
- [ ] Meta 标签正确
- [ ] 结构化数据验证
- [ ] 社交媒体预览正常
- [ ] 搜索引擎索引正常

## 🚨 故障排除

### 常见问题
- [ ] 构建失败 → 检查 Node.js 版本和依赖
- [ ] 图片不显示 → 验证图片 URL 和配置
- [ ] API 调用失败 → 检查 CORS 和环境变量
- [ ] 路由问题 → 验证 Next.js 路由配置

### 调试工具
- [ ] Cloudflare 日志查看
- [ ] 浏览器开发者工具
- [ ] Network 面板检查
- [ ] Console 错误日志

## ✅ 部署完成验证

### 基本功能
- [ ] 网站可以正常访问
- [ ] 所有页面加载正常
- [ ] 搜索功能工作正常
- [ ] 移动端体验良好

### 性能指标
- [ ] 首屏加载时间 < 3s
- [ ] Lighthouse 分数 > 90
- [ ] Core Web Vitals 通过
- [ ] 缓存命中率 > 80%

### SEO 验证
- [ ] Google 可以索引网站
- [ ] Meta 标签显示正确
- [ ] 社交媒体分享正常
- [ ] 结构化数据无错误

---

**完成所有检查项后，你的 JKAnime FLV 网站就可以成功部署到 Cloudflare Pages 了！** 🎉