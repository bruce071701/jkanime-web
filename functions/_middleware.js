// Cloudflare Pages 中间件
export async function onRequest(context) {
  const { request, next } = context;
  
  // 处理 Next.js 路由
  const url = new URL(request.url);
  
  // 如果是 API 路由，直接转发
  if (url.pathname.startsWith('/api/')) {
    return next();
  }
  
  // 处理静态文件
  if (url.pathname.startsWith('/_next/') || 
      url.pathname.startsWith('/favicon') ||
      url.pathname.includes('.')) {
    return next();
  }
  
  // 对于其他路由，尝试返回 index.html
  try {
    const response = await next();
    if (response.status === 404) {
      // 返回主页面，让客户端路由处理
      const indexResponse = await context.env.ASSETS.fetch(new URL('/', request.url));
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...Object.fromEntries(indexResponse.headers)
        }
      });
    }
    return response;
  } catch (error) {
    return next();
  }
}