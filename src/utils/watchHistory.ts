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
  animeType?: string; // 动漫类型 (series/movie)
  totalEpisodes?: number; // 总集数
  watchedEpisodesCount?: number; // 已观看集数
  latestEpisodeNumber?: number; // 最新观看的集数
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
    
    // 解析总集数
    const totalEpisodes = anime.episodeCount ? parseInt(anime.episodeCount.toString()) : undefined;
    
    const newItem: WatchHistoryItem = {
      animeId: anime.id,
      animeTitle: anime.name,
      animePoster: anime.imagen || '',
      episodeId,
      episodeNumber,
      episodeTitle,
      watchedAt: new Date().toISOString(),
      progress,
      duration: '24min', // 默认时长，可以从API获取
      animeType: anime.type,
      totalEpisodes: totalEpisodes && !isNaN(totalEpisodes) ? totalEpisodes : undefined
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
  
  // 按时间倒序，保留每个动漫的最新记录，并计算观看进度
  allHistory.forEach(item => {
    if (!uniqueAnimes.has(item.animeId)) {
      // 计算该动漫的观看进度
      const animeHistory = allHistory.filter(h => h.animeId === item.animeId);
      const watchedEpisodesCount = animeHistory.length;
      const latestEpisodeNumber = Math.max(...animeHistory.map(h => h.episodeNumber));
      
      const enhancedItem: WatchHistoryItem = {
        ...item,
        watchedEpisodesCount,
        latestEpisodeNumber
      };
      
      uniqueAnimes.set(item.animeId, enhancedItem);
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

// 获取动漫的详细观看统计
export function getAnimeWatchStats(animeId: number): {
  watchedEpisodesCount: number;
  latestEpisodeNumber: number;
  totalEpisodes?: number;
  watchProgress?: number; // 观看进度百分比
  lastWatchedAt: string;
} | null {
  const animeHistory = getAnimeWatchHistory(animeId);
  
  if (animeHistory.length === 0) {
    return null;
  }

  const watchedEpisodesCount = animeHistory.length;
  const latestEpisodeNumber = Math.max(...animeHistory.map(h => h.episodeNumber));
  const lastWatchedItem = animeHistory[0]; // 最新的记录
  const totalEpisodes = lastWatchedItem.totalEpisodes;
  
  let watchProgress: number | undefined;
  if (totalEpisodes && totalEpisodes > 0) {
    watchProgress = Math.round((watchedEpisodesCount / totalEpisodes) * 100);
  }

  return {
    watchedEpisodesCount,
    latestEpisodeNumber,
    totalEpisodes,
    watchProgress,
    lastWatchedAt: lastWatchedItem.watchedAt
  };
}

// 格式化观看进度文本
export function formatWatchProgress(
  watchedCount: number, 
  totalEpisodes?: number, 
  latestEpisode?: number
): string {
  let progressText = `${watchedCount} episodio${watchedCount !== 1 ? 's' : ''} visto${watchedCount !== 1 ? 's' : ''}`;
  
  if (totalEpisodes && totalEpisodes > 0) {
    progressText += ` de ${totalEpisodes}`;
    const percentage = Math.round((watchedCount / totalEpisodes) * 100);
    progressText += ` (${percentage}%)`;
  }
  
  if (latestEpisode && latestEpisode > 0) {
    progressText += ` • Último: EP ${latestEpisode}`;
  }
  
  return progressText;
}