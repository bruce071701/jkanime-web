'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Episode, Player } from '@/types/anime';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { PlayerSelector } from '@/components/ui/PlayerSelector';
import { PlayerTabs } from '@/components/ui/PlayerTabs';
import { addToWatchHistory } from '@/lib/watch-history';
import { ArrowLeft, Play } from 'lucide-react';

interface WatchPageClientProps {
  episodeId: string;
}

export function WatchPageClient({ episodeId }: WatchPageClientProps) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEpisodeData = async () => {
      try {
        const id = parseInt(episodeId);
        if (isNaN(id)) {
          notFound();
        }

        const data = await apiClient.getEpisodePlay(id);
        setEpisode(data.episode);
        
        // Filter out unwanted players (DoodStream and MediaFire)
        const filteredPlayers = data.players.filter(player => {
          const serverName = player.server?.toLowerCase() || player.name?.toLowerCase() || '';
          return !serverName.includes('dood') && 
                 !serverName.includes('mediafire') &&
                 !serverName.includes('doodstream');
        });
        
        setPlayers(filteredPlayers);
        
        // Select first available player by default
        if (filteredPlayers.length > 0) {
          setSelectedPlayer(filteredPlayers[0]);
        }

        // Load anime details to get all episodes
        if (data.episode.animeId) {
          try {
            const animeData = await apiClient.getAnimeDetail(data.episode.animeId);
            setAnimeInfo(animeData);
            setAllEpisodes(animeData.episodes || []);
            
            // Add to watch history when episode loads
            addToWatchHistory(animeData, data.episode);
          } catch (animeErr) {
            // Silently handle anime details loading error
          }
        }
      } catch (err) {
        setError('Error al cargar el episodio');
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodeData();
  }, [episodeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando episodio...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Episodio no encontrado</h1>
          <p className="text-gray-400 mb-6">
            {error || 'El episodio que buscas no existe o no está disponible.'}
          </p>
          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container-custom py-3 md:py-4 px-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/anime/${episode.animeId}`}
              className="flex items-center text-gray-400 hover:text-white transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Volver a detalles</span>
              <span className="sm:hidden">Volver</span>
            </Link>
            
            <div className="text-right">
              <h1 className="text-base md:text-lg font-semibold">
                Episodio {episode.episodeNumber}
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
          <div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {selectedPlayer ? (
                <VideoPlayer player={selectedPlayer} />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center p-8">
                    <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No hay reproductores disponibles
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Este episodio no tiene fuentes de reproducción configuradas
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>• Verifica que el episodio esté disponible</p>
                      <p>• Intenta recargar la página</p>
                      <p>• Contacta al administrador si el problema persiste</p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Recargar página
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Episode Info */}
            <div className="mt-6 bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">
                Episodio {episode.episodeNumber}
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
          </div>

          {/* Player Tabs - Below Video */}
          <PlayerTabs
            players={players}
            selectedPlayer={selectedPlayer}
            onPlayerSelect={setSelectedPlayer}
          />

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Episode Navigation */}
            {allEpisodes.length > 1 && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Episodios ({allEpisodes.length})
                </h3>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {allEpisodes
                    .sort((a, b) => (a.episodeNumber || a.number || 0) - (b.episodeNumber || b.number || 0))
                    .map((ep) => (
                    <Link
                      key={ep.id}
                      href={`/watch/${ep.id}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        ep.id === episode?.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          EP {ep.episodeNumber || ep.number}
                        </span>
                        {ep.id === episode?.id && (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                      {ep.title && ep.title.trim() && ep.title !== animeInfo?.title && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {ep.title}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Anime Info */}
            {animeInfo && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{animeInfo.title}</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Tipo:</span>
                    <span className="text-gray-300">{animeInfo.type === 'series' ? 'Serie' : 'Película'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estado:</span>
                    <span className="text-gray-300">
                      {animeInfo.status === 'completed' ? 'Completo' : 'En emisión'}
                    </span>
                  </div>
                  {animeInfo.totalEpisodes && (
                    <div className="flex items-center justify-between">
                      <span>Episodios:</span>
                      <span className="text-gray-300">{animeInfo.totalEpisodes}</span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/anime/${animeInfo.id}`}
                  className="mt-4 block text-center bg-gray-800 hover:bg-gray-700 py-2 rounded transition-colors text-sm"
                >
                  Ver detalles completos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}