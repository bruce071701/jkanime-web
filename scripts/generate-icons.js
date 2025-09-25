#!/usr/bin/env node

/**
 * JKAnime FLV 图标生成脚本
 * 
 * 这个脚本会生成网站所需的各种尺寸的图标文件
 * 需要安装 sharp 库: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('❌ 需要安装 sharp 库来生成图标');
  console.log('请运行: npm install sharp');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');

// 创建基础 SVG 内容
const createBaseSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#gradient)"/>
  <path d="M${size * 0.375} ${size * 0.3125}L${size * 0.703125} ${size * 0.5}L${size * 0.375} ${size * 0.6875}V${size * 0.3125}Z" fill="white"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E40AF"/>
      <stop offset="50%" style="stop-color:#3B82F6"/>
      <stop offset="100%" style="stop-color:#60A5FA"/>
    </linearGradient>
  </defs>
</svg>`;

// 需要生成的图标尺寸
const iconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('🎨 开始生成 JKAnime FLV 图标...');

  for (const icon of iconSizes) {
    try {
      const svgContent = createBaseSVG(icon.size);
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(Buffer.from(svgContent))
        .png()
        .toFile(outputPath);
      
      console.log(`✅ 生成 ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ 生成 ${icon.name} 失败:`, error.message);
    }
  }

  // 生成 favicon.ico
  try {
    const svgContent = createBaseSVG(32);
    const icoPath = path.join(publicDir, 'favicon.ico');
    
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(icoPath.replace('.ico', '.png'));
    
    // 重命名为 .ico (简化处理)
    fs.renameSync(icoPath.replace('.ico', '.png'), icoPath);
    console.log('✅ 生成 favicon.ico');
  } catch (error) {
    console.error('❌ 生成 favicon.ico 失败:', error.message);
  }

  console.log('🎉 图标生成完成！');
}

// 创建 manifest 图标信息
function updateManifest() {
  const manifestPath = path.join(__dirname, '..', 'src', 'app', 'manifest.ts');
  
  console.log('📝 更新 manifest.ts 图标配置...');
  
  const manifestContent = `import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JKAnime FLV - Ver Anime Online Gratis',
    short_name: 'JKAnime FLV',
    description: 'Ver anime online gratis en HD. JKAnime FLV - La mejor plataforma para disfrutar series y películas anime con subtítulos en español.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'video', 'anime'],
    lang: 'es',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}`;

  fs.writeFileSync(manifestPath, manifestContent);
  console.log('✅ manifest.ts 已更新');
}

// 运行生成器
if (require.main === module) {
  generateIcons()
    .then(() => {
      updateManifest();
      console.log('\n🚀 所有图标已生成完成！');
      console.log('📁 图标文件位置: public/');
      console.log('📱 manifest.ts 已更新');
    })
    .catch(error => {
      console.error('❌ 生成过程中出现错误:', error);
      process.exit(1);
    });
}

module.exports = { generateIcons, updateManifest };