import { useEffect } from 'react';
import { trackEngagement } from '../utils/analytics';

export function AnalyticsMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    const trackPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const firstPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint');
          const firstContentfulPaint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
          
          // 跟踪性能指标
          trackEngagement('page_performance', {
            load_time: Math.round(loadTime),
            dom_content_loaded: Math.round(domContentLoaded),
            first_paint: firstPaint ? Math.round(firstPaint.startTime) : undefined,
            first_contentful_paint: firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : undefined,
            connection_type: (navigator as any).connection?.effectiveType || 'unknown'
          });
        }
      }
    };

    // 监控用户会话时长
    const trackSessionTime = () => {
      const sessionStart = Date.now();
      
      const handleBeforeUnload = () => {
        const sessionDuration = Date.now() - sessionStart;
        trackEngagement('session_duration', {
          duration_ms: sessionDuration,
          duration_minutes: Math.round(sessionDuration / 60000)
        });
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    // 监控用户活跃度
    const trackUserActivity = () => {
      let lastActivity = Date.now();
      let isActive = true;
      
      const updateActivity = () => {
        lastActivity = Date.now();
        if (!isActive) {
          isActive = true;
          trackEngagement('user_active', {
            timestamp: lastActivity
          });
        }
      };

      const checkInactivity = () => {
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        
        // 如果用户5分钟没有活动，标记为不活跃
        if (inactiveTime > 5 * 60 * 1000 && isActive) {
          isActive = false;
          trackEngagement('user_inactive', {
            inactive_duration: inactiveTime,
            timestamp: now
          });
        }
      };

      // 监听用户活动事件
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
      });

      // 每分钟检查一次不活跃状态
      const inactivityInterval = setInterval(checkInactivity, 60000);

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity);
        });
        clearInterval(inactivityInterval);
      };
    };

    // 监控网络状态
    const trackNetworkStatus = () => {
      const handleOnline = () => {
        trackEngagement('network_status', {
          status: 'online',
          timestamp: Date.now()
        });
      };

      const handleOffline = () => {
        trackEngagement('network_status', {
          status: 'offline',
          timestamp: Date.now()
        });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    };

    // 延迟执行性能跟踪，确保页面完全加载
    const performanceTimer = setTimeout(trackPerformance, 1000);
    
    const cleanupSession = trackSessionTime();
    const cleanupActivity = trackUserActivity();
    const cleanupNetwork = trackNetworkStatus();

    return () => {
      clearTimeout(performanceTimer);
      cleanupSession();
      cleanupActivity();
      cleanupNetwork();
    };
  }, []);

  // 这个组件不渲染任何内容
  return null;
}