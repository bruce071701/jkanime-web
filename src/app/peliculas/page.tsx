'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeFilters } from '@/components/ui/AnimeFilters';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';

export const runtime = 'edge';

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');
  const lang = searchParams.get('lang');

  const [animes, setAnimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 24,
    totalPages: 0
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append('type', 'movie');
        if (page) params.append('page', page.toString());
        if (genre) params.append('genre', genre);
        if (sort) params.append('sort', sort);
        if (lang) params.append('lang', lang);
        params.append('size', '24');

        const queryString = params.toString();
        const apiUrl = `https://api-jk.funnyu.xyz/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        let animeList = [];
        let totalCount = 0;

        if (data.data && data.data.list) {
          animeList = data.data.list;
          totalCount = data.data.pagination?.totalCount || 0;
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
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, genre, sort, lang]);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Películas de Anime</h1>
        <p className="text-gray-400">
          Descubre las mejores películas de anime con subtítulos en español
        </p>
      </div>

      {loading ? (
        <div>
          <AnimeFilters
            currentGenre={genre || undefined}
            currentSort={sort || 'latest'}
            currentLang={lang || undefined}
            basePath="/peliculas"
          />
          <AnimeListSkeleton />
        </div>
      ) : error ? (
        <div>
          <AnimeFilters
            currentGenre={genre || undefined}
            currentSort={sort || 'latest'}
            currentLang={lang || undefined}
            basePath="/peliculas"
          />
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Error al cargar contenido</h2>
            <p className="text-gray-400 mb-4">{error}</p>
          </div>
        </div>
      ) : (
        <div>
          <AnimeFilters
            currentGenre={genre || undefined}
            currentSort={sort || 'latest'}
            currentLang={lang || undefined}
            basePath="/peliculas"
          />

          {animes.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {animes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  basePath="/peliculas"
                  genre={genre || undefined}
                  sort={sort || undefined}
                  lang={lang || undefined}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron películas con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}