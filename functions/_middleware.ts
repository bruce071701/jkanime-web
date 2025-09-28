// Cloudflare Pages Functions 中间件

interface Env {
  PRERENDERED_PAGES?: KVNamespace;
  API_BASE_URL?: string;
  SITE_URL?: string;
}

export async function onRequest(context: EventContext<Env, any, any>) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // 检查是否为搜索引擎爬虫
  const isCrawler = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|whatsapp|telegram/i.test(userAgent);

  // 为爬虫提供预渲染内容
  if (isCrawler && !url.pathname.startsWith('/api/')) {
    const prerenderedResponse = await handleCrawlerRequest(url, context);
    if (prerenderedResponse) {
      return prerenderedResponse;
    }
  }

  // 处理API代理
  if (url.pathname.startsWith('/api/v1/')) {
    return handleApiProxy(url, request, env);
  }

  // 继续正常处理
  const response = await next();
  
  // 添加性能和安全头
  const newResponse = new Response(response.body, response);
  
  // 复制原始头部
  response.headers.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });
  
  // 添加性能头
  newResponse.headers.set('Server-Timing', `cf-cache-status;desc="${response.headers.get('cf-cache-status') || 'MISS'}"`);
  
  return newResponse;
}

// API代理处理
async function handleApiProxy(url: URL, request: Request, env: Env) {
  const apiBaseUrl = env.API_BASE_URL || 'https://api-jk.funnyu.xyz';
  const targetUrl = url.pathname.replace('/api/v1', `${apiBaseUrl}/api/v1`) + url.search;
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JKAnime-Web/1.0',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const newResponse = new Response(response.body, response);
    
    // 添加CORS头
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // 设置缓存
    if (response.ok) {
      newResponse.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    }
    
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API request failed' }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

async function handleCrawlerRequest(url: URL, context: EventContext<any, any, any>) {
  const { env } = context;
  
  try {
    // 尝试从KV存储获取预渲染内容
    if (env.PRERENDERED_PAGES) {
      const cacheKey = url.pathname === '/' ? 'index' : url.pathname.replace(/^\//, '').replace(/\/$/, '');
      const prerenderedContent = await env.PRERENDERED_PAGES.get(cacheKey);
      
      if (prerenderedContent) {
        return new Response(prerenderedContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400'
          }
        });
      }
    }

    // 动态生成预渲染内容
    const prerenderedHTML = await generatePrerenderedHTML(url.pathname, env);
    if (prerenderedHTML) {
      // 存储到KV以供后续使用
      if (env.PRERENDERED_PAGES) {
        const cacheKey = url.pathname === '/' ? 'index' : url.pathname.replace(/^\//, '').replace(/\/$/, '');
        await env.PRERENDERED_PAGES.put(cacheKey, prerenderedHTML, { expirationTtl: 3600 });
      }
      
      return new Response(prerenderedHTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400'
        }
      });
    }
  } catch (error) {
    console.error('Error handling crawler request:', error);
  }

  return null;
}

async function generatePrerenderedHTML(pathname: string, env: any): Promise<string | null> {
  const API_BASE_URL = env.API_BASE_URL || 'https://api-jk.funnyu.xyz/api/v1';
  const SITE_URL = env.SITE_URL || 'https://jkanimeflv.com';

  try {
    let data = null;
    let title = 'JKAnime FLV - Ver Anime Online Gratis';
    let description = 'JKAnime FLV - Ver anime online gratis en HD. La mejor plataforma para disfrutar series y películas anime con subtítulos en español.';
    let structuredData = null;

    // 根据路径获取数据
    if (pathname === '/' || pathname === '/home') {
      const response = await fetch(`${API_BASE_URL}/anime/home`);
      if (response.ok) {
        const result = await response.json();
        data = result.data || result;
        
        structuredData = {
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
      }
    } else if (pathname.startsWith('/anime/')) {
      const animeId = pathname.split('/')[2];
      if (animeId && !isNaN(Number(animeId))) {
        const response = await fetch(`${API_BASE_URL}/anime/detail/${animeId}`);
        if (response.ok) {
          const result = await response.json();
          data = result.data || result;
          
          if (data?.anime) {
            title = `${data.anime.name} - Ver Online | JKAnime FLV`;
            description = data.anime.overview || `Ver ${data.anime.name} online gratis en JKAnime FLV.`;
            
            structuredData = {
              "@context": "https://schema.org",
              "@type": data.anime.type === 'movie' ? "Movie" : "TVSeries",
              "name": data.anime.name,
              "description": description,
              "url": `${SITE_URL}${pathname}`,
              "image": data.anime.imagen,
              "genre": data.anime.genres?.split(',').map((g: string) => g.trim()) || []
            };
          }
        }
      }
    }

    // 生成HTML
    return generateCrawlerHTML(title, description, pathname, data, structuredData, SITE_URL);
  } catch (error) {
    console.error('Error generating prerendered HTML:', error);
    return null;
  }
}

function generateCrawlerHTML(
  title: string,
  description: string,
  pathname: string,
  data: any,
  structuredData: any,
  siteUrl: string
): string {
  const canonicalUrl = `${siteUrl}${pathname}`;
  
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
  
  ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  
  ${data ? generateContentFromData(data, pathname) : ''}
  
  <script>
    // 重定向到完整应用
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.replace('${canonicalUrl}');
    }
  </script>
</body>
</html>`;
}

function generateContentFromData(data: any, pathname: string): string {
  if (pathname === '/' && data.latestMovies && data.latestSeries) {
    return `
      <section>
        <h2>Últimas Películas</h2>
        ${data.latestMovies.slice(0, 6).map((anime: any) => `
          <article>
            <h3>${anime.name}</h3>
            <p>Tipo: Película</p>
            ${anime.genres ? `<p>Géneros: ${anime.genres}</p>` : ''}
          </article>
        `).join('')}
      </section>
      
      <section>
        <h2>Últimas Series</h2>
        ${data.latestSeries.slice(0, 6).map((anime: any) => `
          <article>
            <h3>${anime.name}</h3>
            <p>Tipo: Serie</p>
            ${anime.genres ? `<p>Géneros: ${anime.genres}</p>` : ''}
          </article>
        `).join('')}
      </section>
    `;
  }
  
  if (pathname.startsWith('/anime/') && data.anime) {
    return `
      <article>
        <h2>${data.anime.name}</h2>
        <p>${data.anime.overview || ''}</p>
        <p><strong>Tipo:</strong> ${data.anime.type === 'series' ? 'Serie' : 'Película'}</p>
        ${data.anime.genres ? `<p><strong>Géneros:</strong> ${data.anime.genres}</p>` : ''}
        ${data.episodes?.length > 0 ? `
          <section>
            <h3>Episodios (${data.episodes.length})</h3>
            <ul>
              ${data.episodes.slice(0, 10).map((ep: any) => `
                <li>Episodio ${ep.number}${ep.title ? ` - ${ep.title}` : ''}</li>
              `).join('')}
            </ul>
          </section>
        ` : ''}
      </article>
    `;
  }
  
  return '';
}