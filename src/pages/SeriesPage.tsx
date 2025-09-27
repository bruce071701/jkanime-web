import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { ListData, ListParams } from '../types/api';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import { AnimeFilters } from '../components/AnimeFilters';

export function SeriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listData, setListData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const selectedGenre = searchParams.get('genre') || '';
  const selectedLang = searchParams.get('lang') || '';
  const sort = (searchParams.get('sort') as 'latest' | 'popular' | 'rating') || 'latest';
  const status = (searchParams.get('status') as 'ongoing' | 'completed') || undefined;

  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListParams = {
        page: currentPage,
        size: 24,
        type: 'series',
        ...(selectedGenre && { genre: selectedGenre }),
        ...(selectedLang && { lang: selectedLang }),
        sort,
        status
      };
      
      const data = await apiService.getAnimeList(params);
      setListData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, [currentPage, selectedGenre, selectedLang, sort, status]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleGenreChange = (genre: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (genre) {
      newParams.set('genre', genre);
    } else {
      newParams.delete('genre');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleLangChange = (lang: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (lang) {
      newParams.set('lang', lang);
    } else {
      newParams.delete('lang');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleStatusChange = (newStatus: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newStatus) {
      newParams.set('status', newStatus);
    } else {
      newParams.delete('status');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set('sort', 'latest');
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Series de Anime</h1>
          <LoadingSpinner size="lg" text="Cargando series..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Series de Anime</h1>
          <ErrorMessage message={error} onRetry={loadSeries} />
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Series de Anime</h1>
          <ErrorMessage 
            title="No hay contenido disponible"
            message="No se pudieron cargar las series en este momento."
            onRetry={loadSeries}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Series de Anime</h1>
          <p className="text-gray-400">
            Explora las mejores series anime con subtítulos en español
          </p>
        </div>

        <AnimeFilters
          selectedGenre={selectedGenre}
          selectedLang={selectedLang}
          selectedSort={sort}
          onGenreChange={handleGenreChange}
          onLangChange={handleLangChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />

        {/* Additional Series-specific filters */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Estado:</label>
              <select
                value={status || ''}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="ongoing">En emisión</option>
                <option value="completed">Completas</option>
              </select>
            </div>
            {status && (
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {status === 'ongoing' ? 'En emisión' : 'Completas'}
                <button
                  onClick={() => handleStatusChange('')}
                  className="hover:bg-orange-700 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {listData.list.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Mostrando {listData.list.length} de {listData.pagination.total} series
                {listData.pagination.totalPages > 1 && (
                  <span> - Página {listData.pagination.page} de {listData.pagination.totalPages}</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {listData.list.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} showEpisodeCount />
              ))}
            </div>

            <Pagination
              currentPage={listData.pagination.page}
              totalPages={listData.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No se encontraron series con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}