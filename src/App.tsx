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
import { trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    // 跟踪页面浏览
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
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
  );
}

export default App;