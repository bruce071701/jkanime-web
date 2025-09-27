import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { apiService } from '../services/api';
import { HomeData } from '../types/api';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { WatchHistory } from '../components/WatchHistory';

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHomeData();
      setHomeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando contenido..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadHomeData} />
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          title="No hay contenido disponible"
          message="No se pudo cargar el contenido en este momento."
          onRetry={loadHomeData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bienvenido a <span className="text-blue-400">JKAnime</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Ver anime online gratis en HD. La mejor plataforma para disfrutar 
              series y películas anime con subtítulos en español.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/series" className="btn-primary flex items-center justify-center">
                <Play className="h-5 w-5 mr-2" />
                Ver Series
              </Link>
              <Link to="/peliculas" className="btn-secondary flex items-center justify-center">
                Ver Películas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-16">
        {/* Watch History */}
        <section className="mb-16">
          <WatchHistory limit={8} />
        </section>

        {/* Últimas Películas */}
        {homeData.latestMovies && homeData.latestMovies.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Últimas Películas</h2>
                <p className="text-gray-400">Descubre las películas más recientes</p>
              </div>
              <Link 
                to="/peliculas" 
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Ver todas
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {homeData.latestMovies.slice(0, 18).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* Últimas Series */}
        {homeData.latestSeries && homeData.latestSeries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Últimas Series</h2>
                <p className="text-gray-400">Explora las series más populares</p>
              </div>
              <Link 
                to="/series" 
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Ver todas
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {homeData.latestSeries.slice(0, 18).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} showEpisodeCount />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}