import { Anime } from '../types/api';

export interface WatchHistoryItem {
  animeId: number;
  animeTitle: string;
  animePoster: string;
  episodeId: number;
  episodeNumber: number;
  episodeTitle?: string;
  watchedAt: string;
  progress?: number; // 观看进度 (0-100)
  duration?: string;
}

const HISTORY_KEY = 'jkanime_watch_history';
const MAX_HISTORY_ITEMS = 50; // 最多保存50条记录

// 获取观看历史
export function getWatchHistory(): WatchHistoryItem[] {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error loading watch history:', error);
    return [];
  }
}

// 添加观看历史记录
export function addToWatchHistory(
  anime: Anime,
  episodeId: number,
  episodeNumber: number,
  episodeTitle?: string,
  progress?: number
): void {
  try {
    const currentHistory = getWatchHistory();
    
    const newItem: WatchHistoryItem = {
      animeId: anime.id,
      animeTitle: anime.name,
      animePoster: anime.imagen || '',
      episodeId,
      episodeNumber,
      episodeTitle,
      watchedAt: new Date().toISOString(),
      progress,
      duration: '24min' // 默认时长，可以从API获取
    };

    // 移除相同的记录（如果存在）
    const filteredHistory = currentHistory.filter(
      item => !(item.animeId === anime.id && item.episodeId === episodeId)
    );

    // 添加新记录到开头
    const updatedHistory = [newItem, ...filteredHistory];

    // 限制历史记录数量
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving watch history:', error);
  }
}

// 更新观看进度
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

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error updating watch progress:', error);
  }
}

// 移除观看历史记录
export function removeFromWatchHistory(animeId: number, episodeId: number): void {
  try {
    const currentHistory = getWatchHistory();
    const filteredHistory = currentHistory.filter(
      item => !(item.animeId === animeId && item.episodeId === episodeId)
    );

    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error removing from watch history:', error);
  }
}

// 清空观看历史
export function clearWatchHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
}

// 获取特定动漫的观看历史
export function getAnimeWatchHistory(animeId: number): WatchHistoryItem[] {
  const allHistory = getWatchHistory();
  return allHistory.filter(item => item.animeId === animeId);
}

// 获取最近观看的动漫（去重）
export function getRecentWatchedAnimes(limit: number = 10): WatchHistoryItem[] {
  const allHistory = getWatchHistory();
  const uniqueAnimes = new Map<number, WatchHistoryItem>();
  
  // 按时间倒序，保留每个动漫的最新记录
  allHistory.forEach(item => {
    if (!uniqueAnimes.has(item.animeId)) {
      uniqueAnimes.set(item.animeId, item);
    }
  });

  return Array.from(uniqueAnimes.values()).slice(0, limit);
}

// 检查是否观看过某个剧集
export function hasWatchedEpisode(animeId: number, episodeId: number): boolean {
  const history = getWatchHistory();
  return history.some(item => item.animeId === animeId && item.episodeId === episodeId);
}

// 获取动漫的观看进度
export function getAnimeProgress(animeId: number): {
  watchedEpisodes: number;
  lastWatchedEpisode?: WatchHistoryItem;
} {
  const animeHistory = getAnimeWatchHistory(animeId);
  const watchedEpisodes = animeHistory.length;
  const lastWatchedEpisode = animeHistory.length > 0 ? animeHistory[0] : undefined;

  return {
    watchedEpisodes,
    lastWatchedEpisode
  };
}