#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://api-jk.funnyu.xyz/api/v1';
const SITE_URL = 'https://jkanimeflv.com';

// 创建静态页面目录
const STATIC_DIR = path.join(__dirname, '../public/static');
if (!fs.existsSync(STATIC_DIR)) {
  fs.mkdirSync(STATIC_DIR, { recursive: true });
}

// API请求函数
async function apiRequest(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return null;
  }
}

// 生成HTML模板
function generateHTML(title, description, content, canonicalUrl, structuredData = null) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="JKAnime FLV">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/src/main.tsx" as="script" type="module">
  <link rel="preconnect" href="${API_BASE_URL}">
  
  <!-- Structured Data -->
  ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-HQJSYW0VHZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-HQJSYW0VHZ');
  </script>
  
  <style>
    /* Critical CSS for faster rendering */
    body { 
      margin: 0; 
      background: #111827; 
      color: white; 
      font-family: system-ui, -apple-system, sans-serif; 
    }
    .loading { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      font-size: 18px; 
    }
    .spinner {
      border: 3px solid #374151;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-right: 12px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="spinner"></div>
      Cargando JKAnime FLV...
    </div>
  </div>
  
  <!-- Prerendered content for SEO -->
  <div id="prerendered-content" style="display: none;">
    ${content}
  </div>
  
  <script type="module" src="/src/main.tsx"></script>
  
  <!-- Hydration script -->
  <script>
    // Hide loading and show React app when ready
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const loading = document.querySelector('.loading');
        if (loading && document.querySelector('#root > div:not(.loading)')) {
          loading.style.display = 'none';
        }
      }, 100);
    });
  </script>
</body>
</html>`;
}

// 生成首页静态版本
async function generateHomePage() {
  console.log('Generating home page...');
  
  const homeData = await apiRequest('/anime/home');
  if (!homeData) return;

  const title = 'JKAnime FLV - Ver Anime Online Gratis | JKAnimeFlv';
  const description = 'JKAnime FLV - Ver anime online gratis en HD. La mejor plataforma para disfrutar series y películas anime con subtítulos en español. AnimeFlv alternativa.';
  
  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JKAnime FLV",
    "url": SITE_URL,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // 生成预渲染内容
  const content = `
    <h1>JKAnime FLV - Ver Anime Online Gratis</h1>
    <p>${description}</p>
    
    <section>
      <h2>Últimas Películas</h2>
      ${homeData.latestMovies?.slice(0, 6).map(anime => `
        <article>
          <h3>${anime.name}</h3>
          <p>Tipo: Película</p>
          ${anime.genres ? `<p>Géneros: ${anime.genres}</p>` : ''}
        </article>
      `).join('') || ''}
    </section>
    
    <section>
      <h2>Últimas Series</h2>
      ${homeData.latestSeries?.slice(0, 6).map(anime => `
        <article>
          <h3>${anime.name}</h3>
          <p>Tipo: Serie</p>
          ${anime.genres ? `<p>Géneros: ${anime.genres}</p>` : ''}
        </article>
      `).join('') || ''}
    </section>
  `;

  const html = generateHTML(title, description, content, SITE_URL, structuredData);
  fs.writeFileSync(path.join(STATIC_DIR, 'index.html'), html);
  console.log('✅ Home page generated');
}

// 生成动漫详情页面
async function generateAnimePages() {
  console.log('Generating anime detail pages...');
  
  // 获取热门动漫列表
  const listData = await apiRequest('/anime/list?page=1&size=50');
  if (!listData?.list) return;

  const animeDir = path.join(STATIC_DIR, 'anime');
  if (!fs.existsSync(animeDir)) {
    fs.mkdirSync(animeDir, { recursive: true });
  }

  for (const anime of listData.list.slice(0, 20)) { // 限制生成数量
    try {
      const animeDetail = await apiRequest(`/anime/detail/${anime.id}`);
      if (!animeDetail) continue;

      const title = `${anime.name} - Ver Online | JKAnime FLV`;
      const description = anime.overview || `Ver ${anime.name} online gratis en JKAnime FLV. ${anime.type === 'series' ? 'Serie' : 'Película'} anime con subtítulos en español.`;
      
      // 生成结构化数据
      const structuredData = {
        "@context": "https://schema.org",
        "@type": anime.type === 'movie' ? "Movie" : "TVSeries",
        "name": anime.name,
        "description": description,
        "url": `${SITE_URL}/anime/${anime.id}`,
        "image": anime.imagen,
        "genre": anime.genres?.split(',').map(g => g.trim()) || [],
        "datePublished": anime.aired,
        "aggregateRating": anime.rating ? {
          "@type": "AggregateRating",
          "ratingValue": anime.rating,
          "ratingCount": anime.visitas || 1
        } : undefined
      };

      const content = `
        <article>
          <h1>${anime.name}</h1>
          <p>${description}</p>
          <div>
            <p><strong>Tipo:</strong> ${anime.type === 'series' ? 'Serie' : 'Película'}</p>
            <p><strong>Estado:</strong> ${anime.status === 'completed' ? 'Completo' : 'En emisión'}</p>
            ${anime.genres ? `<p><strong>Géneros:</strong> ${anime.genres}</p>` : ''}
            ${anime.aired ? `<p><strong>Fecha:</strong> ${anime.aired}</p>` : ''}
            ${anime.rating ? `<p><strong>Puntuación:</strong> ${anime.rating}/10</p>` : ''}
          </div>
          
          ${animeDetail.episodes?.length > 0 ? `
            <section>
              <h2>Episodios (${animeDetail.episodes.length})</h2>
              <ul>
                ${animeDetail.episodes.slice(0, 10).map(ep => `
                  <li>Episodio ${ep.number}${ep.title ? ` - ${ep.title}` : ''}</li>
                `).join('')}
                ${animeDetail.episodes.length > 10 ? '<li>... y más episodios</li>' : ''}
              </ul>
            </section>
          ` : ''}
        </article>
      `;

      const html = generateHTML(title, description, content, `${SITE_URL}/anime/${anime.id}`, structuredData);
      fs.writeFileSync(path.join(animeDir, `${anime.id}.html`), html);
      
      console.log(`✅ Generated page for: ${anime.name}`);
      
      // 避免API限制
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate page for anime ${anime.id}:`, error);
    }
  }
}

// 生成分类页面
async function generateGenrePages() {
  console.log('Generating genre pages...');
  
  const genres = await apiRequest('/anime/genres');
  if (!genres?.genres) return;

  const genreDir = path.join(STATIC_DIR, 'generos');
  if (!fs.existsSync(genreDir)) {
    fs.mkdirSync(genreDir, { recursive: true });
  }

  for (const genre of genres.genres.slice(0, 10)) {
    try {
      const genreData = await apiRequest(`/anime/list?genre=${encodeURIComponent(genre.name)}&size=20`);
      if (!genreData?.list) continue;

      const title = `Anime ${genre.name} - Ver Online | JKAnime FLV`;
      const description = `Ver anime de ${genre.name} online gratis en JKAnime FLV. Descubre las mejores series y películas del género ${genre.name}.`;
      
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `Anime ${genre.name}`,
        "description": description,
        "url": `${SITE_URL}/generos?genre=${encodeURIComponent(genre.name)}`,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": genre.count,
          "itemListElement": genreData.list.slice(0, 10).map((anime, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": anime.type === 'movie' ? "Movie" : "TVSeries",
              "name": anime.name,
              "url": `${SITE_URL}/anime/${anime.id}`
            }
          }))
        }
      };

      const content = `
        <h1>Anime ${genre.name}</h1>
        <p>${description}</p>
        <p>Total de animes: ${genre.count}</p>
        
        <section>
          <h2>Animes Populares de ${genre.name}</h2>
          ${genreData.list.slice(0, 12).map(anime => `
            <article>
              <h3>${anime.name}</h3>
              <p>Tipo: ${anime.type === 'series' ? 'Serie' : 'Película'}</p>
              ${anime.overview ? `<p>${anime.overview.substring(0, 150)}...</p>` : ''}
            </article>
          `).join('')}
        </section>
      `;

      const html = generateHTML(title, description, content, `${SITE_URL}/generos?genre=${encodeURIComponent(genre.name)}`, structuredData);
      const filename = genre.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      fs.writeFileSync(path.join(genreDir, `${filename}.html`), html);
      
      console.log(`✅ Generated genre page for: ${genre.name}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate genre page for ${genre.name}:`, error);
    }
  }
}

// 生成robots.txt
function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

# Allow important pages
Allow: /anime/
Allow: /generos/
Allow: /peliculas/
Allow: /series/
Allow: /buscar/`;

  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robotsContent);
  console.log('✅ robots.txt generated');
}

// 主函数
async function main() {
  console.log('🚀 Starting static page generation...');
  
  try {
    await generateHomePage();
    await generateAnimePages();
    await generateGenrePages();
    generateRobotsTxt();
    
    console.log('✅ All static pages generated successfully!');
    console.log(`📁 Static files location: ${STATIC_DIR}`);
  } catch (error) {
    console.error('❌ Error generating static pages:', error);
    process.exit(1);
  }
}

// 运行生成器
main();