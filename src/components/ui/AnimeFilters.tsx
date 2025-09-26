'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Removed apiClient import to avoid Edge Runtime issues
import { Filter, SortAsc, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimeFiltersProps {
  currentGenre?: string;
  currentSort: string;
  currentLang?: string;
  basePath: string;
}

function GenreFilter({ currentGenre, basePath, currentSort, currentLang }: AnimeFiltersProps) {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = () => {
      fetch('/api/anime/genres')
        .then(response => response.json())
        .then((result) => {
          // 处理API响应数据
          let data;
          if (result.result_code !== undefined) {
            if (result.result_code === 200) {
              data = result.data;
            }
          } else if (result.msg !== undefined) {
            if (result.msg === 'succeed') {
              data = result.data;
            }
          } else if (!result.error) {
            data = result;
          }
          
          if (data && Array.isArray(data)) {
            setGenres(data);
          } else {
            setGenres([]);
          }
        })
        .catch(() => {
          setGenres([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadGenres();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

    const buildGenreUrl = (genre?: string) => {
      const params = new URLSearchParams();
      if (genre) params.set('genre', genre);
      if (currentLang) params.set('lang', currentLang);
      params.set('sort', currentSort);
      return `${basePath}?${params.toString()}`;
    };

    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildGenreUrl()}
          className={cn(
            'px-3 py-1 rounded-full text-sm transition-colors',
            !currentGenre
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          )}
        >
          Todos
        </Link>
        
        {genres.slice(0, 10).map((genre) => (
          <Link
            key={genre.name}
            href={buildGenreUrl(genre.name)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              currentGenre === genre.name
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
          >
            {genre.name} ({genre.count})
          </Link>
        ))}
      </div>
    );
}

export function AnimeFilters({ currentGenre, currentSort, currentLang, basePath }: AnimeFiltersProps) {
  const sortOptions = [
    { value: 'latest', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
    { value: 'rating', label: 'Mejor valorados' }
  ];

  const languageOptions = [
    { value: '', label: 'Todos los idiomas', icon: '🌐' },
    { value: 'sub', label: 'Subtítulos', icon: '📝' },
    { value: 'castellano', label: 'Español (Doblado)', icon: '🎙️' },
    { value: 'latino', label: 'Latino (Doblado)', icon: '🎬' }
  ];

  const buildUrl = (sort?: string, lang?: string) => {
    const params = new URLSearchParams();
    if (currentGenre) params.set('genre', currentGenre);
    if (lang !== undefined) {
      if (lang) params.set('lang', lang);
    } else if (currentLang) {
      params.set('lang', currentLang);
    }
    params.set('sort', sort || currentSort);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-6 space-y-4">
      {/* Language Filter */}
      <div>
        <div className="flex items-center mb-2 md:mb-3">
          <Languages className="h-4 w-4 mr-2" />
          <span className="font-medium text-sm md:text-base">Idioma:</span>
        </div>
        
        <div className="flex flex-wrap gap-1 md:gap-2">
          {languageOptions.map((option) => (
            <Link
              key={option.value}
              href={buildUrl(undefined, option.value)}
              className={cn(
                'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors flex items-center gap-1',
                (currentLang || '') === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              <span>{option.icon}</span>
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <div className="flex items-center mb-3">
          <SortAsc className="h-4 w-4 mr-2" />
          <span className="font-medium">Ordenar por:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={buildUrl(option.value)}
              className={cn(
                'px-3 py-1 rounded-full text-sm transition-colors',
                currentSort === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <div className="flex items-center mb-3">
          <Filter className="h-4 w-4 mr-2" />
          <span className="font-medium">Géneros:</span>
        </div>
        
        <GenreFilter
          currentGenre={currentGenre}
          currentSort={currentSort}
          currentLang={currentLang}
          basePath={basePath}
        />
      </div>
    </div>
  );
}