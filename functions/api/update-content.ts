// Cloudflare Pages Function for content updates
// 使用 Cloudflare KV 存储和 Cron Triggers

interface Env {
  CONTENT_KV?: KVNamespace;
  API_BASE_URL?: string;
}

const API_BASE_URL = 'https://api-jk.funnyu.xyz/api/v1';

export async function onRequestPost(context: EventContext<Env, any, any>) {
  const { request, env } = context;
  
  try {
    // 简单的内容更新，直接在 Cloudflare Pages 上执行
    const result = await updateContent(env);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Content updated successfully',
      timestamp: new Date().toISOString(),
      ...result
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Content update error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

async function updateContent(env: Env) {
  const results = {
    home: null,
    genres: null,
    popular: null,
    sitemap: null
  };

  try {
    // 更新首页数据
    const homeResponse = await fetch(`${API_BASE_URL}/anime/home`);
    if (homeResponse.ok) {
      const homeData = await homeResponse.json();
      results.home = homeData.data || homeData;
      
      // 存储到 KV
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('home-data', JSON.stringify({
          data: results.home,
          timestamp: new Date().toISOString(),
          ttl: 6 * 60 * 60 * 1000 // 6小时
        }));
      }
    }

    // 更新分类数据
    const genresResponse = await fetch(`${API_BASE_URL}/anime/genres`);
    if (genresResponse.ok) {
      const genresData = await genresResponse.json();
      results.genres = genresData.data || genresData;
      
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('genres-data', JSON.stringify({
          data: results.genres,
          timestamp: new Date().toISOString(),
          ttl: 24 * 60 * 60 * 1000 // 24小时
        }));
      }
    }

    // 更新热门动漫
    const popularResponse = await fetch(`${API_BASE_URL}/anime/list?page=1&size=50`);
    if (popularResponse.ok) {
      const popularData = await popularResponse.json();
      results.popular = popularData.data || popularData;
      
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('popular-data', JSON.stringify({
          data: results.popular,
          timestamp: new Date().toISOString(),
          ttl: 12 * 60 * 60 * 1000 // 12小时
        }));
      }
    }

    // 生成简化的sitemap数据
    if (results.home && results.genres) {
      const sitemapData = generateSitemapData(results.home, results.genres, results.popular);
      results.sitemap = sitemapData;
      
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('sitemap-data', JSON.stringify({
          data: sitemapData,
          timestamp: new Date().toISOString(),
          ttl: 24 * 60 * 60 * 1000 // 24小时
        }));
      }
    }

    // 保存更新时间
    if (env.CONTENT_KV) {
      await env.CONTENT_KV.put('last-update', JSON.stringify({
        timestamp: new Date().toISOString(),
        success: true,
        results: {
          home: !!results.home,
          genres: !!results.genres,
          popular: !!results.popular,
          sitemap: !!results.sitemap
        }
      }));
    }

    return {
      updated: {
        home: !!results.home,
        genres: !!results.genres,
        popular: !!results.popular,
        sitemap: !!results.sitemap
      },
      counts: {
        movies: results.home?.latestMovies?.length || 0,
        series: results.home?.latestSeries?.length || 0,
        genres: results.genres?.genres?.length || 0,
        popular: results.popular?.list?.length || 0
      }
    };

  } catch (error) {
    // 记录错误
    if (env.CONTENT_KV) {
      await env.CONTENT_KV.put('last-update', JSON.stringify({
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      }));
    }
    throw error;
  }
}

function generateSitemapData(homeData: any, genresData: any, popularData: any) {
  const urls = [];
  
  // 基础页面
  urls.push(
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/peliculas', priority: 0.8, changefreq: 'daily' },
    { url: '/series', priority: 0.8, changefreq: 'daily' },
    { url: '/generos', priority: 0.7, changefreq: 'weekly' }
  );
  
  // 热门动漫页面
  if (popularData?.list) {
    popularData.list.slice(0, 100).forEach((anime: any) => {
      urls.push({
        url: `/anime/${anime.id}`,
        priority: 0.6,
        changefreq: 'weekly',
        lastmod: anime.createdAt || new Date().toISOString()
      });
    });
  }
  
  // 分类页面
  if (genresData?.genres) {
    genresData.genres.slice(0, 20).forEach((genre: any) => {
      const genreSlug = genre.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      urls.push({
        url: `/generos?genre=${encodeURIComponent(genre.name)}`,
        priority: 0.5,
        changefreq: 'weekly'
      });
    });
  }
  
  return urls;
}

// GET请求返回更新状态和缓存数据
export async function onRequestGet(context: EventContext<Env, any, any>) {
  const { env } = context;
  
  try {
    let lastUpdate = null;
    let cacheStatus = {};
    
    if (env.CONTENT_KV) {
      // 获取最后更新时间
      const lastUpdateData = await env.CONTENT_KV.get('last-update');
      if (lastUpdateData) {
        lastUpdate = JSON.parse(lastUpdateData);
      }
      
      // 检查缓存状态
      const cacheKeys = ['home-data', 'genres-data', 'popular-data', 'sitemap-data'];
      for (const key of cacheKeys) {
        const cached = await env.CONTENT_KV.get(key);
        cacheStatus[key] = cached ? 'available' : 'missing';
      }
    }
    
    return new Response(JSON.stringify({
      service: 'Content Update API',
      status: 'active',
      timestamp: new Date().toISOString(),
      lastUpdate,
      cacheStatus,
      endpoints: {
        'POST /api/update-content': 'Trigger content update',
        'GET /api/update-content': 'Get service status'
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      service: 'Content Update API',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}