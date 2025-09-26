# Cloudflare Pages 部署设置指南

## 🚨 当前问题
GitHub Actions部署失败，错误：`Input required and not supplied: apiToken`

## ✅ 推荐解决方案：使用Cloudflare Pages Git集成

### 方法1：直接Git集成（推荐）

1. **登录Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 Pages 部分

2. **创建新项目**
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 连接你的GitHub仓库

3. **配置构建设置**
   ```
   Framework preset: Next.js
   Build command: npm run build:cloudflare
   Build output directory: .vercel/output/static
   Root directory: (留空)
   ```

4. **环境变量设置**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://jkanimeflv.com
   NEXT_PUBLIC_API_BASE_URL=https://api-jk.funnyu.xyz
   USE_MOCK_API=false
   ```

5. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare会自动构建和部署

### 方法2：修复GitHub Actions（如果需要）

如果你想继续使用GitHub Actions，需要设置以下Secrets：

1. **获取Cloudflare API Token**
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 创建自定义Token，权限：
     - Zone:Zone Settings:Read
     - Zone:Zone:Read
     - Account:Cloudflare Pages:Edit

2. **获取Account ID**
   - 在Cloudflare Dashboard右侧边栏找到Account ID

3. **在GitHub仓库设置Secrets**
   - 进入仓库 Settings > Secrets and variables > Actions
   - 添加以下Secrets：
     - `CLOUDFLARE_API_TOKEN`: 你的API Token
     - `CLOUDFLARE_ACCOUNT_ID`: 你的Account ID

## 🎯 当前构建配置

我们的项目已经配置好了正确的构建命令：

```json
{
  "scripts": {
    "build:cloudflare": "next build && npx @cloudflare/next-on-pages"
  }
}
```

构建输出目录：`.vercel/output/static`

## 📝 推荐步骤

1. **暂时禁用GitHub Actions**
   - 可以重命名 `.github/workflows/deploy-cloudflare.yml` 为 `.github/workflows/deploy-cloudflare.yml.disabled`

2. **使用Cloudflare Pages Git集成**
   - 这是最简单和可靠的方式
   - 每次推送到main分支都会自动部署
   - 不需要配置API Token

3. **测试部署**
   - 推送代码到main分支
   - 在Cloudflare Dashboard中查看构建状态

## 🔧 如果构建失败

如果在Cloudflare Pages中构建失败，检查：

1. **Node.js版本**
   - 确保使用Node.js 18或更高版本

2. **构建命令**
   - 确保使用 `npm run build:cloudflare`

3. **环境变量**
   - 确保所有必需的环境变量都已设置

4. **依赖项**
   - 确保package.json中包含所有必需的依赖

现在推荐使用方法1（Git集成）来部署，这样更简单可靠！