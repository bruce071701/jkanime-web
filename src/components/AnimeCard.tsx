import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';
import { Anime } from '../types/api';
import { processRating, getRatingColorClass } from '../utils/rating';
import { formatType, getYear, isMovieType, isSeriesType } from '../utils/format';
import { getAnimeProgress } from '../utils/watchHistory';
import { trackAnimeView } from '../utils/analytics';

// 辅助函数：检查值是否为有效值（不是 NaN、null、undefined 或字符串 "NaN"）
const isValidValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== 'NaN' && trimmed !== 'null' && trimmed !== 'undefined';
  }
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  return true;
};

// 辅助函数：检查数字值是否有效
const isValidNumber = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'NaN' || trimmed === 'null' || trimmed === 'undefined') return false;
    const num = Number(trimmed);
    return !isNaN(num) && isFinite(num);
  }
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  return false;
};

interface AnimeCardProps {
  anime: Anime;
  showEpisodeCount?: boolean;
}

export function AnimeCard({ anime, showEpisodeCount = false }: AnimeCardProps) {
  const rating = processRating(anime.rating || '', anime.voteAverage);
  const year = anime.aired ? getYear(anime.aired) : null;
  const { watchedEpisodes } = getAnimeProgress(anime.id);

  // 确保动漫名称不为空或NaN
  const animeName = isValidValue(anime.name) ? anime.name : 'Título no disponible';

  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl hover:shadow-blue-500/20 touch-manipulation flex flex-col h-full"
      onClick={() => trackAnimeView(anime.id, animeName, anime.type, window.location.pathname)}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {anime.imagen ? (
          <img
            src={anime.imagen}
            alt={animeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span class="text-gray-500 text-sm text-center p-4">${animeName}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-center p-4">{animeName}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 shadow-2xl border border-white/20">
              <Play className="h-8 w-8 text-white fill-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* 只保留评分徽章 - 如果有的话 */}
        {rating && isValidValue(rating) && isValidNumber(rating) && (
          <div className={`absolute top-2 right-2 ${getRatingColorClass(rating as string)} text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center font-medium`}>
            <Star className="h-3 w-3 mr-1 fill-current" />
            {rating}
          </div>
        )}

        {/* 类型徽章 - 简化样式 */}
        <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-medium ${isMovieType(anime.type) ? 'bg-red-500/80' : 'bg-blue-500/80'
          }`}>
          {formatType(anime.type)}
        </div>

        {/* 集数徽章 - 只在需要时显示 */}
        {showEpisodeCount && isSeriesType(anime.type) && isValidValue(anime.latestEpisode) && (
          <div className="absolute bottom-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-medium">
            EP {anime.latestEpisode}
          </div>
        )}

        {/* 观看进度 - 只在有进度时显示 */}
        {isValidNumber(watchedEpisodes) && watchedEpisodes > 0 && (
          <div className="absolute top-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3" />
            {watchedEpisodes}
          </div>
        )}
      </div>

      {/* Content - 极简设计 */}
      <div className="p-3 sm:p-4">
        {/* 只显示标题 */}
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-tight">
          {animeName}
        </h3>

        {/* 只在有年份时显示一个小的年份标签 */}
        {year && isValidNumber(year) && year > 1900 && year <= new Date().getFullYear() + 5 && (
          <div className="mt-2">
            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
              {year}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}