import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Star, Clock, Tag, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { apiService } from '../services/api';
import { AnimeDetail } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { processRating, getRatingColorClass } from '../utils/rating';
import { formatType, formatStatus, formatLang, formatDate, isMovieType, isSeriesType } from '../utils/format';
import { trackAnimeView } from '../utils/analytics';

// 集数网格组件 - 专为大量集数优化
function EpisodesGrid({ episodes, animeTitle }: { episodes: any[], animeTitle: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showLatest, setShowLatest] = useState(true);
  const episodesPerPage = 20;
  
  // 按集数排序
  const sortedEpisodes = [...episodes].sort((a, b) => a.number - b.number);
  const totalPages = Math.ceil(sortedEpisodes.length / episodesPerPage);
  
  // 最新剧集（最后10集）
  const latestEpisodes = sortedEpisodes.slice(-10).reverse();
  
  // 当前页的剧集
  const startIndex = (currentPage - 1) * episodesPerPage;
  const currentPageEpisodes = sortedEpisodes.slice(startIndex, startIndex + episodesPerPage);
  
  // 快速跳转到最后一页
  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setShowLatest(false);
  };
  
  // 快速跳转到第一页
  const goToFirstPage = () => {
    setCurrentPage(1);
    setShowLatest(false);
  };

  return (
    <div className="space-y-6">
      {/* 快速访问区域 */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-400">🔥 Acceso Rápido</h3>
          <div className="text-sm text-gray-400">
            Total: {episodes.length} episodios
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setShowLatest(true)}
            className={`p-3 rounded-lg text-center transition-all ${
              showLatest 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <div className="font-medium">Últimos</div>
            <div className="text-xs opacity-75">10 episodios</div>
          </button>
          
          <button
            onClick={goToFirstPage}
            className="p-3 rounded-lg text-center bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
          >
            <div className="font-medium">Primeros</div>
            <div className="text-xs opacity-75">EP 1-{Math.min(episodesPerPage, episodes.length)}</div>
          </button>
          
          <button
            onClick={goToLastPage}
            className="p-3 rounded-lg text-center bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
          >
            <div className="font-medium">Finales</div>
            <div className="text-xs opacity-75">EP {Math.max(1, episodes.length - episodesPerPage + 1)}-{episodes.length}</div>
          </button>
          
          <Link
            to={`/watch/${sortedEpisodes[sortedEpisodes.length - 1]?.id}`}
            className="p-3 rounded-lg text-center bg-green-600 hover:bg-green-700 text-white transition-all"
          >
            <div className="font-medium">▶ Último</div>
            <div className="text-xs opacity-75">EP {sortedEpisodes[sortedEpisodes.length - 1]?.number}</div>
          </Link>
        </div>
      </div>

      {/* 集数展示区域 */}
      {showLatest ? (
        // 最新剧集视图
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Últimos Episodios</h3>
            <button
              onClick={() => setShowLatest(false)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {latestEpisodes.map((episode) => (
              <Link
                key={episode.id}
                to={`/watch/${episode.id}`}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group hover:scale-105 border-2 border-transparent hover:border-blue-500/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-blue-400 text-lg">
                    EP {episode.number}
                  </span>
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    NUEVO
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-blue-600 rounded-full p-3 group-hover:bg-blue-500 transition-colors">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                
                {episode.title && episode.title !== animeTitle && (
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2 font-medium text-center">
                    {episode.title}
                  </p>
                )}
                
                <div className="flex items-center justify-center text-xs text-gray-500">
                  {episode.duration && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {episode.duration}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // 分页视图
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Todos los Episodios (Página {currentPage} de {totalPages})
            </h3>
            <button
              onClick={() => setShowLatest(true)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Ver últimos
            </button>
          </div>
          
          {/* 分页控制 */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* 集数网格 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {currentPageEpisodes.map((episode) => (
              <Link
                key={episode.id}
                to={`/watch/${episode.id}`}
                className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center text-sm font-medium hover:bg-gray-700 transition-all hover:scale-105 relative group"
                title={episode.title || `Episodio ${episode.number}`}
              >
                <span className="text-blue-400 group-hover:text-blue-300">
                  {episode.number}
                </span>
                <Play className="absolute top-1 right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
          
          {/* 页面信息 */}
          <div className="text-center text-sm text-gray-400 mt-4">
            Mostrando episodios {startIndex + 1} - {Math.min(startIndex + episodesPerPage, episodes.length)} de {episodes.length}
          </div>
        </div>
      )}
    </div>
  );
}

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id || '0');
  
  const [animeDetail, setAnimeDetail] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimeDetail = async () => {
    if (isNaN(animeId)) {
      setError('ID de anime inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAnimeDetail(animeId);
      setAnimeDetail(data);
      
      // 跟踪动漫查看
      trackAnimeView(data.anime.id, data.anime.name, data.anime.type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimeDetail();
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-800 animate-pulse" />
        <div className="container-custom -mt-20 sm:-mt-24 md:-mt-32 relative z-10">
          <LoadingSpinner size="lg" text="Cargando anime..." />
        </div>
      </div>
    );
  }

  if (error || !animeDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          title="Error al cargar anime"
          message={error || 'Anime no encontrado'} 
          onRetry={loadAnimeDetail}
        />
      </div>
    );
  }

  const { anime, episodes } = animeDetail;
  const rating = processRating(anime.rating || '', anime.voteAverage);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {anime.imagenCapitulo ? (
          <img
            src={anime.imagenCapitulo}
            alt={anime.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{anime.name && anime.name !== 'NaN' && anime.name !== 'null' ? anime.name : 'Título no disponible'}</h2>
              <p className="text-sm">Imagen de portada no disponible</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/"
            className="flex items-center text-white bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </div>
      </div>

      <div className="container-custom -mt-20 sm:-mt-24 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] max-w-xs sm:max-w-sm mx-auto lg:mx-0">
              {anime.imagen ? (
                <img
                  src={anime.imagen}
                  alt={anime.name}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
                  <div className="text-center text-gray-400 p-4">
                    <h3 className="text-sm font-medium mb-1">{anime.name && anime.name !== 'NaN' && anime.name !== 'null' ? anime.name : 'Título no disponible'}</h3>
                    <p className="text-xs">Sin imagen</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                {anime.name && anime.name !== 'NaN' && anime.name !== 'null' ? anime.name : 'Título no disponible'}
              </h1>
              
              {anime.nameAlternative && (
                <p className="text-lg text-gray-300 mb-4">{anime.nameAlternative}</p>
              )}
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm">
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                  <Tag className="h-4 w-4 mr-2" />
                  {formatType(anime.type)}
                </div>
                
                {anime.aired && (
                  <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(anime.aired)}
                  </div>
                )}
                
                {rating && rating !== 'NaN' && !isNaN(Number(rating)) && (
                  <div className={`flex items-center px-3 py-1 rounded text-white ${getRatingColorClass(rating)}`}>
                    <Star className="h-4 w-4 mr-2" />
                    {rating}
                  </div>
                )}
                
                <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    anime.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  {formatStatus(String(anime.status))}
                </div>

                <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                  {formatLang(anime.lang || 'sub')}
                </div>
              </div>

              {/* Genres */}
              {anime.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.split(',').map((genre, index) => (
                    <Link
                      key={index}
                      to={`/generos?genre=${encodeURIComponent(genre.trim())}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-colors duration-200 hover:scale-105 transform"
                    >
                      {genre.trim()}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {anime.overview && (
                <p className="text-gray-300 leading-relaxed mb-6">
                  {anime.overview}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{anime.visitas && !isNaN(anime.visitas) ? anime.visitas.toLocaleString() : '0'} vistas</span>
                {episodes.length > 0 && (
                  <span>{episodes.length} episodios</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {episodes.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {isSeriesType(anime.type) ? 'Episodios' : 'Reproducir'}
              </h2>
              <div className="text-sm text-gray-400">
                {episodes.length} episodio{episodes.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {isMovieType(anime.type) ? (
              // Movie: Single play button
              <div className="max-w-md">
                <Link
                  to={`/watch/${episodes[0].id}`}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 flex items-center justify-center transition-colors group"
                >
                  <Play className="h-8 w-8 mr-3 text-white" />
                  <span className="text-xl font-semibold text-white">Ver Película</span>
                </Link>
              </div>
            ) : (
              <EpisodesGrid episodes={episodes} animeTitle={anime.name} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}