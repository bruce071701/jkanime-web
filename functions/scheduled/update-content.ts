// Cloudflare Pages Scheduled Function (Cron Triggers)
// 这个函数会定时执行，无需外部触发

interface Env {
  CONTENT_KV?: KVNamespace;
  API_BASE_URL?: string;
}

export async function onRequestGet(context: EventContext<Env, any, any>) {
  const { env } = context;
  
  try {
    // 检查是否需要更新
    const shouldUpdate = await checkIfUpdateNeeded(env);
    
    if (!shouldUpdate) {
      return new Response(JSON.stringify({
        message: 'Content is up to date',
        timestamp: new Date().toISOString(),
        nextUpdate: getNextUpdateTime()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 执行内容更新
    const result = await updateContent(env);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Scheduled content update completed',
      timestamp: new Date().toISOString(),
      ...result
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Scheduled update error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function checkIfUpdateNeeded(env: Env): Promise<boolean> {
  if (!env.CONTENT_KV) return true;
  
  try {
    const lastUpdateData = await env.CONTENT_KV.get('last-update');
    if (!lastUpdateData) return true;
    
    const lastUpdate = JSON.parse(lastUpdateData);
    const lastUpdateTime = new Date(lastUpdate.timestamp);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60);
    
    // 如果距离上次更新超过6小时，则需要更新
    return hoursSinceUpdate >= 6;
  } catch (error) {
    console.error('Error checking update time:', error);
    return true; // 出错时默认需要更新
  }
}

function getNextUpdateTime(): string {
  const now = new Date();
  const nextUpdate = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6小时后
  return nextUpdate.toISOString();
}

async function updateContent(env: Env) {
  const API_BASE_URL = env.API_BASE_URL || 'https://api-jk.funnyu.xyz/api/v1';
  const results = {
    home: false,
    genres: false,
    popular: false
  };

  try {
    // 并行更新所有内容
    const [homeResponse, genresResponse, popularResponse] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/anime/home`),
      fetch(`${API_BASE_URL}/anime/genres`),
      fetch(`${API_BASE_URL}/anime/list?page=1&size=50`)
    ]);

    // 处理首页数据
    if (homeResponse.status === 'fulfilled' && homeResponse.value.ok) {
      const homeData = await homeResponse.value.json();
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('home-data', JSON.stringify({
          data: homeData.data || homeData,
          timestamp: new Date().toISOString(),
          ttl: 6 * 60 * 60 * 1000
        }));
      }
      results.home = true;
    }

    // 处理分类数据
    if (genresResponse.status === 'fulfilled' && genresResponse.value.ok) {
      const genresData = await genresResponse.value.json();
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('genres-data', JSON.stringify({
          data: genresData.data || genresData,
          timestamp: new Date().toISOString(),
          ttl: 24 * 60 * 60 * 1000
        }));
      }
      results.genres = true;
    }

    // 处理热门数据
    if (popularResponse.status === 'fulfilled' && popularResponse.value.ok) {
      const popularData = await popularResponse.value.json();
      if (env.CONTENT_KV) {
        await env.CONTENT_KV.put('popular-data', JSON.stringify({
          data: popularData.data || popularData,
          timestamp: new Date().toISOString(),
          ttl: 12 * 60 * 60 * 1000
        }));
      }
      results.popular = true;
    }

    // 更新最后更新时间
    if (env.CONTENT_KV) {
      await env.CONTENT_KV.put('last-update', JSON.stringify({
        timestamp: new Date().toISOString(),
        success: true,
        results
      }));
    }

    return {
      updated: results,
      nextUpdate: getNextUpdateTime()
    };

  } catch (error) {
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