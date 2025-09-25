import { Suspense } from 'react';
import { AnimeList } from '@/components/sections/AnimeList';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import { generateListMetadata } from '@/lib/seo';

interface MoviesPageProps {
  searchParams: {
    page?: string;
    genre?: string;
    sort?: string;
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: MoviesPageProps) {
  const page = parseInt(searchParams.page || '1');
  const genre = searchParams.genre;
  
  return generateListMetadata('movie', genre, page);
}

export default function MoviesPage({ searchParams }: MoviesPageProps) {
  const page = parseInt(searchParams.page || '1');
  const genre = searchParams.genre;
  const sort = searchParams.sort as 'latest' | 'popular' | 'rating' | undefined;
  const lang = searchParams.lang;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Películas de Anime</h1>
        <p className="text-gray-400">
          Descubre las mejores películas de anime con subtítulos en español
        </p>
      </div>

      <Suspense fallback={<AnimeListSkeleton />}>
        <AnimeList
          type="movie"
          page={page}
          genre={genre}
          sort={sort}
          lang={lang}
          basePath="/peliculas"
        />
      </Suspense>
    </div>
  );
}