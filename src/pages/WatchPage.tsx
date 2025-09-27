import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { apiService } from '../services/api';
import { PlayData } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { VideoPlayer } from '../components/VideoPlayer';
import { addToWatchHistory } from '../utils/watchHistory';

export function WatchPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const epId = parseInt(episodeId || '0');
  
  const [playData, setPlayData] = useState<PlayData | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayData = async () => {
    if (isNaN(epId)) {
      setError('ID de episodio inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPlayData(epId);
      setPlayData(data);
      
      // 处理播放器数据，确保URL字段正确
      const processedPlayers = data.players.map(player => ({
        ...player,
        url: player.link || player.url, // 使用link字段作为URL
      }));

      // Filter out unwanted players
      const filteredPlayers = processedPlayers.filter(player => {
        const serverName = player.server.toLowerCase();
        return !serverName.includes('dood') && 
               !serverName.includes('mediafire') &&
               !serverName.includes('doodstream');
      });
      
      setPlayData({
        ...data,
        players: filteredPlayers
      });

      // 添加到观看历史
      if (data.anime) {
        addToWatchHistory(
          data.anime,
          data.episode.id,
          data.episode.number,
          data.episode.title
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayData();
  }, [epId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando episodio..." />
      </div>
    );
  }

  if (error || !playData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          title="Episodio no encontrado"
          message={error || 'El episodio que buscas no existe o no está disponible.'} 
          onRetry={loadPlayData}
        />
      </div>
    );
  }

  const { episode, players, anime } = playData;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container-custom py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link
              to={anime ? `/anime/${anime.id}` : '/'}
              className="flex items-center text-gray-400 hover:text-white transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Volver a detalles</span>
              <span className="sm:hidden">Volver</span>
            </Link>
            
            <div className="text-right">
              <h1 className="text-base md:text-lg font-semibold">
                Episodio {episode.number}
              </h1>
              {episode.title && (
                <p className="text-sm text-gray-400">{episode.title}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="space-y-6">
          {/* Video Player */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {players.length > 0 && players[selectedPlayer]?.url ? (
              <VideoPlayer
                url={players[selectedPlayer].url}
                title={`Episodio ${episode.number}`}
                server={players[selectedPlayer].server}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-800">
                <div className="text-center p-8">
                  <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No hay reproductores disponibles
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Este episodio no tiene fuentes de reproducción configuradas
                  </p>
                  {players.length > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      <p>Reproductores disponibles: {players.length}</p>
                      <p>Reproductores filtrados (sin DoodStream/MediaFire)</p>
                    </div>
                  )}
                  <button
                    onClick={loadPlayData}
                    className="btn-primary"
                  >
                    Recargar página
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">
              Episodio {episode.number}
            </h2>
            {episode.title && (
              <h3 className="text-lg text-gray-300 mb-4">{episode.title}</h3>
            )}
            {episode.duration && (
              <p className="text-sm text-gray-400">
                Duración: {episode.duration}
              </p>
            )}
          </div>



          {/* Player Selection */}
          {players.length > 1 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Reproductores ({players.length})
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {players.map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => setSelectedPlayer(index)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlayer === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{player.server}</span>
                      {player.quality && (
                        <span className="text-xs opacity-75">{player.quality}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anime Info */}
          {anime && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{anime.name}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Tipo:</span>
                  <span className="text-gray-300">
                    {anime.type === 'series' || anime.type === 'Serie' ? 'Serie' : 'Película'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estado:</span>
                  <span className="text-gray-300">
                    {anime.status === 'completed' || anime.status === '1' ? 'Completo' : 'En emisión'}
                  </span>
                </div>
                {anime.visitas && !isNaN(anime.visitas) && anime.visitas > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Vistas:</span>
                    <span className="text-gray-300">{anime.visitas.toLocaleString()}</span>
                  </div>
                )}
                {anime.lang && (
                  <div className="flex items-center justify-between">
                    <span>Idioma:</span>
                    <span className="text-gray-300">
                      {anime.lang === 'sub' ? 'Subtítulos' : anime.lang}
                    </span>
                  </div>
                )}
              </div>
              
              <Link
                to={`/anime/${anime.id}`}
                className="mt-4 block text-center bg-gray-800 hover:bg-gray-700 py-2 rounded transition-colors text-sm"
              >
                Ver detalles completos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}