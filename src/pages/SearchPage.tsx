import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiService } from '../services/api';
import { ListData, SearchParams } from '../types/api';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listData, setListData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const performSearch = async (searchTerm: string, page: number = 1) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const params: SearchParams = {
        q: searchTerm.trim(),
        page,
        size: 24
      };
      
      const data = await apiService.searchAnime(params);
      setListData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setListData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, currentPage);
    }
  }, [query, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams();
      newParams.set('q', searchQuery.trim());
      setSearchParams(newParams);
    }
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Buscar Anime</h1>
          <p className="text-gray-400 mb-6">
            Encuentra tu anime favorito por nombre, género o descripción
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <LoadingSpinner size="lg" text="Buscando anime..." />
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => query && performSearch(query, currentPage)}
          />
        )}

        {!loading && !error && query && (
          <>
            {listData && listData.list.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Resultados para "{query}"
                  </h2>
                  <p className="text-gray-400">
                    Encontrados {listData.pagination.total} resultados
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
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  No se encontraron resultados
                </h2>
                <p className="text-gray-400 mb-6">
                  No se encontraron animes que coincidan con "{query}".
                  Intenta con otros términos de búsqueda.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Sugerencias:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Verifica la ortografía</li>
                    <li>• Usa términos más generales</li>
                    <li>• Prueba con el nombre en japonés o inglés</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {!query && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Busca tu anime favorito
            </h2>
            <p className="text-gray-400">
              Ingresa el nombre del anime que quieres encontrar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}