'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Play, Calendar, Star, Clock, Tag } from 'lucide-react';

export function AnimeDetailClient() {
  const params = useParams();
  const animeId = parseInt(params.id as string);
  
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimeDetail = async () => {
      if (isNaN(animeId)) {
        setError('ID de anime inválido');
        setLoading(false);
        return;
      }

      try {
        console.log('AnimeDetail: Loading anime', animeId);
        
        const response = await fetch(`/api/anime/detail/${animeId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('AnimeDetail: Response status', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('AnimeDetail: API response', result);
        
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
        
        // 确保数据存在
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid anime detail data received from API');
        }
        
        // Ensure we have anime data
        const animeData = data.anime || data;
        if (!animeData || !animeData.id) {
          throw new Error('No anime data found in API response');
        }
        
        const transformedAnime = {
          id: animeData.id,
          name: animeData.name || 'Unknown',
          nameAlternative: animeData.nameAlternative || '',
          slug: animeData.slug || '',
          imagen: animeData.imagen || '',
          imagenCapitulo: animeData.imagenCapitulo || animeData.imagen || '',
          type: animeData.type === 'movie' ? 'movie' : 'series',
          status: animeData.status || 'ongoing',
          genres: animeData.genres || '',
          rating: animeData.rating || '0',
          voteAverage: animeData.voteAverage || '',
          visitas: animeData.visitas || 0,
          overview: animeData.overview || '',
          aired: animeData.aired || '',
          createdAt: animeData.createdAt || '',
          lang: animeData.lang || 'sub',
          episodeCount: animeData.episodeCount || '',
          latestEpisode: animeData.latestEpisode || '',
          title: animeData.name || 'Unknown',
          description: animeData.overview || '',
          poster: animeData.imagen || '',
          banner: animeData.imagenCapitulo || animeData.imagen || '',
          year: animeData.aired ? (() => {
            try {
              return new Date(animeData.aired).getFullYear();
            } catch {
              return undefined;
            }
          })() : undefined,
          episodes: (data.episodes || []).map((ep: any) => ({
            ...ep,
            episodeNumber: ep.number || ep.episodeNumber,
            title: ep.title || `Episodio ${ep.number || ep.episodeNumber || 'N/A'}`
          })),
          totalEpisodes: data.totalEpisodes || data.currentEpisodes || 0,
        };
        
        console.log('AnimeDetail: Processed anime', transformedAnime);
        setAnime(transformedAnime);
        
      } catch (err) {
        console.error('AnimeDetail: Error loading anime', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadAnimeDetail();
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Loading skeleton */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-800 animate-pulse" />
        <div className="container-custom -mt-20 sm:-mt-24 md:-mt-32 relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] max-w-xs sm:max-w-sm mx-auto lg:mx-0 bg-gray-700 rounded-lg animate-pulse" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-20 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar anime</h1>
          <p className="text-gray-400 mb-6">{error || 'Anime no encontrado'}</p>
          <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {(anime.imagenCapitulo || anime.imagen) && (
          <Image
            src={anime.imagenCapitulo || anime.imagen}
            alt={anime.name || anime.nameAlternative || 'Anime'}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      <div className="container-custom -mt-20 sm:-mt-24 md:-mt-32 relative z-10 px-4">
        <Breadcrumbs
          items={[
            { 
              label: anime.type === 'series' ? 'Series' : 'Películas', 
              href: anime.type === 'series' ? '/series' : '/peliculas' 
            },
            { label: anime.name || anime.nameAlternative || 'Anime' }
          ]}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] max-w-xs sm:max-w-sm mx-auto lg:mx-0">
              <Image
                src={anime.imagen || '/placeholder-anime.jpg'}
                alt={anime.name || anime.nameAlternative || 'Anime'}
                fill
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                {anime.name || anime.nameAlternative || anime.title || 'Anime'}
              </h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm">
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                  <Tag className="h-4 w-4 mr-2" />
                  {anime.type === 'series' ? 'Serie' : 'Película'}
                </div>
                
                {anime.year && (
                  <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                    <Calendar className="h-4 w-4 mr-2" />
                    {anime.year}
                  </div>
                )}
                
                {anime.rating && (
                  <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    {anime.rating}
                  </div>
                )}
                
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    anime.status === 'completed' || anime.status === '1' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  {anime.status === 'completed' || anime.status === '1' ? 'Completo' : 'En emisión'}
                </div>
              </div>

              {/* Genres */}
              {anime.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(anime.genres) ? anime.genres : anime.genres.split(',')).map((genre: string, index: number) => (
                    <Link
                      key={`${genre}-${index}`}
                      href={`/series?genre=${encodeURIComponent(genre.trim())}`}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-full transition-colors duration-200 hover:scale-105 transform"
                      title={`Ver más anime de ${genre.trim()}`}
                    >
                      {genre.trim()}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {(anime.overview || anime.description) && (
                <p className="text-gray-300 leading-relaxed mb-6">
                  {anime.overview || anime.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {anime.episodes && anime.episodes.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {anime.type === 'series' ? 'Episodios' : 'Reproducir'}
              </h2>
              {anime.type === 'series' && (
                <div className="text-sm text-gray-400">
                  {anime.episodes.length} episodio{anime.episodes.length !== 1 ? 's' : ''}
                  {anime.totalEpisodes && anime.totalEpisodes > anime.episodes.length && (
                    <span> de {anime.totalEpisodes}</span>
                  )}
                </div>
              )}
            </div>
            
            {anime.type !== 'series' ? (
              // Movie: Single play button
              <div className="max-w-md">
                <Link
                  href={`/watch/${anime.episodes[0].id}`}
                  className="bg-primary-600 hover:bg-primary-700 rounded-lg p-6 flex items-center justify-center transition-colors group"
                >
                  <Play className="h-8 w-8 mr-3 text-white" />
                  <span className="text-xl font-semibold text-white">Ver Película</span>
                </Link>
              </div>
            ) : (
              // Series: Episode grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {anime.episodes
                  .sort((a: any, b: any) => (a.episodeNumber || a.number || 0) - (b.episodeNumber || b.number || 0))
                  .map((episode: any) => (
                  <Link
                    key={episode.id}
                    href={`/watch/${episode.id}`}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary-400">
                        EP {episode.episodeNumber || episode.number}
                      </span>
                      <Play className="h-5 w-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                    </div>
                    
                    {episode.title && episode.title !== anime.name && episode.title.trim() && (
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2 font-medium">
                        {episode.title}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {episode.duration && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {episode.duration}
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                          HD
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}