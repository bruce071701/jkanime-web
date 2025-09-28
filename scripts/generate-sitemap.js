#!/usr/bin/env node

/**
 * 动态生成sitemap.xml的脚本
 * 可以在构建时运行以包含最新的动漫数据
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://api-jk.funnyu.xyz';
const SITE_BASE_URL = 'https://jkanimeflv.com';

async function fetchAnimeData() {
  try {
    console.log('Fetching anime data for sitemap...');
    
    // 获取最新电影
    const moviesResponse = await fetch(`${API_BASE_URL}/api/v1/anime/list?type=movie&page=1&size=20&sort=latest`);
    const moviesData = await moviesResponse.json();
    
    // 获取最新系列
    const seriesResponse = await fetch(`${API_BASE_URL}/api/v1/anime/list?type=Serie&page=1&size=20&sort=latest`);
    const seriesData = await seriesResponse.json();
    
    // 获取分类
    const genresResponse = await fetch(`${API_BASE_URL}/api/v1/anime/genres`);
    const genresData = await genresResponse.json();
    
    return {
      movies: moviesData.data?.list || [],
      series: seriesData.data?.list || [],
      genres: genresData.data?.genres || []
    };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    return { movies: [], series: [], genres: [] };
  }
}

function generateSitemapXML(data) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Página principal -->
  <url>
    <loc>${SITE_BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Páginas principales -->
  <url>
    <loc>${SITE_BASE_URL}/peliculas</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_BASE_URL}/series</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_BASE_URL}/generos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_BASE_URL}/buscar</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  // 添加分类页面
  data.genres.slice(0, 15).forEach(genre => {
    xml += `
  <url>
    <loc>${SITE_BASE_URL}/generos?genre=${encodeURIComponent(genre.name)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${genre.count > 500 ? '0.8' : '0.7'}</priority>
  </url>`;
  });

  // 添加最新电影
  data.movies.forEach(anime => {
    xml += `
  <url>
    <loc>${SITE_BASE_URL}/anime/${anime.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // 添加最新系列
  data.series.forEach(anime => {
    xml += `
  <url>
    <loc>${SITE_BASE_URL}/anime/${anime.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // 添加语言筛选页面
  const languages = ['latino', 'castellano', 'sub'];
  const types = ['peliculas', 'series'];
  
  types.forEach(type => {
    languages.forEach(lang => {
      xml += `
  <url>
    <loc>${SITE_BASE_URL}/${type}?lang=${lang}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  });

  // 添加排序页面
  const sortOptions = ['popular', 'rating'];
  types.forEach(type => {
    sortOptions.forEach(sort => {
      xml += `
  <url>
    <loc>${SITE_BASE_URL}/${type}?sort=${sort}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  });

  xml += `
</urlset>`;

  return xml;
}

async function main() {
  try {
    console.log('Generating dynamic sitemap...');
    
    const data = await fetchAnimeData();
    const sitemapXML = generateSitemapXML(data);
    
    // 写入sitemap文件
    const sitemapPath = path.join(__dirname, '../public/sitemap-dynamic.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    
    console.log(`✅ Dynamic sitemap generated successfully at ${sitemapPath}`);
    console.log(`📊 Included ${data.movies.length} movies, ${data.series.length} series, and ${data.genres.length} genres`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemapXML, fetchAnimeData };