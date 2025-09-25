'use client';

import { useState, useRef } from 'react';
import { Player } from '@/types/anime';
import { Loader2, AlertTriangle, ExternalLink, Play, Maximize2, Minimize2 } from 'lucide-react';

interface VideoPlayerProps {
  player: Player;
}

export function VideoPlayer({ player }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openInNewTab = () => {
    window.open(player.url, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      // Fullscreen not supported or failed
    }
  };

  // Listen for fullscreen changes
  useState(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });

  return (
    <div 
      ref={containerRef}
      className={`w-full relative bg-gray-900 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video'
      }`}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400 mx-auto mb-3" />
            <p className="text-gray-300">Cargando reproductor...</p>
            <p className="text-sm text-gray-500 mt-1">{player.name}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Error al cargar el reproductor
            </h3>
            <p className="text-gray-400 mb-4">
              No se pudo cargar el reproductor {player.name}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors mr-2"
              >
                Reintentar
              </button>
              <button
                onClick={openInNewTab}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir en nueva pestaña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player Info Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center mb-1">
            <Play className="h-3 w-3 mr-2" />
            <span className="font-medium">{player.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
              {player.server || player.type}
            </span>
            {player.quality && (
              <span className={`px-2 py-0.5 rounded text-xs ${
                player.quality === 'HD' ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {player.quality}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all"
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={openInNewTab}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all"
          title="Abrir en nueva pestaña"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Main iframe */}
      <iframe
        src={player.url}
        title={`Reproductor ${player.name}`}
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}