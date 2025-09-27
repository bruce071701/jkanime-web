import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronDown, ChevronUp, Grid3X3, List, Search } from 'lucide-react';
import { Episode } from '../types/api';
import { hasWatchedEpisode } from '../utils/watchHistory';

interface EpisodeSelectorProps {
  episodes: Episode[];
  currentEpisodeId: number;
  animeId: number;
  animeTitle: string;
}

export function EpisodeSelector({ episodes, currentEpisodeId, animeId, animeTitle }: EpisodeSelectorProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAll, setShowAll] = useState(false);
  const [jumpToEpisode, setJumpToEpisode] = useState('');

  if (!episodes || episodes.length === 0) {
    return null;
  }

  // 按集数排序
  const sortedEpisodes = [...episodes].sort((a, b) => a.number - b.number);
  
  // 找到当前剧集的索引
  const currentIndex = sortedEpisodes.findIndex(ep => ep.id === currentEpisodeId);
  
  // 显示的剧集数量
  const displayLimit = 12;
  const displayedEpisodes = showAll ? sortedEpisodes : sortedEpisodes.slice(0, displayLimit);

  // 获取相邻剧集
  const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

  // 处理快速跳转
  const handleJumpToEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const episodeNumber = parseInt(jumpToEpisode);
    if (!isNaN(episodeNumber)) {
      const targetEpisode = sortedEpisodes.find(ep => ep.number === episodeNumber);
      if (targetEpisode) {
        navigate(`/watch/${targetEpisode.id}`);
        setJumpToEpisode('');
      }
    }
  };

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 只在没有输入框聚焦时响应快捷键
      if (document.activeElement?.tagName === 'INPUT') return;
      
      if (e.key === 'ArrowLeft' && prevEpisode) {
        e.preventDefault();
        navigate(`/watch/${prevEpisode.id}`);
      } else if (e.key === 'ArrowRight' && nextEpisode) {
        e.preventDefault();
        navigate(`/watch/${nextEpisode.id}`);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevEpisode, nextEpisode, navigate, isExpanded]);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Episodios ({episodes.length})
            </h3>
            <p className="text-sm text-gray-400">
              {animeTitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Vista en cuadrícula"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Vista en lista"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title={isExpanded ? 'Contraer' : 'Expandir'}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-3 mb-4">
          {prevEpisode ? (
            <Link
              to={`/watch/${prevEpisode.id}`}
              className="flex-1 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors text-center"
            >
              <div className="text-sm text-gray-400">Anterior</div>
              <div className="font-medium">EP {prevEpisode.number}</div>
            </Link>
          ) : (
            <div className="flex-1 bg-gray-800 opacity-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500">Anterior</div>
              <div className="text-gray-500">No disponible</div>
            </div>
          )}
          
          <div className="flex-1 bg-blue-600 p-3 rounded-lg text-center">
            <div className="text-sm text-blue-200">Actual</div>
            <div className="font-medium text-white">
              EP {sortedEpisodes.find(ep => ep.id === currentEpisodeId)?.number || '?'}
            </div>
          </div>
          
          {nextEpisode ? (
            <Link
              to={`/watch/${nextEpisode.id}`}
              className="flex-1 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors text-center"
            >
              <div className="text-sm text-gray-400">Siguiente</div>
              <div className="font-medium">EP {nextEpisode.number}</div>
            </Link>
          ) : (
            <div className="flex-1 bg-gray-800 opacity-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500">Siguiente</div>
              <div className="text-gray-500">No disponible</div>
            </div>
          )}
        </div>

        {/* Quick Jump */}
        <form onSubmit={handleJumpToEpisode} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={jumpToEpisode}
              onChange={(e) => setJumpToEpisode(e.target.value)}
              placeholder={`Ir al episodio (1-${episodes.length})`}
              min="1"
              max={episodes.length}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={!jumpToEpisode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            Ir
          </button>
        </form>
      </div>

      {/* Episodes List */}
      {isExpanded && (
        <div className="p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
              {displayedEpisodes.map((episode) => {
                const isWatched = hasWatchedEpisode(animeId, episode.id);
                const isCurrent = episode.id === currentEpisodeId;
                
                return (
                  <Link
                    key={episode.id}
                    to={`/watch/${episode.id}`}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:scale-105 relative ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : isWatched
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    title={episode.title || `Episodio ${episode.number}`}
                  >
                    {isCurrent && (
                      <Play className="absolute top-1 right-1 h-3 w-3" />
                    )}
                    {episode.number}
                    {isWatched && !isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {displayedEpisodes.map((episode) => {
                const isWatched = hasWatchedEpisode(animeId, episode.id);
                const isCurrent = episode.id === currentEpisodeId;
                
                return (
                  <Link
                    key={episode.id}
                    to={`/watch/${episode.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isWatched
                        ? 'bg-green-600/20 border border-green-600/30 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded text-sm font-medium ${
                      isCurrent
                        ? 'bg-blue-500'
                        : isWatched
                        ? 'bg-green-600'
                        : 'bg-gray-700'
                    }`}>
                      {isCurrent ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        episode.number
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        Episodio {episode.number}
                      </div>
                      {episode.title && (
                        <div className="text-sm opacity-75 truncate">
                          {episode.title}
                        </div>
                      )}
                    </div>
                    
                    {episode.duration && (
                      <div className="text-xs opacity-75">
                        {episode.duration}
                      </div>
                    )}
                    
                    {isWatched && !isCurrent && (
                      <div className="text-xs text-green-400">
                        ✓ Visto
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* Show More/Less Button */}
          {episodes.length > displayLimit && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                {showAll 
                  ? `Mostrar menos` 
                  : `Mostrar todos (${episodes.length - displayLimit} más)`
                }
              </button>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>Atajos de teclado:</div>
              <div className="flex justify-center gap-4">
                <span>← Anterior</span>
                <span>→ Siguiente</span>
                <span>E Expandir/Contraer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}