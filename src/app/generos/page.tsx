import { Suspense } from 'react';
import { AnimeList } from '@/components/sections/AnimeList';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import { generateListMetadata } from '@/lib/seo';
import Link from 'next/link';

interface GenresPageProps {
  searchParams: {
    page?: string;
    genre?: string;
    sort?: string;
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: GenresPageProps) {
  const page = parseInt(searchParams.page || '1');
  const genre = searchParams.genre;
  
  return generateListMetadata('all', genre, page);
}

// Anime genres based on actual API data
const animeGenres = [
  { name: 'Acción', slug: 'Accion', color: 'bg-red-600', count: '38+' },
  { name: 'Drama', slug: 'Drama', color: 'bg-purple-600', count: '35+' },
  { name: 'Sci-Fi', slug: 'Sci-Fi', color: 'bg-blue-600', count: '33+' },
  { name: 'Aventura', slug: 'Aventura', color: 'bg-green-600', count: '32+' },
  { name: 'Comedia', slug: 'Comedia', color: 'bg-yellow-600', count: '31+' },
  { name: 'Misterio', slug: 'Misterio', color: 'bg-indigo-600', count: '14+' },
  { name: 'Fantasía', slug: 'Fantasia', color: 'bg-pink-600', count: '14+' },
  { name: 'Ecchi', slug: 'Ecchi', color: 'bg-rose-600', count: '12+' },
  { name: 'Romance', slug: 'Romance', color: 'bg-rose-500', count: '11+' },
  { name: 'Sobrenatural', slug: 'Sobrenatural', color: 'bg-violet-600', count: '10+' },
  { name: 'Deportes', slug: 'Deportes', color: 'bg-orange-600', count: '5+' },
  { name: 'Música', slug: 'Musica', color: 'bg-cyan-600', count: '5+' },
  { name: 'Thriller', slug: 'Thriller', color: 'bg-gray-600', count: '5+' },
  { name: 'Terror', slug: 'Terror', color: 'bg-red-800', count: '3+' },
  { name: 'Mecha', slug: 'Mecha', color: 'bg-slate-600', count: '2+' },
  { name: 'Militar', slug: 'Militar', color: 'bg-amber-700', count: '2+' },
];

export default function GenresPage({ searchParams }: GenresPageProps) {
  const selectedGenre = searchParams.genre;

  if (selectedGenre) {
    // If a genre is selected, show anime list for that genre
    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/generos"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              ← Volver a géneros
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Anime de {animeGenres.find(g => g.slug === selectedGenre)?.name || selectedGenre}
          </h1>
          <p className="text-gray-400">
            Descubre los mejores animes del género {animeGenres.find(g => g.slug === selectedGenre)?.name || selectedGenre}
          </p>
        </div>

        <Suspense fallback={<AnimeListSkeleton />}>
          <AnimeList
            page={parseInt(searchParams.page || '1')}
            genre={selectedGenre}
            sort={searchParams.sort as 'latest' | 'popular' | 'rating' | undefined}
            lang={searchParams.lang}
            basePath="/generos"
          />
        </Suspense>
      </div>
    );
  }

  // Show genre selection page
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Géneros de Anime</h1>
        <p className="text-gray-400">
          Explora animes por género y encuentra tu próxima serie favorita
        </p>
      </div>

      {/* Quick Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Categorías Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/peliculas"
            className="group bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎬 Películas</h3>
                <p className="text-red-100">Largometrajes y especiales</p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">
                →
              </div>
            </div>
          </Link>

          <Link 
            href="/series"
            className="group bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">📺 Series</h3>
                <p className="text-blue-100">Series y temporadas completas</p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">
                →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Explorar por Género</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeGenres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/generos?genre=${genre.slug}`}
              className={`${genre.color} rounded-lg p-4 text-center hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="relative z-10">
                <h3 className="font-semibold text-white group-hover:text-gray-100 mb-1">
                  {genre.name}
                </h3>
                <p className="text-xs text-white/80 group-hover:text-white/90">
                  {genre.count} animes
                </p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">🚧 En Desarrollo</h3>
        <p className="text-gray-400 mb-4">
          El filtrado por género específico estará disponible próximamente.
        </p>
        <p className="text-gray-500 text-sm">
          Mientras tanto, puedes explorar todas las películas y series disponibles.
        </p>
      </div>
    </div>
  );
}