'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Play, X, Trash2, Calendar } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory, clearWatchHistory, WatchHistoryItem } from '@/lib/watch-history';

export default function HistorialPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'series' | 'movie'>('all');

  const loadHistory = () => {
    const allHistory = getWatchHistory();
    setHistory(allHistory);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRemoveItem = (animeId: number, episodeId: number) => {
    removeFromWatchHistory(animeId, episodeId);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial de reproducción?')) {
      clearWatchHistory();
      loadHistory();
    }
  };

  const formatWatchedTime = (watchedAt: string) => {
    const date = new Date(watchedAt);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.animeType === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container-custom py-8">
          <div className="flex items-center mb-8">
            <Clock className="h-8 w-8 mr-3 text-primary-500" />
            <h1 className="text-3xl font-bold">Historial de Reproducción</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Clock className="h-8 w-8 mr-3 text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold">Historial de Reproducción</h1>
              <p className="text-gray-400 mt-1">
                {filteredHistory.length} elemento{filteredHistory.length !== 1 ? 's' : ''} en tu historial
              </p>
            </div>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar todo
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No hay historial</h2>
            <p className="text-gray-400 mb-6">
              Cuando veas anime, aparecerá aquí para que puedas continuar donde lo dejaste.
            </p>
            <Link
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded transition-colors"
            >
              Explorar anime
            </Link>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-400">Filtrar por:</span>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'series', label: 'Series' },
                  { key: 'movie', label: 'Películas' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 rounded transition-colors ${
                      filter === filterOption.key
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHistory.map((item) => (
                <div key={`${item.animeId}-${item.episodeId}`} className="bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-750 transition-colors">
                  {/* Remove Button */}
                  <div className="relative">
                    <button
                      onClick={() => handleRemoveItem(item.animeId, item.episodeId)}
                      className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar del historial"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Anime Poster */}
                    <Link href={`/watch/${item.episodeId}`}>
                      <div className="relative aspect-[3/4] bg-gray-700">
                        {item.animePoster && (
                          <Image
                            src={item.animePoster}
                            alt={item.animeTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        )}
                        
                        {/* Progress Bar */}
                        {item.progress && item.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-600">
                            <div 
                              className="h-full bg-primary-500 transition-all duration-300"
                              style={{ width: `${Math.min(item.progress, 100)}%` }}
                            />
                          </div>
                        )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>

                        {/* Episode Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                          {item.animeType === 'series' ? `EP ${item.episodeNumber}` : 'Película'}
                        </div>

                        {/* Language Badge */}
                        {item.animeLang && (
                          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                            item.animeLang === 'castellano' 
                              ? 'bg-purple-600/80 text-white' 
                              : item.animeLang === 'latino'
                              ? 'bg-orange-600/80 text-white'
                              : 'bg-blue-600/80 text-white'
                          }`}>
                            {item.animeLang === 'castellano' ? '🎙️' : item.animeLang === 'latino' ? '🎬' : '📝'}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/watch/${item.episodeId}`}>
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                        {item.animeTitle}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>
                          {item.animeType === 'series' ? `Episodio ${item.episodeNumber}` : 'Película'}
                        </span>
                        {item.progress && item.progress > 0 && (
                          <span className="text-primary-400 font-medium">
                            {Math.round(item.progress)}%
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatWatchedTime(item.watchedAt)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/watch/${item.episodeId}`}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded text-sm transition-colors"
                      >
                        Continuar
                      </Link>
                      <Link
                        href={`/anime/${item.animeId}`}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        title="Ver detalles"
                      >
                        Info
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHistory.length === 0 && filter !== 'all' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No hay {filter === 'series' ? 'series' : 'películas'} en tu historial</h3>
                <p className="text-gray-400">
                  Prueba con otro filtro o explora más contenido.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}