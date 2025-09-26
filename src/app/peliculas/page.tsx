import { SimpleAnimeList } from '@/components/sections/SimpleAnimeList';
import { generateListMetadata } from '@/lib/seo';

export const runtime = 'edge';

interface MoviesPageProps {
  searchParams: Promise<{
    page?: string;
    genre?: string;
    sort?: string;
    lang?: string;
  }>;
}

export async function generateMetadata({ searchParams }: MoviesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const genre = resolvedSearchParams.genre;
  
  return generateListMetadata('movie', genre, page);
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const genre = resolvedSearchParams.genre;
  const sort = resolvedSearchParams.sort;
  const lang = resolvedSearchParams.lang;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Películas de Anime</h1>
        <p className="text-gray-400">
          Descubre las mejores películas de anime con subtítulos en español
        </p>
      </div>

      <SimpleAnimeList
        type="movie"
        page={page}
        genre={genre}
        sort={sort}
        lang={lang}
        basePath="/peliculas"
      />
    </div>
  );
}