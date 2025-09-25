'use client';

import { Player } from '@/types/anime';
import { Play, Monitor, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerTabsProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
}

export function PlayerTabs({ players, selectedPlayer, onPlayerSelect }: PlayerTabsProps) {
  if (players.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <Monitor className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 mb-2">No hay reproductores disponibles</p>
        <p className="text-xs text-gray-500">
          Este episodio podría no estar disponible aún
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          Reproductores ({players.length})
        </h3>
        <div className="text-sm text-gray-400">
          Servidores optimizados disponibles
        </div>
      </div>
      
      {/* Player Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {players.map((player, index) => (
          <button
            key={player.id}
            onClick={() => onPlayerSelect(player)}
            className={cn(
              'relative p-3 rounded-lg border-2 transition-all duration-200 text-left',
              selectedPlayer?.id === player.id
                ? 'border-primary-500 bg-primary-600/20 shadow-lg scale-105'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700 hover:scale-102'
            )}
          >
            {/* Server Icon and Name */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  selectedPlayer?.id === player.id ? 'bg-primary-400' : 'bg-gray-500'
                )} />
                <span className="font-medium text-sm truncate">
                  {player.name}
                </span>
              </div>
              {selectedPlayer?.id === player.id && (
                <Play className="h-3 w-3 text-primary-400 flex-shrink-0" />
              )}
            </div>

            {/* Server Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                {player.quality && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    player.quality === 'HD' ? 'bg-green-600' : 'bg-yellow-600'
                  )}>
                    {player.quality}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                {player.server}
              </div>
              
              {player.status && (
                <div className="flex items-center">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full mr-1',
                    player.status === '0' ? 'bg-green-500' : 'bg-red-500'
                  )} />
                  <span className="text-xs text-gray-500">
                    {player.status === '0' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              )}
            </div>

            {/* Selection Indicator */}
            {selectedPlayer?.id === player.id && (
              <div className="absolute inset-0 border-2 border-primary-400 rounded-lg pointer-events-none">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Tips */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-blue-400 mt-0.5">💡</div>
          <div className="text-xs text-gray-400">
            <p className="mb-1"><strong>Información:</strong></p>
            <ul className="space-y-1">
              <li>• Solo se muestran servidores optimizados y confiables</li>
              <li>• Los servidores HD ofrecen mejor calidad de video</li>
              <li>• Si un servidor no funciona, prueba con otro disponible</li>
              <li>• Usa pantalla completa para una mejor experiencia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}