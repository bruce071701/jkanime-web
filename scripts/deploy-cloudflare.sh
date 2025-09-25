#!/bin/bash

# JKAnime FLV - Cloudflare Pages 部署脚本

echo "🚀 开始部署 JKAnime FLV 到 Cloudflare Pages..."

# 检查环境
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 错误: 请设置 CLOUDFLARE_API_TOKEN 环境变量"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
npx wrangler pages deploy out --project-name=jkanimeflv

if [ $? -eq 0 ]; then
    echo "🎉 部署成功！"
    echo "🔗 网站地址: https://jkanimeflv.pages.dev"
else
    echo "❌ 部署失败"
    exit 1
fi