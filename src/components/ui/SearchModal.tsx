'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Anime } from '@/types/anime';
import { AnimeCard } from '@/components/ui/AnimeCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchAnimes = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient.searchAnime(query, 1, 6);
        setResults(response.animes);
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAnimes, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 sm:pt-20">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-2 sm:mx-4 max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-3 sm:p-4 border-b border-gray-700">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
          <input
            type="text"
            placeholder="Buscar animes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm sm:text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors touch-friendly"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-8 text-gray-400">
              Buscando...
            </div>
          )}

          {!isLoading && query.trim().length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No se encontraron resultados para "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  onClick={onClose}
                  className="block"
                >
                  <AnimeCard anime={anime} compact />
                </Link>
              ))}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="text-center mt-4">
              <Link
                href={`/buscar?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Ver todos los resultados
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}