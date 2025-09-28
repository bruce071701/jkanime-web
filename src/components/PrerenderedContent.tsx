import { useEffect, useState } from 'react';

interface PrerenderedContentProps {
  children: React.ReactNode;
}

export function PrerenderedContent({ children }: PrerenderedContentProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 标记为已水合
    setIsHydrated(true);
    
    // 隐藏预渲染内容
    const prerenderedElement = document.getElementById('prerendered-content');
    if (prerenderedElement) {
      prerenderedElement.style.display = 'none';
    }
    
    // 检查是否有预加载数据
    const preloadedData = (window as any).__PRELOADED_DATA__;
    if (preloadedData) {
      // 可以在这里将预加载数据注入到状态管理中
      console.log('Preloaded data available:', preloadedData);
    }
  }, []);

  // 在服务端渲染或首次加载时显示加载状态
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando JKAnime FLV...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook para使用预加载数据
export function usePreloadedData<T = any>(): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const preloadedData = (window as any).__PRELOADED_DATA__;
    if (preloadedData) {
      setData(preloadedData);
      // 清理全局数据
      delete (window as any).__PRELOADED_DATA__;
    }
  }, []);

  return data;
}