// Cloudflare Pages 优化的 Service Worker
const CACHE_VERSION = 'v1759027999516';
const STATIC_CACHE = `jkanime-static-${CACHE_VERSION}`;
const API_CACHE = `jkanime-api-${CACHE_VERSION}`;

// 预缓存资源列表
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/jkanime-icon.svg'
];

// 安装事件
self.addEventListener('install', (event) => {
  console.log('SW: Installing for Cloudflare Pages...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('jkanime-') && 
                cacheName !== STATIC_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// 获取事件
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') return;
  
  // 利用 Cloudflare 缓存，不拦截 API 请求
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // 处理静态资源
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // 处理 HTML 页面
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHTMLRequest(request));
    return;
  }
});

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Asset not found', { status: 404 });
  }
}

async function handleHTMLRequest(request) {
  try {
    // 优先使用网络，利用 Cloudflare 的边缘缓存
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // 网络失败时返回缓存的首页
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/');
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('SW: Performing background sync...');
  // 这里可以添加后台同步逻辑
}
