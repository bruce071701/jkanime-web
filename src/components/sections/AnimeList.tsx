'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeFilters } from '@/components/ui/AnimeFilters';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import { Anime } from '@/types/anime';

interface AnimeListProps {
  type?: 'movie' | 'series';
  page: number;
  genre?: string;
  sort?: 'latest' | 'popular' | 'rating';
  lang?: string;
  basePath: string;
}

export function AnimeList({ type, page, genre, sort, lang, basePath }: AnimeListProps) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 24,
    totalPages: 0
  });

  useEffect(() => {
    const loadAnimes = () => {
      setLoading(true);
      setError(null);
      
      // 直接调用生产环境API
      const searchParams = new URLSearchParams();
      if (type) {
        if (type === 'series') {
          searchParams.append('type', 'Serie');
        } else if (type === 'movie') {
          searchParams.append('type', 'movie');
        }
      }
      if (page) searchParams.append('page', page.toString());
      if (genre) searchParams.append('genre', genre);
      if (sort) searchParams.append('sort', sort);
      if (lang) searchParams.append('lang', lang);
      searchParams.append('size', '24');
      
      const queryString = searchParams.toString();
      const url = `https://api-jk.funnyu.xyz/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;
      
      fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          
          // 简单的数据处理
          const animes = (result.data?.list || []).map((anime: any) => ({
            id: anime.id,
            name: anime.name || 'Unknown',
            nameAlternative: anime.nameAlternative || '',
            slug: anime.slug || '',
            imagen: anime.imagen || '',
            imagenCapitulo: anime.imagenCapitulo || '',
            type: anime.type === 'movie' ? 'movie' : 'series',
            status: anime.status || 'ongoing',
            genres: anime.genres || '',
            rating: anime.rating || '0',
            voteAverage: anime.voteAverage || '',
            visitas: anime.visitas || 0,
            overview: anime.overview || '',
            aired: anime.aired || '',
            createdAt: anime.createdAt || '',
            lang: anime.lang || 'sub',
            episodeCount: anime.episodeCount || '',
            latestEpisode: anime.latestEpisode || '',
            // 兼容字段
            title: anime.name || 'Unknown',
            description: anime.overview || '',
            poster: anime.imagen || '',
            banner: anime.imagenCapitulo || anime.imagen || '',
            year: anime.aired ? (() => {
              try {
                return new Date(anime.aired).getFullYear();
              } catch {
                return undefined;
              }
            })() : undefined,
          }));
          
          const total = result.data?.pagination?.totalCount || 0;
          const size = result.data?.pagination?.pageSize || 24;
          const totalPages = Math.ceil(total / size);

          setAnimes(animes);
          setPagination({
            total,
            page,
            size,
            totalPages
          });
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadAnimes();
  }, [type, page, genre, sort, lang]);

  if (loading) {
    return (
      <div>
        <AnimeFilters
          currentGenre={genre}
          currentSort={sort || 'latest'}
          currentLang={lang}
          basePath={basePath}
        />
        <AnimeListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AnimeFilters
          currentGenre={genre}
          currentSort={sort || 'latest'}
          currentLang={lang}
          basePath={basePath}
        />
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">
            Error al cargar el contenido
          </p>
          <p className="text-gray-500 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <AnimeFilters
        currentGenre={genre}
        currentSort={sort || 'latest'}
        currentLang={lang}
        basePath={basePath}
      />



      {/* Results */}
      {animes.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {animes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              basePath={basePath}
              genre={genre}
              sort={sort}
              lang={lang}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No se encontraron {type === 'movie' ? 'películas' : 'series'} con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}