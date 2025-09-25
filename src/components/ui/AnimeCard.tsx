'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ImageIcon } from 'lucide-react';
import { Anime } from '@/types/anime';
import { cn, truncateText } from '@/lib/utils';
import { useState } from 'react';

interface AnimeCardProps {
  anime: Anime;
  compact?: boolean;
}

export function AnimeCard({ anime, compact = false }: AnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <Link href={`/anime/${anime.id}`} className="block group">
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-700">
          {!imageError && (anime.poster || anime.imagen) ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="animate-pulse">
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                  </div>
                </div>
              )}
              <Image
                src={anime.poster || anime.imagen || '/placeholder-anime.jpg'}
                alt={anime.title || anime.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  imageLoading ? "opacity-0" : "opacity-100 group-hover:scale-110"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            // Elegant fallback design
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
              <div className="text-center px-4 py-8">
                <ImageIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 text-sm font-medium line-clamp-3 mb-2">
                  {anime.title || anime.name}
                </p>
                <div className="inline-block">
                  <span className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full',
                    anime.type === 'series' 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                      : 'bg-red-600/20 text-red-400 border border-red-600/30'
                  )}>
                    {anime.type === 'series' ? 'Serie' : 'Película'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Hover overlay with play button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <div className="transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Type badge - only show on hover or when no image */}
          {!imageError && (anime.poster || anime.imagen) && (
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className={cn(
                'px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm',
                anime.type === 'series' 
                  ? 'bg-blue-600/80 text-white' 
                  : 'bg-red-600/80 text-white'
              )}>
                {anime.type === 'series' ? 'Serie' : 'Película'}
              </span>
            </div>
          )}

          {/* Language and Quality indicators */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-1">
              {/* Language indicator */}
              {anime.lang && (
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm',
                  anime.lang === 'castellano' 
                    ? 'bg-purple-600/80 text-white' 
                    : anime.lang === 'latino'
                    ? 'bg-orange-600/80 text-white'
                    : 'bg-blue-600/80 text-white'
                )}>
                  {anime.lang === 'castellano' ? 'ESP' : anime.lang === 'latino' ? 'LAT' : 'SUB'}
                </span>
              )}
              
              {/* Quality indicator */}
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-600/80 text-white backdrop-blur-sm">
                HD
              </span>
            </div>
          </div>
        </div>

        {/* Title section - minimal and clean */}
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 text-sm leading-tight group-hover:text-primary-400 transition-colors duration-200">
            {truncateText(anime.title || anime.name, 60)}
          </h3>
          
          {/* Language and year info */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {anime.lang && (
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  anime.lang === 'castellano' 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' 
                    : anime.lang === 'latino'
                    ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                )}>
                  {anime.lang === 'castellano' ? '🎙️ Español' : anime.lang === 'latino' ? '🎬 Latino' : '📝 Subtítulos'}
                </span>
              )}
            </div>
            
            {anime.year && (
              <p className="text-gray-500 text-xs">
                {new Date(anime.year).getFullYear()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}