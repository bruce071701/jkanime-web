import { Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock } from 'lucide-react';
import { Anime } from '../types/api';
import { processRating, getRatingColorClass } from '../utils/rating';
import { formatType, formatLang, getYear, isMovieType, isSeriesType } from '../utils/format';
import { getAnimeProgress } from '../utils/watchHistory';
import { trackAnimeView } from '../utils/analytics';

interface AnimeCardProps {
  anime: Anime;
  showEpisodeCount?: boolean;
}

export function AnimeCard({ anime, showEpisodeCount = false }: AnimeCardProps) {
  const rating = processRating(anime.rating || '', anime.voteAverage);
  const year = anime.aired ? getYear(anime.aired) : null;
  const { watchedEpisodes } = getAnimeProgress(anime.id);
  
  // 确保动漫名称不为空或NaN
  const animeName = anime.name && anime.name !== 'NaN' && anime.name !== 'null' ? anime.name : 'Título no disponible';

  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 sm:hover:scale-105 shadow-lg hover:shadow-xl touch-manipulation"
      onClick={() => trackAnimeView(anime.id, anime.name, anime.type, window.location.pathname)}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {anime.imagen ? (
          <img
            src={anime.imagen}
            alt={anime.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span class="text-gray-500 text-sm text-center p-4">${anime.name}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-center p-4">{anime.name}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className={`absolute top-2 right-2 ${getRatingColorClass(rating)} text-white text-xs px-2 py-1 rounded flex items-center`}>
            <Star className="h-3 w-3 mr-1" />
            {rating}
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded ${
          isMovieType(anime.type) ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {formatType(anime.type)}
        </div>

        {/* Episode count for series */}
        {showEpisodeCount && isSeriesType(anime.type) && anime.latestEpisode && anime.latestEpisode !== 'NaN' && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            EP {anime.latestEpisode}
          </div>
        )}

        {/* Language indicator */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
            anime.lang === 'castellano' 
              ? 'bg-purple-600/80 text-white' 
              : anime.lang === 'latino'
              ? 'bg-orange-600/80 text-white'
              : 'bg-blue-600/80 text-white'
          }`}>
            {formatLang(anime.lang || 'sub')}
          </span>
        </div>

        {/* Watch progress indicator */}
        {watchedEpisodes > 0 && !isNaN(watchedEpisodes) && (
          <div className="absolute bottom-8 left-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {watchedEpisodes} visto{watchedEpisodes !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {animeName}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            {year && !isNaN(year) && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {year}
              </div>
            )}
          </div>
          
          <div className="text-xs">
            {anime.visitas && !isNaN(anime.visitas) && anime.visitas > 0 && `${anime.visitas.toLocaleString()} vistas`}
          </div>
        </div>

        {anime.genres && (
          <p className="text-gray-400 text-xs mt-2 truncate">
            {anime.genres}
          </p>
        )}
      </div>
    </Link>
  );
}