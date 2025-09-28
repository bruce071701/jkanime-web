// 性能监控工具

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
    this.measureCoreWebVitals();
  }

  private initializeObserver() {
    if (!('PerformanceObserver' in window)) return;

    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processEntry(entry);
      }
    });

    // 观察不同类型的性能条目
    try {
      this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  private processEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.handlePaintEntry(entry as PerformancePaintTiming);
        break;
      case 'largest-contentful-paint':
        this.handleLCPEntry(entry as any);
        break;
      case 'first-input':
        this.handleFIDEntry(entry as any);
        break;
      case 'layout-shift':
        this.handleCLSEntry(entry as any);
        break;
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming) {
    this.metrics.ttfb = entry.responseStart - entry.requestStart;
  }

  private handlePaintEntry(entry: PerformancePaintTiming) {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.fcp = entry.startTime;
    }
  }

  private handleLCPEntry(entry: any) {
    this.metrics.lcp = entry.startTime;
  }

  private handleFIDEntry(entry: any) {
    this.metrics.fid = entry.processingStart - entry.startTime;
  }

  private handleCLSEntry(entry: any) {
    if (!entry.hadRecentInput) {
      this.metrics.cls = (this.metrics.cls || 0) + entry.value;
    }
  }

  private measureCoreWebVitals() {
    // 使用 web-vitals 库的逻辑
    if ('PerformanceObserver' in window) {
      // FCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          this.reportMetric('FCP', fcpEntry.startTime);
        }
      }).observe({ entryTypes: ['paint'] });

      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.fid = fid;
          this.reportMetric('FID', fid);
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.reportMetric('CLS', clsValue);
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  private reportMetric(name: string, value: number) {
    // 发送到 Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true
      });
    }

    // 发送到自定义分析服务
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(metric: string, value: number) {
    // 可以发送到自定义分析服务
    console.log(`Performance metric - ${metric}: ${value}ms`);
    
    // 示例：发送到自定义API
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ metric, value, timestamp: Date.now() })
    // }).catch(console.error);
  }

  // 获取当前性能指标
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // 测量自定义指标
  measureCustomMetric(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    this.reportMetric(name, duration);
    return duration;
  }

  // 测量资源加载时间
  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceMetrics = resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: this.getResourceType(resource.name)
    }));

    // 按类型分组统计
    const stats = resourceMetrics.reduce((acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = { count: 0, totalDuration: 0, totalSize: 0 };
      }
      acc[resource.type].count++;
      acc[resource.type].totalDuration += resource.duration;
      acc[resource.type].totalSize += resource.size;
      return acc;
    }, {} as Record<string, any>);

    console.log('Resource loading stats:', stats);
    return stats;
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  // 清理观察器
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 性能预算检查
export const performanceBudget = {
  fcp: 1800, // 1.8s
  lcp: 2500, // 2.5s
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1
  ttfb: 600  // 600ms
};

export function checkPerformanceBudget(metrics: Partial<PerformanceMetrics>): boolean {
  const violations: string[] = [];
  
  Object.entries(performanceBudget).forEach(([metric, budget]) => {
    const value = metrics[metric as keyof PerformanceMetrics];
    if (value && value > budget) {
      violations.push(`${metric}: ${value} > ${budget}`);
    }
  });

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
    return false;
  }

  return true;
}

// 页面加载性能测量
export function measurePageLoad(): Promise<PerformanceNavigationTiming> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming);
    } else {
      window.addEventListener('load', () => {
        resolve(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming);
      });
    }
  });
}