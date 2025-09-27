// Google Analytics配置
export const ANALYTICS_CONFIG = {
  // Google Analytics测量ID
  GA_MEASUREMENT_ID: 'G-HQJSYW0VHZ',
  
  // 是否启用Analytics（生产环境）
  ENABLED: import.meta.env.PROD,
  
  // 调试模式（开发环境）
  DEBUG: import.meta.env.DEV,
  
  // 自定义事件名称
  EVENTS: {
    // 页面浏览
    PAGE_VIEW: 'page_view',
    
    // 搜索相关
    SEARCH: 'search',
    SEARCH_RESULTS: 'search_results',
    
    // 动漫相关
    ANIME_VIEW: 'anime_view',
    EPISODE_PLAY: 'episode_play',
    
    // 筛选相关
    FILTER_USE: 'filter_use',
    GENRE_BROWSE: 'genre_browse',
    
    // 用户参与度
    ENGAGEMENT: 'engagement',
    
    // 错误跟踪
    ERROR: 'error',
    
    // 转换事件
    CONVERSION: 'conversion'
  },
  
  // 自定义参数
  PARAMETERS: {
    // 内容相关
    CONTENT_TYPE: 'content_type',
    CONTENT_ID: 'content_id',
    ANIME_TYPE: 'anime_type',
    EPISODE_NUMBER: 'episode_number',
    
    // 搜索相关
    SEARCH_TERM: 'search_term',
    SEARCH_RESULTS_COUNT: 'search_results_count',
    
    // 筛选相关
    FILTER_TYPE: 'filter_type',
    FILTER_VALUE: 'filter_value',
    
    // 用户行为
    ACTION: 'action',
    VALUE: 'value',
    CATEGORY: 'category',
    
    // 错误相关
    ERROR_MESSAGE: 'error_message',
    ERROR_PAGE: 'error_page',
    
    // 页面相关
    PAGE_TITLE: 'page_title',
    PAGE_LOCATION: 'page_location'
  }
};

// 预定义的转换事件
export const CONVERSION_EVENTS = {
  ANIME_WATCH_START: 'anime_watch_start',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  EPISODE_COMPLETED: 'episode_completed'
};

// 预定义的参与度事件
export const ENGAGEMENT_EVENTS = {
  VIDEO_LOADED: 'video_loaded',
  VIDEO_ERROR: 'video_error',
  HERO_CTA_CLICK: 'hero_cta_click',
  SECTION_VIEW_ALL_CLICK: 'section_view_all_click',
  PAGINATION_CLICK: 'pagination_click',
  HOME_CONTENT_LOADED: 'home_content_loaded'
};