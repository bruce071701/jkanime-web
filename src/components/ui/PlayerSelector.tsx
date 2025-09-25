'use client';

import { Player } from '@/types/anime';
import { Play, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
}

export function PlayerSelector({ players, selectedPlayer, onPlayerSelect }: PlayerSelectorProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Monitor className="h-5 w-5 mr-2" />
        Reproductores ({players.length})
      </h3>
      
      {players.length > 0 ? (
        <div className="space-y-2">
          {players.map((player, index) => (
            <button
              key={player.id}
              onClick={() => onPlayerSelect(player)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-all duration-200',
                selectedPlayer?.id === player.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:scale-102'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={cn(
                    'w-2 h-2 rounded-full mr-3',
                    selectedPlayer?.id === player.id ? 'bg-white' : 'bg-primary-400'
                  )} />
                  <div>
                    <span className="font-medium">{player.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                        Servidor {index + 1}
                      </span>
                      {player.quality && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          player.quality === 'HD' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                          {player.quality}
                        </span>
                      )}
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {player.server || player.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedPlayer?.id === player.id && (
                  <Play className="h-4 w-4" />
                )}
              </div>
              
              <div className="text-xs text-gray-400 mt-2 ml-5 space-y-1">
                <p>Servidor: {player.server || player.type}</p>
                {player.status && (
                  <p>Estado: {player.status === '0' ? 'Activo' : 'Inactivo'}</p>
                )}
              </div>
            </button>
          ))}
          
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              💡 Prueba diferentes reproductores si uno no funciona
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Monitor className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No hay reproductores disponibles</p>
          <p className="text-xs text-gray-500">
            Este episodio podría no estar disponible aún
          </p>
        </div>
      )}
    </div>
  );
}