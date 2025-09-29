import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, X, Trash2, Calendar, Search } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory, clearWatchHistory, WatchHistoryItem, formatWatchProgress } from '../utils/watchHistory';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function HistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const loadHistory = () => {
    try {
      setLoading(true);
      const allHistory = getWatchHistory();
      setHistory(allHistory);
      setFilteredHistory(allHistory);
    } catch (error) {
      console.error('Error loading watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    let filtered = history;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.animeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.episodeTitle && item.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.watchedAt).toISOString().split('T')[0];
        return itemDate === selectedDate;
      });
    }

    setFilteredHistory(filtered);
  }, [history, searchQuery, selectedDate]);

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

  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.watchedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, WatchHistoryItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-8">Historial de reproducción</h1>
          <LoadingSpinner size="lg" text="Cargando historial..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Historial de reproducción</h1>
            <p className="text-gray-400">
              {history.length} elemento{history.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar todo
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="mb-8 bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en el historial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                />
              </div>

              {/* Date filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-datetime-edit]:opacity-0 [&::-webkit-datetime-edit-text]:opacity-0 [&::-webkit-datetime-edit-month-field]:opacity-0 [&::-webkit-datetime-edit-day-field]:opacity-0 [&::-webkit-datetime-edit-year-field]:opacity-0"
                  style={{
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>

            {(searchQuery || selectedDate) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Filtros activos:</span>
                {searchQuery && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedDate && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {new Date(selectedDate).toLocaleDateString('es-ES')}
                    <button
                      onClick={() => setSelectedDate('')}
                      className="hover:bg-green-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {history.length === 0 ? 'No hay historial de reproducción' : 'No se encontraron resultados'}
            </h2>
            <p className="text-gray-400 mb-6">
              {history.length === 0 
                ? 'Los animes que veas aparecerán aquí'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {history.length === 0 && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                Explorar animes
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  {date}
                  <span className="text-sm text-gray-400 font-normal">
                    ({items.length} elemento{items.length !== 1 ? 's' : ''})
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div
                      key={`${item.animeId}-${item.episodeId}`}
                      className="group relative bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                    >
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(item.animeId, item.episodeId)}
                        className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar del historial"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <Link to={`/watch/${item.episodeId}`} className="block">
                        {/* Poster */}
                        <div className="relative aspect-[3/4]">
                          {item.animePoster ? (
                            <img
                              src={item.animePoster}
                              alt={item.animeTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                              <div className="text-center text-gray-400 p-2">
                                <h4 className="text-xs font-medium mb-1 line-clamp-2">{item.animeTitle}</h4>
                                <p className="text-xs">Sin imagen</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/70 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          {item.progress && item.progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h4 className="font-medium text-white line-clamp-2 mb-2">
                            {item.animeTitle}
                          </h4>
                          
                          {/* Episode info */}
                          <p className="text-blue-400 text-sm mb-1">
                            {item.animeType === 'movie' ? 'Película' : `Episodio ${item.episodeNumber}`}
                            {item.episodeTitle && ` - ${item.episodeTitle}`}
                          </p>
                          
                          {/* Series progress info */}
                          {item.animeType === 'series' && item.watchedEpisodesCount && (
                            <div className="mb-2">
                              <p className="text-green-400 text-xs mb-1">
                                {formatWatchProgress(item.watchedEpisodesCount, item.totalEpisodes)}
                              </p>
                              
                              {/* Progress bar for series with known total episodes */}
                              {item.totalEpisodes && item.totalEpisodes > 0 && (
                                <div className="w-full bg-gray-600 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${Math.min((item.watchedEpisodesCount / item.totalEpisodes) * 100, 100)}%` 
                                    }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(item.watchedAt).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}