'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import { Search } from 'lucide-react';

export const runtime = 'edge';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim();
  const page = parseInt(searchParams.get('page') || '1');

  const [animes, setAnimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 24,
    totalPages: 0
  });

  useEffect(() => {
    if (!query) return;

    const searchAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append('q', query);
        params.append('page', page.toString());
        params.append('size', '24');

        const queryString = params.toString();
        const apiUrl = `/api/anime/search${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // 处理API响应数据
        let data;
        if (result.result_code !== undefined) {
          if (result.result_code !== 200) {
            throw new Error(result.msg || 'API returned error');
          }
          data = result.data;
        } else if (result.msg !== undefined) {
          if (result.msg !== 'succeed') {
            throw new Error(result.msg || 'API returned error');
          }
          data = result.data;
        } else if (result.error) {
          throw new Error(result.error);
        } else {
          data = result;
        }

        let animeList = [];
        let totalCount = 0;

        if (data && data.list) {
          animeList = data.list;
          totalCount = data.pagination?.totalCount || 0;
        }

        const processedAnimes = animeList.map((anime: any) => ({
          id: anime.id,
          name: anime.name || 'Unknown',
          title: anime.name || 'Unknown',
          imagen: anime.imagen || '',
          poster: anime.imagen || '',
          type: anime.type === 'movie' ? 'movie' : 'series',
          status: anime.status || 'ongoing',
          genres: anime.genres || '',
          rating: anime.rating || '0',
          overview: anime.overview || '',
        }));

        setAnimes(processedAnimes);
        setPagination({
          total: totalCount,
          page: page,
          size: 24,
          totalPages: Math.ceil(totalCount / 24)
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading search results');
      } finally {
        setLoading(false);
      }
    };

    searchAnimes();
  }, [query, page]);

  if (!query) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Buscar Anime</h1>
          <p className="text-gray-400">
            Usa el buscador en la parte superior para encontrar tus animes favoritos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resultados de Búsqueda</h1>
      </div>

      {loading ? (
        <AnimeListSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Error en la búsqueda</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : animes.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
          <p className="text-gray-400">
            No encontramos animes que coincidan con "{query}". 
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-400">
              Se encontraron {pagination.total} resultados para "{query}"
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {animes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              basePath={`/buscar?q=${encodeURIComponent(query)}`}
            />
          )}
        </>
      )}
    </div>
  );
}