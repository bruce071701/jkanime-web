import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, X, Trash2, ChevronRight } from 'lucide-react';
import { getRecentWatchedAnimes, removeFromWatchHistory, clearWatchHistory, WatchHistoryItem } from '../utils/watchHistory';

interface WatchHistoryProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export function WatchHistory({ limit = 10, showHeader = true, compact = false }: WatchHistoryProps) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    try {
      const recentAnimes = getRecentWatchedAnimes(limit);
      setHistory(recentAnimes);
    } catch (error) {
      console.error('Error loading watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [limit]);

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

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-16 h-24 bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">
          No hay historial de reproducción
        </h3>
        <p className="text-gray-400">
          Los animes que veas aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'bg-gray-800 rounded-xl p-6'}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold">Continuar viendo</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/historial"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
            >
              Ver todo
              <ChevronRight className="h-4 w-4" />
            </Link>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-gray-400 hover:text-red-400 transition-colors p-1"
                title="Limpiar historial"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className={compact ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
        {history.map((item) => (
          <div
            key={`${item.animeId}-${item.episodeId}`}
            className={`group relative ${
              compact 
                ? 'flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'
                : 'bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-all duration-200 hover:scale-105'
            }`}
          >
            {/* Remove button */}
            <button
              onClick={() => handleRemoveItem(item.animeId, item.episodeId)}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar del historial"
            >
              <X className="h-3 w-3" />
            </button>

            <Link
              to={`/watch/${item.episodeId}`}
              className={`flex ${compact ? 'flex-row items-center flex-1' : 'flex-col'}`}
            >
              {/* Poster */}
              <div className={`relative ${compact ? 'w-12 h-16 flex-shrink-0' : 'aspect-[3/4] w-full'}`}>
                {item.animePoster ? (
                  <img
                    src={item.animePoster}
                    alt={item.animeTitle}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center">
                    <div className="text-center text-gray-400 p-1">
                      {compact ? (
                        <span className="text-xs">Sin imagen</span>
                      ) : (
                        <>
                          <h4 className="text-xs font-medium mb-1 line-clamp-2">{item.animeTitle}</h4>
                          <p className="text-xs">Sin imagen</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                {/* Progress bar */}
                {item.progress && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 rounded-b">
                    <div 
                      className="h-full bg-blue-500 rounded-b"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`${compact ? 'flex-1 min-w-0 ml-3' : 'p-3'}`}>
                <h3 className={`font-medium text-white line-clamp-2 ${compact ? 'text-sm' : 'text-base'} mb-1`}>
                  {item.animeTitle}
                </h3>
                <p className={`text-blue-400 ${compact ? 'text-xs' : 'text-sm'} mb-1`}>
                  Episodio {item.episodeNumber}
                  {item.episodeTitle && ` - ${item.episodeTitle}`}
                </p>
                <div className={`flex items-center text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(item.watchedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {item.duration && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{item.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!compact && history.length >= limit && (
        <div className="mt-6 text-center">
          <Link
            to="/historial"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver historial completo
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}