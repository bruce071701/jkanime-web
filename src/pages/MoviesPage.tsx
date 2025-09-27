import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { ListData, ListParams } from '../types/api';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import { AnimeFilters } from '../components/AnimeFilters';

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listData, setListData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const selectedGenre = searchParams.get('genre') || '';
  const selectedLang = searchParams.get('lang') || '';
  const sort = (searchParams.get('sort') as 'latest' | 'popular' | 'rating') || 'latest';

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListParams = {
        page: currentPage,
        size: 24,
        type: 'movie',
        ...(selectedGenre && { genre: selectedGenre }),
        ...(selectedLang && { lang: selectedLang }),
        sort
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
    loadMovies();
  }, [currentPage, selectedGenre, selectedLang, sort]);

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

  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set('sort', 'latest');
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Películas de Anime</h1>
          <LoadingSpinner size="lg" text="Cargando películas..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Películas de Anime</h1>
          <ErrorMessage message={error} onRetry={loadMovies} />
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Películas de Anime</h1>
          <ErrorMessage 
            title="No hay contenido disponible"
            message="No se pudieron cargar las películas en este momento."
            onRetry={loadMovies}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Películas de Anime</h1>
          <p className="text-gray-400">
            Explora las mejores películas anime con subtítulos en español
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

        {listData.list.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Mostrando {listData.list.length} de {listData.pagination.total} películas
                {listData.pagination.totalPages > 1 && (
                  <span> - Página {listData.pagination.page} de {listData.pagination.totalPages}</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {listData.list.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
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
              No se encontraron películas con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}