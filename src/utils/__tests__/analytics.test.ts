// Analytics测试文件
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  trackPageView, 
  trackSearch, 
  trackAnimeView, 
  trackEpisodePlay,
  trackFilter,
  trackGenreView,
  trackEngagement,
  trackError,
  trackConversion
} from '../analytics';

// Mock window.gtag
const mockGtag = vi.fn();

beforeEach(() => {
  // 重置mock
  mockGtag.mockClear();
  
  // 设置window.gtag
  Object.defineProperty(window, 'gtag', {
    value: mockGtag,
    writable: true
  });
  
  // 模拟生产环境
  vi.stubEnv('PROD', true);
});

describe('Analytics Utils', () => {
  it('should track page view', () => {
    trackPageView('/test-page', 'Test Page');
    
    expect(mockGtag).toHaveBeenCalledWith('config', 'G-HQJSYW0VHZ', {
      page_path: '/test-page',
      page_title: 'Test Page'
    });
  });

  it('should track search', () => {
    trackSearch('naruto', 10);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
      search_term: 'naruto',
      search_results_count: 10
    });
  });

  it('should track anime view', () => {
    trackAnimeView(123, 'Naruto', 'series', '/home');
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'anime_view', {
      content_id: '123',
      item_name: 'Naruto',
      item_category: 'series',
      content_type: 'anime',
      source: '/home'
    });
  });

  it('should track episode play', () => {
    trackEpisodePlay(123, 'Naruto', 456, 1, 'server1');
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'episode_play', {
      anime_id: '123',
      anime_name: 'Naruto',
      episode_id: '456',
      episode_number: 1,
      video_server: 'server1',
      content_type: 'episode'
    });
  });

  it('should track filter usage', () => {
    trackFilter('genre', 'action', '/series');
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'filter_use', {
      filter_type: 'genre',
      filter_value: 'action',
      page_location: '/series'
    });
  });

  it('should track genre view', () => {
    trackGenreView('action');
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'genre_browse', {
      item_list_name: 'Genre: action',
      content_type: 'genre_page',
      category: 'action'
    });
  });

  it('should track engagement', () => {
    trackEngagement('video_loaded', { server: 'server1' });
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'video_loaded', 
      expect.objectContaining({
        engagement_time_msec: expect.any(Number),
        server: 'server1'
      })
    );
  });

  it('should track errors', () => {
    trackError('Test error', '/test-page');
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
      error_message: 'Test error',
      fatal: false,
      error_page: '/test-page'
    });
  });

  it('should track conversions', () => {
    trackConversion('anime_watch_start', 1);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
      action: 'anime_watch_start',
      value: 1
    });
  });

  it('should not track when gtag is not available', () => {
    // 移除gtag
    delete (window as any).gtag;
    
    trackPageView('/test');
    
    expect(mockGtag).not.toHaveBeenCalled();
  });
});