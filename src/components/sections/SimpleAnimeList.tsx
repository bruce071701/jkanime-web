'use client';

import { useState, useEffect } from 'react';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeFilters } from '@/components/ui/AnimeFilters';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';

interface SimpleAnimeListProps {
  type?: 'movie' | 'series';
  page: number;
  genre?: string;
  sort?: string;
  lang?: string;
  basePath: string;
}

export function SimpleAnimeList({ type, page, genre, sort, lang, basePath }: SimpleAnimeListProps) {
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
      console.log('SimpleAnimeList: Loading data for', { type, page, genre, sort, lang });
      setLoading(true);
      setError(null);

      try {
        // 构建查询参数
        const params = new URLSearchParams();
        if (type === 'series') {
          params.append('type', 'Serie');
        } else if (type === 'movie') {
          params.append('type', 'movie');
        }
        if (page) params.append('page', page.toString());
        if (genre) params.append('genre', genre);
        if (sort) params.append('sort', sort);
        if (lang) params.append('lang', lang);
        params.append('size', '24');

        const queryString = params.toString();
        const apiUrl = `https://api-jk.funnyu.xyz/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;
        
        console.log('SimpleAnimeList: Fetching from', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('SimpleAnimeList: Response status', response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('SimpleAnimeList: Received data', data);

        // 处理响应数据
        let animeList = [];
        let totalCount = 0;

        if (data.data && data.data.list) {
          animeList = data.data.list;
          totalCount = data.data.pagination?.totalCount || 0;
        } else if (data.list) {
          animeList = data.list;
          totalCount = data.pagination?.totalCount || 0;
        } else if (Array.isArray(data)) {
          animeList = data;
          totalCount = data.length;
        }

        // 转换数据格式
        const processedAnimes = animeList.map((anime: any) => ({
          id: anime.id,
          name: anime.name || 'Unknown',
          title: anime.name || anime.title || 'Unknown',
          imagen: anime.imagen || '',
          poster: anime.imagen || '',
          type: anime.type === 'movie' ? 'movie' : 'series',
          status: anime.status || 'ongoing',
          genres: anime.genres || '',
          rating: anime.rating || '0',
          overview: anime.overview || '',
          year: anime.aired ? new Date(anime.aired).getFullYear() : undefined,
        }));

        console.log('SimpleAnimeList: Processed', processedAnimes.length, 'animes');

        setAnimes(processedAnimes);
        setPagination({
          total: totalCount,
          page: page,
          size: 24,
          totalPages: Math.ceil(totalCount / 24)
        });

      } catch (err) {
        console.error('SimpleAnimeList: Error loading data', err);
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    // 延迟执行确保组件完全挂载
    const timer = setTimeout(loadData, 100);
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
          <h2 className="text-xl font-semibold mb-4">Error al cargar contenido</h2>
          <p className="text-gray-400 mb-4">{error}</p>
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
      <AnimeFilters
        currentGenre={genre}
        currentSort={sort || 'latest'}
        currentLang={lang}
        basePath={basePath}
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