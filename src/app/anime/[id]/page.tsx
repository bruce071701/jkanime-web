import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { generateAnimeMetadata, generateStructuredData } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Play, Calendar, Star, Clock, Tag } from 'lucide-react';
import { formatYear, formatRating } from '@/lib/utils';

export async function generateMetadata({ params }: AnimeDetailPageProps) {
  try {
    const animeId = parseInt(params.id);
    if (isNaN(animeId)) return {};
    
    const anime = await apiClient.getAnimeDetail(animeId);
    return generateAnimeMetadata(anime);
  } catch (error) {
    return {};
  }
}

interface AnimeDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  try {
    const animeId = parseInt(params.id);
    if (isNaN(animeId)) {
      notFound();
    }

    const anime = await apiClient.getAnimeDetail(animeId);
    const structuredData = generateStructuredData(anime);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {anime.banner && (
            <Image
              src={anime.banner}
              alt={anime.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        <div className="container-custom -mt-32 relative z-10">
          <Breadcrumbs
            items={[
              { 
                label: anime.type === 'series' ? 'Series' : 'Películas', 
                href: anime.type === 'series' ? '/series' : '/peliculas' 
              },
              { label: anime.title }
            ]}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0">
                <Image
                  src={anime.poster || '/placeholder-anime.jpg'}
                  alt={anime.title}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{anime.title}</h1>
                
                {/* Meta info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                    <Tag className="h-4 w-4 mr-2" />
                    {anime.type === 'series' ? 'Serie' : 'Película'}
                  </div>
                  
                  {anime.year && (
                    <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatYear(anime.year)}
                    </div>
                  )}
                  
                  {anime.rating && (
                    <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      {formatRating(anime.rating)}
                    </div>
                  )}
                  
                  <div className="flex items-center bg-gray-800 px-3 py-1 rounded">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      anime.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    {anime.status === 'completed' ? 'Completo' : 'En emisión'}
                  </div>
                  
                  {anime.lang && (
                    <div className={`flex items-center px-3 py-1 rounded ${
                      anime.lang === 'castellano' 
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' 
                        : anime.lang === 'latino'
                        ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    }`}>
                      <span className="mr-2">
                        {anime.lang === 'castellano' ? '🎙️' : anime.lang === 'latino' ? '🎬' : '📝'}
                      </span>
                      {anime.lang === 'castellano' ? 'Español (Doblado)' : anime.lang === 'latino' ? 'Latino (Doblado)' : 'Subtítulos en Español'}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/series?genre=${encodeURIComponent(genre)}`}
                        className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-full transition-colors duration-200 hover:scale-105 transform"
                        title={`Ver más anime de ${genre}`}
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Description */}
                {anime.description && (
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {anime.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Episodes Section */}
          {anime.episodes && anime.episodes.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {anime.type === 'series' ? 'Episodios' : 'Reproducir'}
                </h2>
                {anime.type === 'series' && (
                  <div className="text-sm text-gray-400">
                    {anime.episodes.length} episodio{anime.episodes.length !== 1 ? 's' : ''}
                    {anime.totalEpisodes && anime.totalEpisodes > anime.episodes.length && (
                      <span> de {anime.totalEpisodes}</span>
                    )}
                  </div>
                )}
              </div>
              
              {anime.type !== 'series' ? (
                // Movie: Single play button
                <div className="max-w-md">
                  <Link
                    href={`/watch/${anime.episodes[0].id}`}
                    className="bg-primary-600 hover:bg-primary-700 rounded-lg p-6 flex items-center justify-center transition-colors group"
                  >
                    <Play className="h-8 w-8 mr-3 text-white" />
                    <span className="text-xl font-semibold text-white">Ver Película</span>
                  </Link>
                </div>
              ) : (
                // Series: Episode grid
                <div className="space-y-6">
                  {/* Episode Stats */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-400">{anime.episodes.length}</div>
                        <div className="text-sm text-gray-400">Disponibles</div>
                      </div>
                      {anime.totalEpisodes && (
                        <div>
                          <div className="text-2xl font-bold text-gray-300">{anime.totalEpisodes}</div>
                          <div className="text-sm text-gray-400">Total</div>
                        </div>
                      )}
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {anime.status === 'completed' ? '✓' : '⏳'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {anime.status === 'completed' ? 'Completo' : 'En emisión'}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">HD</div>
                        <div className="text-sm text-gray-400">Calidad</div>
                      </div>
                    </div>
                  </div>

                  {/* Episodes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {anime.episodes
                      .sort((a, b) => (a.episodeNumber || a.number || 0) - (b.episodeNumber || b.number || 0))
                      .map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/watch/${episode.id}`}
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-primary-400">
                            EP {episode.episodeNumber || episode.number}
                          </span>
                          <Play className="h-5 w-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                        </div>
                        
                        {episode.title && episode.title !== anime.title && episode.title.trim() && (
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2 font-medium">
                            {episode.title}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {episode.duration && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {episode.duration}
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                              HD
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More Episodes (if needed) */}
                  {anime.totalEpisodes && anime.totalEpisodes > anime.episodes.length && (
                    <div className="text-center">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 mb-2">
                          Mostrando {anime.episodes.length} de {anime.totalEpisodes} episodios
                        </p>
                        <p className="text-sm text-gray-500">
                          Más episodios se añadirán próximamente
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}