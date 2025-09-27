import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { GenreStats, ListData, ListParams } from '../types/api';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import { AnimeFilters } from '../components/AnimeFilters';

export function GenresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<GenreStats[]>([]);
  const [listData, setListData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedGenre = searchParams.get('genre') || '';
  const selectedLang = searchParams.get('lang') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sort = (searchParams.get('sort') as 'latest' | 'popular' | 'rating') || 'latest';

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getGenres();
      setGenres(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const loadGenreAnimes = async (genre: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListParams = {
        page: currentPage,
        size: 24,
        genre,
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
    if (selectedGenre) {
      loadGenreAnimes(selectedGenre);
    } else {
      loadGenres();
    }
  }, [selectedGenre, selectedLang, currentPage, sort]);

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
    if (selectedGenre) {
      newParams.set('genre', selectedGenre);
    }
    newParams.set('sort', 'latest');
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Géneros de Anime</h1>
          <LoadingSpinner size="lg" text="Cargando géneros..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Géneros de Anime</h1>
          <ErrorMessage message={error} onRetry={selectedGenre ? () => loadGenreAnimes(selectedGenre) : loadGenres} />
        </div>
      </div>
    );
  }

  if (selectedGenre && listData) {
    // Show anime list for selected genre
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/generos"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Volver a géneros
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Anime de {selectedGenre}
            </h1>
            <p className="text-gray-400">
              Descubre los mejores animes del género {selectedGenre}
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
            showGenreFilter={false} // No mostrar selector de género ya que estamos en una página de género específico
          />

          {listData.list.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-400">
                  Mostrando {listData.list.length} de {listData.pagination.total} animes
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
                No se encontraron animes con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show genre grid
  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Géneros de Anime</h1>
          <p className="text-gray-400">
            Explora animes por género y encuentra tu próxima serie favorita
          </p>
        </div>

        {/* Quick Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Categorías Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/peliculas"
              className="group bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">🎬 Películas</h3>
                  <p className="text-red-100">Largometrajes y especiales</p>
                </div>
                <div className="text-3xl group-hover:scale-110 transition-transform">
                  →
                </div>
              </div>
            </Link>

            <Link 
              to="/series"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">📺 Series</h3>
                  <p className="text-blue-100">Series y temporadas completas</p>
                </div>
                <div className="text-3xl group-hover:scale-110 transition-transform">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Genre Grid */}
        {genres.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">Todos los Géneros</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genres.map((genre) => (
                <Link
                  key={genre.genre}
                  to={`/generos?genre=${encodeURIComponent(genre.genre)}`}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:from-blue-800 hover:to-blue-900 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-blue-500"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors mb-2">
                      {genre.genre}
                    </h3>
                    <div className="text-gray-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm">{genre.count} animes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No se pudieron cargar los géneros en este momento.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Haz clic en cualquier género para ver los animes disponibles
          </p>
        </div>
      </div>
    </div>
  );
}