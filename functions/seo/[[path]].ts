// SEO优化的动态路由处理

interface Env {
  PRERENDERED_PAGES?: KVNamespace;
  API_BASE_URL?: string;
  SITE_URL?: string;
}

export async function onRequest(context: EventContext<Env, any, any>) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // 只为爬虫提供SEO优化内容
  const isCrawler = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|whatsapp|telegram/i.test(userAgent);
  
  if (!isCrawler) {
    return new Response('Not Found', { status: 404 });
  }

  const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
  const fullPath = `/${path}`;
  
  try {
    // 尝试从KV获取缓存的预渲染内容
    if (env.PRERENDERED_PAGES) {
      const cacheKey = `seo_${path || 'index'}`;
      const cached = await env.PRERENDERED_PAGES.get(cacheKey);
      
      if (cached) {
        return new Response(cached, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            'X-Robots-Tag': 'index, follow',
          },
        });
      }
    }

    // 动态生成SEO内容
    const seoContent = await generateSEOContent(fullPath, env);
    
    if (seoContent) {
      // 缓存到KV
      if (env.PRERENDERED_PAGES) {
        const cacheKey = `seo_${path || 'index'}`;
        await env.PRERENDERED_PAGES.put(cacheKey, seoContent, { 
          expirationTtl: 3600 // 1小时过期
        });
      }
      
      return new Response(seoContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }
  } catch (error) {
    console.error('SEO generation error:', error);
  }

  return new Response('Not Found', { status: 404 });
}

async function generateSEOContent(path: string, env: Env): Promise<string | null> {
  const apiBaseUrl = env.API_BASE_URL || 'https://api-jk.funnyu.xyz/api/v1';
  const siteUrl = env.SITE_URL || 'https://jkanimeflv.com';
  
  let title = 'JKAnime FLV - Ver Anime Online Gratis';
  let description = 'JKAnime FLV - Ver anime online gratis en HD. La mejor plataforma para disfrutar series y películas anime con subtítulos en español.';
  let content = '';
  let structuredData = null;

  try {
    if (path === '/' || path === '/home') {
      // 首页SEO内容
      const response = await fetch(`${apiBaseUrl}/anime/home`);
      if (response.ok) {
        const data = await response.json();
        const homeData = data.data || data;
        
        content = generateHomeContent(homeData);
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "JKAnime FLV",
          "url": siteUrl,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/buscar?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
      }
    } else if (path.startsWith('/anime/')) {
      // 动漫详情页SEO内容
      const animeId = path.split('/')[2];
      if (animeId && !isNaN(Number(animeId))) {
        const response = await fetch(`${apiBaseUrl}/anime/detail/${animeId}`);
        if (response.ok) {
          const data = await response.json();
          const animeData = data.data || data;
          
          if (animeData?.anime) {
            title = `${animeData.anime.name} - Ver Online | JKAnime FLV`;
            description = animeData.anime.overview || `Ver ${animeData.anime.name} online gratis en JKAnime FLV. ${animeData.anime.type === 'series' ? 'Serie' : 'Película'} anime con subtítulos en español.`;
            content = generateAnimeContent(animeData);
            
            structuredData = {
              "@context": "https://schema.org",
              "@type": animeData.anime.type === 'movie' ? "Movie" : "TVSeries",
              "name": animeData.anime.name,
              "description": description,
              "url": `${siteUrl}${path}`,
              "image": animeData.anime.imagen,
              "genre": animeData.anime.genres?.split(',').map((g: string) => g.trim()) || [],
              "datePublished": animeData.anime.aired,
              "aggregateRating": animeData.anime.rating ? {
                "@type": "AggregateRating",
                "ratingValue": animeData.anime.rating,
                "ratingCount": animeData.anime.visitas || 1
              } : undefined
            };
          }
        }
      }
    } else if (path === '/peliculas') {
      title = 'Películas Anime - Ver Online | JKAnime FLV';
      description = 'Ver películas anime online gratis en JKAnime FLV. Disfruta de las mejores películas anime con subtítulos en español.';
      content = '<h1>Películas Anime</h1><p>Descubre las mejores películas anime disponibles para ver online.</p>';
    } else if (path === '/series') {
      title = 'Series Anime - Ver Online | JKAnime FLV';
      description = 'Ver series anime online gratis en JKAnime FLV. Disfruta de las mejores series anime con subtítulos en español.';
      content = '<h1>Series Anime</h1><p>Explora las series anime más populares y recientes.</p>';
    } else if (path === '/generos') {
      title = 'Géneros de Anime | JKAnime FLV';
      description = 'Explora todos los géneros de anime disponibles en JKAnime FLV. Encuentra tu género favorito y descubre nuevos animes.';
      content = '<h1>Géneros de Anime</h1><p>Descubre anime por géneros: acción, romance, comedia, drama y más.</p>';
    }

    return generateSEOHTML(title, description, content, `${siteUrl}${path}`, structuredData);
  } catch (error) {
    console.error('Error generating SEO content:', error);
    return null;
  }
}

function generateHomeContent(homeData: any): string {
  if (!homeData) return '';
  
  return `
    <main>
      <h1>JKAnime FLV - Ver Anime Online Gratis</h1>
      <p>La mejor plataforma para ver anime online gratis en HD con subtítulos en español.</p>
      
      ${homeData.latestMovies?.length > 0 ? `
        <section>
          <h2>Últimas Películas Anime</h2>
          <ul>
            ${homeData.latestMovies.slice(0, 10).map((anime: any) => `
              <li>
                <h3>${anime.name}</h3>
                <p>Película anime - ${anime.genres || 'Varios géneros'}</p>
                ${anime.overview ? `<p>${anime.overview.substring(0, 150)}...</p>` : ''}
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}
      
      ${homeData.latestSeries?.length > 0 ? `
        <section>
          <h2>Últimas Series Anime</h2>
          <ul>
            ${homeData.latestSeries.slice(0, 10).map((anime: any) => `
              <li>
                <h3>${anime.name}</h3>
                <p>Serie anime - ${anime.genres || 'Varios géneros'}</p>
                ${anime.overview ? `<p>${anime.overview.substring(0, 150)}...</p>` : ''}
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}
    </main>
  `;
}

function generateAnimeContent(animeData: any): string {
  if (!animeData?.anime) return '';
  
  const anime = animeData.anime;
  
  return `
    <main>
      <article>
        <h1>${anime.name}</h1>
        <p>${anime.overview || `Ver ${anime.name} online gratis en JKAnime FLV.`}</p>
        
        <section>
          <h2>Información del Anime</h2>
          <ul>
            <li><strong>Tipo:</strong> ${anime.type === 'series' ? 'Serie' : 'Película'}</li>
            <li><strong>Estado:</strong> ${anime.status === 'completed' ? 'Completo' : 'En emisión'}</li>
            ${anime.genres ? `<li><strong>Géneros:</strong> ${anime.genres}</li>` : ''}
            ${anime.aired ? `<li><strong>Fecha de estreno:</strong> ${anime.aired}</li>` : ''}
            ${anime.rating ? `<li><strong>Puntuación:</strong> ${anime.rating}/10</li>` : ''}
          </ul>
        </section>
        
        ${animeData.episodes?.length > 0 ? `
          <section>
            <h2>Lista de Episodios</h2>
            <p>Total de episodios: ${animeData.episodes.length}</p>
            <ul>
              ${animeData.episodes.slice(0, 20).map((ep: any) => `
                <li>Episodio ${ep.number}${ep.title ? ` - ${ep.title}` : ''}</li>
              `).join('')}
              ${animeData.episodes.length > 20 ? '<li>... y más episodios disponibles</li>' : ''}
            </ul>
          </section>
        ` : ''}
      </article>
    </main>
  `;
}

function generateSEOHTML(title: string, description: string, content: string, canonicalUrl: string, structuredData: any): string {
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
  <meta property="og:image" content="https://jkanimeflv.com/jkanime-icon.svg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://jkanimeflv.com/jkanime-icon.svg">
  
  <!-- Structured Data -->
  ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
  
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    h1, h2, h3 { color: #2563eb; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    section { margin-bottom: 30px; }
  </style>
</head>
<body>
  ${content}
  
  <footer>
    <p>© 2024 JKAnime FLV - Ver anime online gratis</p>
    <p><a href="https://jkanimeflv.com">Ir a la aplicación completa</a></p>
  </footer>
  
  <script>
    // 重定向非爬虫用户到完整应用
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.replace('${canonicalUrl}');
    }
  </script>
</body>
</html>`;
}