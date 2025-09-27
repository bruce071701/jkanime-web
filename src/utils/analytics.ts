// Google Analytics 工具函数
import { ANALYTICS_CONFIG, CONVERSION_EVENTS, ENGAGEMENT_EVENTS } from '../config/analytics';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// 检查GA是否已加载
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && ANALYTICS_CONFIG.ENABLED;
};

// 调试日志
const debugLog = (event: string, parameters?: Record<string, any>) => {
  if (ANALYTICS_CONFIG.DEBUG) {
    console.log(`[Analytics] ${event}`, parameters);
  }
};

// 页面浏览事件
export const trackPageView = (url: string, title?: string): void => {
  if (!isGALoaded()) return;
  
  debugLog(ANALYTICS_CONFIG.EVENTS.PAGE_VIEW, { url, title });
  
  window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title
  });
};

// 搜索事件
export const trackSearch = (searchTerm: string, resultsCount?: number): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    [ANALYTICS_CONFIG.PARAMETERS.SEARCH_TERM]: searchTerm,
    [ANALYTICS_CONFIG.PARAMETERS.SEARCH_RESULTS_COUNT]: resultsCount
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.SEARCH, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.SEARCH, parameters);
};

// 动漫观看事件
export const trackAnimeView = (animeId: number, animeName: string, animeType: string, source?: string): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    [ANALYTICS_CONFIG.PARAMETERS.CONTENT_ID]: animeId.toString(),
    item_name: animeName,
    item_category: animeType,
    [ANALYTICS_CONFIG.PARAMETERS.CONTENT_TYPE]: 'anime',
    source: source || 'unknown'
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.ANIME_VIEW, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.ANIME_VIEW, parameters);
};

// 剧集播放事件
export const trackEpisodePlay = (
  animeId: number, 
  animeName: string, 
  episodeId: number, 
  episodeNumber: number,
  server: string
): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    anime_id: animeId.toString(),
    anime_name: animeName,
    episode_id: episodeId.toString(),
    [ANALYTICS_CONFIG.PARAMETERS.EPISODE_NUMBER]: episodeNumber,
    video_server: server,
    [ANALYTICS_CONFIG.PARAMETERS.CONTENT_TYPE]: 'episode'
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.EPISODE_PLAY, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.EPISODE_PLAY, parameters);
};

// 筛选使用事件
export const trackFilter = (filterType: string, filterValue: string, page: string): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    [ANALYTICS_CONFIG.PARAMETERS.FILTER_TYPE]: filterType,
    [ANALYTICS_CONFIG.PARAMETERS.FILTER_VALUE]: filterValue,
    [ANALYTICS_CONFIG.PARAMETERS.PAGE_LOCATION]: page
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.FILTER_USE, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.FILTER_USE, parameters);
};

// 分类浏览事件
export const trackGenreView = (genre: string): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    item_list_name: `Genre: ${genre}`,
    [ANALYTICS_CONFIG.PARAMETERS.CONTENT_TYPE]: 'genre_page',
    [ANALYTICS_CONFIG.PARAMETERS.CATEGORY]: genre
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.GENRE_BROWSE, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.GENRE_BROWSE, parameters);
};

// 语言筛选事件
export const trackLanguageFilter = (language: string, contentType: string): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', 'language_filter', {
    language: language,
    content_type: contentType
  });
};

// 用户参与度事件
export const trackEngagement = (eventName: string, parameters?: Record<string, any>): void => {
  if (!isGALoaded()) return;
  
  const eventParameters = {
    engagement_time_msec: Date.now(),
    ...parameters
  };
  
  debugLog(`${ANALYTICS_CONFIG.EVENTS.ENGAGEMENT}_${eventName}`, eventParameters);
  
  window.gtag('event', eventName, eventParameters);
};

// 错误跟踪
export const trackError = (error: string, page: string): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    [ANALYTICS_CONFIG.PARAMETERS.ERROR_MESSAGE]: error,
    fatal: false,
    [ANALYTICS_CONFIG.PARAMETERS.ERROR_PAGE]: page
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.ERROR, parameters);
  
  window.gtag('event', 'exception', parameters);
};

// 转换事件（用户完成重要操作）
export const trackConversion = (action: string, value?: number): void => {
  if (!isGALoaded()) return;
  
  const parameters = {
    [ANALYTICS_CONFIG.PARAMETERS.ACTION]: action,
    [ANALYTICS_CONFIG.PARAMETERS.VALUE]: value
  };
  
  debugLog(ANALYTICS_CONFIG.EVENTS.CONVERSION, parameters);
  
  window.gtag('event', ANALYTICS_CONFIG.EVENTS.CONVERSION, parameters);
};