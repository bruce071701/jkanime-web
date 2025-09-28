// 客户端缓存管理

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // 设置缓存
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // 同时存储到 localStorage (如果可用)
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`jkanime_cache_${key}`, JSON.stringify({
          data,
          timestamp: Date.now(),
          ttl
        }));
      } catch (error) {
        console.warn('Failed to store in localStorage:', error);
      }
    }
  }

  // 获取缓存
  get<T>(key: string): T | null {
    // 首先检查内存缓存
    const memoryItem = this.cache.get(key);
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data;
    }

    // 检查 localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(`jkanime_cache_${key}`);
        if (stored) {
          const item: CacheItem<T> = JSON.parse(stored);
          if (this.isValid(item)) {
            // 恢复到内存缓存
            this.cache.set(key, item);
            return item.data;
          } else {
            // 清理过期数据
            localStorage.removeItem(`jkanime_cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }

    // 清理过期的内存缓存
    if (memoryItem) {
      this.cache.delete(key);
    }

    return null;
  }

  // 检查缓存项是否有效
  private isValid<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  // 删除缓存
  delete(key: string): void {
    this.cache.delete(key);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`jkanime_cache_${key}`);
    }
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('jkanime_cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // 获取缓存统计
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 创建全局缓存实例
export const cacheManager = new CacheManager();

// 缓存装饰器函数
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    
    // 尝试从缓存获取
    const cached = cacheManager.get(key);
    if (cached) {
      return cached;
    }

    // 执行原函数
    const result = await fn(...args);
    
    // 存储到缓存
    cacheManager.set(key, result, ttl);
    
    return result;
  }) as T;
}

// 预定义的缓存键生成器
export const cacheKeys = {
  homeData: () => 'home_data',
  animeDetail: (id: number) => `anime_detail_${id}`,
  animeList: (params: Record<string, any>) => `anime_list_${JSON.stringify(params)}`,
  searchResults: (query: string, page: number) => `search_${query}_${page}`,
  genres: () => 'genres_list',
  playData: (episodeId: number) => `play_data_${episodeId}`
};

// 缓存预热函数
export async function warmupCache(): Promise<void> {
  console.log('🔥 Warming up cache...');
  
  try {
    // 预加载首页数据
    const { apiService } = await import('../services/api');
    
    const homeData = await apiService.getHomeData();
    cacheManager.set(cacheKeys.homeData(), homeData, 10 * 60 * 1000); // 10分钟
    
    const genres = await apiService.getGenres();
    cacheManager.set(cacheKeys.genres(), genres, 30 * 60 * 1000); // 30分钟
    
    console.log('✅ Cache warmed up successfully');
  } catch (error) {
    console.warn('⚠️ Cache warmup failed:', error);
  }
}

// Service Worker 缓存策略
export const swCacheStrategies = {
  // 静态资源 - 缓存优先
  static: {
    cacheName: 'jkanime-static-v1',
    strategy: 'CacheFirst',
    maxEntries: 100,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
  },
  
  // API 数据 - 网络优先，缓存备用
  api: {
    cacheName: 'jkanime-api-v1',
    strategy: 'NetworkFirst',
    maxEntries: 200,
    maxAgeSeconds: 5 * 60 // 5 minutes
  },
  
  // 图片 - 缓存优先
  images: {
    cacheName: 'jkanime-images-v1',
    strategy: 'CacheFirst',
    maxEntries: 500,
    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
  }
};