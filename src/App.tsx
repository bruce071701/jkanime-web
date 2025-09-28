import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { WatchPage } from './pages/WatchPage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { GenresPage } from './pages/GenresPage';
import { SearchPage } from './pages/SearchPage';
import { HistoryPage } from './pages/HistoryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AnalyticsMonitor } from './components/AnalyticsMonitor';
import { PrerenderedContent } from './components/PrerenderedContent';
import { trackPageView } from './utils/analytics';
import { warmupCache } from './utils/cache';

function App() {
  const location = useLocation();

  useEffect(() => {
    // 跟踪页面浏览
    trackPageView(location.pathname + location.search);
    
    // 预热缓存
    warmupCache();
    
    // 注册Service Worker
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }, [location]);

  return (
    <PrerenderedContent>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/watch/:episodeId" element={<WatchPage />} />
          <Route path="/peliculas" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/generos" element={<GenresPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/historial" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* Analytics组件 */}
        <AnalyticsMonitor />
        <AnalyticsDashboard />
      </Layout>
    </PrerenderedContent>
  );
}

export default App;