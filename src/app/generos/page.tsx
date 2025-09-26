'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeFilters } from '@/components/ui/AnimeFilters';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import Link from 'next/link';

export const runtime = 'edge';

// Anime genres based on actual API data
const animeGenres = [
  { name: 'Acción', slug: 'Accion', color: 'bg-red-600', count: '38+' },
  { name: 'Drama', slug: 'Drama', color: 'bg-purple-600', count: '35+' },
  { name: 'Sci-Fi', slug: 'Sci-Fi', color: 'bg-blue-600', count: '33+' },
  { name: 'Aventura', slug: 'Aventura', color: 'bg-green-600', count: '32+' },
  { name: 'Comedia', slug: 'Comedia', color: 'bg-yellow-600', count: '31+' },
  { name: 'Misterio', slug: 'Misterio', color: 'bg-indigo-600', count: '14+' },
  { name: 'Fantasía', slug: 'Fantasia', color: 'bg-pink-600', count: '14+' },
  { name: 'Ecchi', slug: 'Ecchi', color: 'bg-rose-600', count: '12+' },
  { name: 'Romance', slug: 'Romance', color: 'bg-rose-500', count: '11+' },
  { name: 'Sobrenatural', slug: 'Sobrenatural', color: 'bg-violet-600', count: '10+' },
  { name: 'Deportes', slug: 'Deportes', color: 'bg-orange-600', count: '5+' },
  { name: 'Música', slug: 'Musica', color: 'bg-cyan-600', count: '5+' },
  { name: 'Thriller', slug: 'Thriller', color: 'bg-gray-600', count: '5+' },
  { name: 'Terror', slug: 'Terror', color: 'bg-red-800', count: '3+' },
  { name: 'Mecha', slug: 'Mecha', color: 'bg-slate-600', count: '2+' },
  { name: 'Militar', slug: 'Militar', color: 'bg-amber-700', count: '2+' },
];

export default function GenresPage() {
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('genre');
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort');
  const lang = searchParams.get('lang');

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
    if (!selectedGenre) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (selectedGenre) params.append('genre', selectedGenre);
        if (sort) params.append('sort', sort);
        if (lang) params.append('lang', lang);
        params.append('size', '24');

        const queryString = params.toString();
        const apiUrl = `/api/anime/list${queryString ? `?${queryString}` : ''}`;

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
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedGenre, page, sort, lang]);

  if (selectedGenre) {
    // If a genre is selected, show anime list for that genre
    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/generos"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              ← Volver a géneros
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Anime de {animeGenres.find(g => g.slug === selectedGenre)?.name || selectedGenre}
          </h1>
          <p className="text-gray-400">
            Descubre los mejores animes del género {animeGenres.find(g => g.slug === selectedGenre)?.name || selectedGenre}
          </p>
        </div>

        {loading ? (
          <div>
            <AnimeFilters
              currentGenre={selectedGenre || undefined}
              currentSort={sort || 'latest'}
              currentLang={lang || undefined}
              basePath="/generos"
            />
            <AnimeListSkeleton />
          </div>
        ) : error ? (
          <div>
            <AnimeFilters
              currentGenre={selectedGenre || undefined}
              currentSort={sort || 'latest'}
              currentLang={lang || undefined}
              basePath="/generos"
            />
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Error al cargar contenido</h2>
              <p className="text-gray-400 mb-4">{error}</p>
            </div>
          </div>
        ) : (
          <div>
            <AnimeFilters
              currentGenre={selectedGenre || undefined}
              currentSort={sort || 'latest'}
              currentLang={lang || undefined}
              basePath="/generos"
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
                    basePath="/generos"
                    genre={selectedGenre || undefined}
                    sort={sort || undefined}
                    lang={lang || undefined}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No se encontraron animes con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Show genre selection page
  return (
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
            href="/peliculas"
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
            href="/series"
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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Explorar por Género</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeGenres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/generos?genre=${genre.slug}`}
              className={`${genre.color} rounded-lg p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="relative z-10">
                <h3 className="font-semibold text-white group-hover:text-gray-100 mb-1">
                  {genre.name}
                </h3>
                <p className="text-xs text-white/80 group-hover:text-white/90">
                  {genre.count} animes
                </p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">🚧 En Desarrollo</h3>
        <p className="text-gray-400 mb-4">
          El filtrado por género específico estará disponible próximamente.
        </p>
        <p className="text-gray-500 text-sm">
          Mientras tanto, puedes explorar todas las películas y series disponibles.
        </p>
      </div>
    </div>
  );
}