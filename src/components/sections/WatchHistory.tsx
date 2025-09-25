'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Play, X, Trash2 } from 'lucide-react';
import { getRecentWatchedAnimes, removeFromWatchHistory, clearWatchHistory, WatchHistoryItem } from '@/lib/watch-history';

export function WatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    const recentHistory = getRecentWatchedAnimes(8); // 显示最近8个
    setHistory(recentHistory);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRemoveItem = (animeId: number, episodeId: number) => {
    removeFromWatchHistory(animeId, episodeId);
    loadHistory(); // 重新加载历史记录
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial de reproducción?')) {
      clearWatchHistory();
      loadHistory();
    }
  };

  const formatWatchedTime = (watchedAt: string) => {
    const date = new Date(watchedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Hace unos minutos';
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Continuar viendo</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (history.length === 0) {
    return null; // 没有历史记录时不显示
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 mr-2 text-primary-500" />
          <h2 className="text-2xl font-bold">Continuar viendo</h2>
        </div>
        <button
          onClick={handleClearAll}
          className="flex items-center text-gray-400 hover:text-red-400 transition-colors text-sm"
          title="Borrar todo el historial"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Borrar todo
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {history.map((item) => (
          <div key={`${item.animeId}-${item.episodeId}`} className="group relative">
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveItem(item.animeId, item.episodeId)}
              className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar del historial"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Anime Card */}
            <Link href={`/watch/${item.episodeId}`} className="block">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 mb-2 group-hover:scale-105 transition-transform duration-200">
                {item.animePoster && (
                  <Image
                    src={item.animePoster}
                    alt={item.animeTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                  />
                )}
                
                {/* Progress Bar */}
                {item.progress && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${Math.min(item.progress, 100)}%` }}
                    />
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>

                {/* Episode Badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
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

              {/* Anime Info */}
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {item.animeTitle}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatWatchedTime(item.watchedAt)}</span>
                  {item.progress && item.progress > 0 && (
                    <span>{Math.round(item.progress)}%</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {history.length >= 8 && (
        <div className="text-center mt-6">
          <Link
            href="/historial"
            className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
          >
            Ver todo el historial →
          </Link>
        </div>
      )}
    </section>
  );
}