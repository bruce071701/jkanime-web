'use client';

import { useState, useEffect } from 'react';
// Removed apiClient import to avoid Edge Runtime issues
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
  console.log('AnimeList: Component mounted with props:', { type, page, genre, sort, lang, basePath });
  
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
    const loadAnimes = async () => {
      console.log('AnimeList: Starting to load animes', { type, page, genre, sort, lang });
      setLoading(true);
      setError(null);
      
      try {
        // 直接调用外部API，避免依赖问题
        const params = new URLSearchParams();
        if (type) {
          if (type === 'series') {
            params.append('type', 'Serie');
          } else if (type === 'movie') {
            params.append('type', 'movie');
          }
        }
        if (page) params.append('page', page.toString());
        if (genre) params.append('genre', genre);
        if (sort) params.append('sort', sort);
        if (lang) params.append('lang', lang);
        params.append('size', '24');

        const queryString = params.toString();
        const apiUrl = `https://api-jk.funnyu.xyz/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;

        console.log('AnimeList: Fetching from URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('AnimeList: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('AnimeList: API response:', data);
        
        let animeList = [];
        let totalCount = 0;

        if (data.data && data.data.list) {
          animeList = data.data.list;
          totalCount = data.data.pagination?.totalCount || 0;
        }

        const processedAnimes = animeList.map((anime: any) => ({
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

        setAnimes(processedAnimes);
        setPagination({
          total: totalCount,
          page: page,
          size: 24,
          totalPages: Math.ceil(totalCount / 24)
        });
      } catch (err) {
        console.error('AnimeList: Error loading animes:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    // 添加延迟确保组件完全挂载
    const timer = setTimeout(() => {
      loadAnimes();
    }, 100);

    return () => clearTimeout(timer);
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