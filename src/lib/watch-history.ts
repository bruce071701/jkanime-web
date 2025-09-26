import { Anime, Episode } from '@/types/anime';

export interface WatchHistoryItem {
  animeId: number;
  animeTitle: string;
  animePoster: string;
  animeType: 'series' | 'movie';
  animeLang?: string;
  episodeId: number;
  episodeNumber: number;
  episodeTitle?: string;
  watchedAt: string; // ISO date string
  progress?: number; // 播放进度百分比 (0-100)
}

const HISTORY_COOKIE_NAME = 'jkanime_watch_history';
const MAX_HISTORY_ITEMS = 20; // 最多保存20个历史记录

// Cookie 操作工具函数
function setCookie(name: string, value: string, days: number = 30) {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// 获取播放历史
export function getWatchHistory(): WatchHistoryItem[] {
  try {
    const historyJson = getCookie(HISTORY_COOKIE_NAME);
    if (!historyJson) return [];
    
    const history = JSON.parse(decodeURIComponent(historyJson));
    return Array.isArray(history) ? history : [];
  } catch (error) {
    return [];
  }
}

// 添加播放历史记录
export function addToWatchHistory(
  anime: Anime,
  episode: Episode,
  progress?: number
): void {
  try {
    const currentHistory = getWatchHistory();
    
    const newItem: WatchHistoryItem = {
      animeId: anime.id,
      animeTitle: anime.name,
      animePoster: anime.imagen || '',
      animeType: anime.type as 'movie' | 'series',
      animeLang: anime.lang,
      episodeId: episode.id,
      episodeNumber: episode.episodeNumber || episode.number || 1,
      episodeTitle: episode.title,
      watchedAt: new Date().toISOString(),
      progress: progress
    };
    
    // 移除相同的剧集记录（如果存在）
    const filteredHistory = currentHistory.filter(
      item => !(item.animeId === anime.id && item.episodeId === episode.id)
    );
    
    // 添加新记录到开头
    const updatedHistory = [newItem, ...filteredHistory];
    
    // 限制历史记录数量
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // 保存到cookie
    const historyJson = encodeURIComponent(JSON.stringify(limitedHistory));
    setCookie(HISTORY_COOKIE_NAME, historyJson, 30); // 保存30天
    
  } catch (error) {
    // Silently handle error
  }
}

// 更新播放进度
export function updateWatchProgress(
  animeId: number,
  episodeId: number,
  progress: number
): void {
  try {
    const currentHistory = getWatchHistory();
    const updatedHistory = currentHistory.map(item => {
      if (item.animeId === animeId && item.episodeId === episodeId) {
        return { ...item, progress, watchedAt: new Date().toISOString() };
      }
      return item;
    });
    
    const historyJson = encodeURIComponent(JSON.stringify(updatedHistory));
    setCookie(HISTORY_COOKIE_NAME, historyJson, 30);
    
  } catch (error) {
    // Silently handle error
  }
}

// 移除播放历史记录
export function removeFromWatchHistory(animeId: number, episodeId: number): void {
  try {
    const currentHistory = getWatchHistory();
    const filteredHistory = currentHistory.filter(
      item => !(item.animeId === animeId && item.episodeId === episodeId)
    );
    
    const historyJson = encodeURIComponent(JSON.stringify(filteredHistory));
    setCookie(HISTORY_COOKIE_NAME, historyJson, 30);
    
  } catch (error) {
    // Silently handle error
  }
}

// 清空播放历史
export function clearWatchHistory(): void {
  try {
    setCookie(HISTORY_COOKIE_NAME, '', -1); // 设置过期时间为过去，删除cookie
  } catch (error) {
    // Silently handle error
  }
}

// 获取特定动漫的播放历史
export function getAnimeWatchHistory(animeId: number): WatchHistoryItem[] {
  const allHistory = getWatchHistory();
  return allHistory.filter(item => item.animeId === animeId);
}

// 获取最近观看的动漫（去重）
export function getRecentWatchedAnimes(limit: number = 10): WatchHistoryItem[] {
  const allHistory = getWatchHistory();
  const uniqueAnimes = new Map<number, WatchHistoryItem>();
  
  // 按时间倒序，保留每个动漫的最新记录
  for (const item of allHistory) {
    if (!uniqueAnimes.has(item.animeId)) {
      uniqueAnimes.set(item.animeId, item);
    }
  }
  
  return Array.from(uniqueAnimes.values()).slice(0, limit);
}