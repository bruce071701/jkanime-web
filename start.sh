#!/bin/bash

echo "🚀 启动 AnimeES 项目"
echo "===================="

# 检查 Node.js 版本
echo "📋 检查环境..."
node --version
npm --version

# 检查 API 服务器
echo "🔍 检查 API 服务器..."
if curl -s http://localhost:8080/api/v1/test/health > /dev/null; then
    echo "✅ API 服务器运行正常 (http://localhost:8080)"
else
    echo "❌ API 服务器未运行，请先启动后端服务"
    echo "   确保 http://localhost:8080 可访问"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动前端开发服务器..."
echo "   前端地址: http://localhost:3000"
echo "   API地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev