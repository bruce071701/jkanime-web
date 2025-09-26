'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { WatchHistory } from '@/components/sections/WatchHistory';
import { HomeData } from '@/types/anime';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function HomeContent() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadHomeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('HomeContent: Starting API call...');
        
        // 直接调用API，绕过复杂的转换逻辑
        const response = await fetch('/api/anime/home');
        console.log('HomeContent: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('HomeContent: Raw result:', result);
        
        // 简单的数据处理，确保包含所有必需字段
        const data = {
          latestMovies: (result.data?.latestMovies || []).map((anime: any) => ({
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
          })),
          latestSeries: (result.data?.latestSeries || []).map((anime: any) => ({
            id: anime.id,
            name: anime.name || 'Unknown',
            nameAlternative: anime.nameAlternative || '',
            slug: anime.slug || '',
            imagen: anime.imagen || '',
            imagenCapitulo: anime.imagenCapitulo || '',
            type: 'series',
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
          }))
        };
        
        console.log('HomeContent: Processed data:', data);
        
        if (isMounted) {
          console.log('HomeContent: Setting data...');
          setHomeData(data);
        }
      } catch (err) {
        console.error('HomeContent: Error occurred:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="space-y-16">
          {/* Loading skeleton for movies */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loading skeleton for series */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar el contenido</h1>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!homeData) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No hay contenido disponible</h1>
          <p className="text-gray-400">
            No se pudo cargar el contenido en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      {/* Watch History */}
      <WatchHistory />

      {/* Últimas Películas */}
      {homeData.latestMovies && homeData.latestMovies.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Últimas Películas</h2>
              <p className="text-gray-400">Descubre las películas más recientes</p>
            </div>
            <Link 
              href="/peliculas" 
              className="flex items-center text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Ver todas
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {homeData.latestMovies.slice(0, 18).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Últimas Series */}
      {homeData.latestSeries && homeData.latestSeries.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Últimas Series</h2>
              <p className="text-gray-400">Explora las series más populares</p>
            </div>
            <Link 
              href="/series" 
              className="flex items-center text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Ver todas
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {homeData.latestSeries.slice(0, 18).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}