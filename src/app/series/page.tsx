import { AnimeList } from '@/components/sections/AnimeList';
import { generateListMetadata } from '@/lib/seo';

export const runtime = 'edge';

interface SeriesPageProps {
  searchParams: Promise<{
    page?: string;
    genre?: string;
    sort?: string;
    lang?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SeriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const genre = resolvedSearchParams.genre;
  
  return generateListMetadata('series', genre, page);
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const genre = resolvedSearchParams.genre;
  const sort = resolvedSearchParams.sort as 'latest' | 'popular' | 'rating' | undefined;
  const lang = resolvedSearchParams.lang;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Series de Anime</h1>
        <p className="text-gray-400">
          Explora las mejores series de anime con subtítulos en español
        </p>
      </div>

      <AnimeList
        type="series"
        page={page}
        genre={genre}
        sort={sort}
        lang={lang}
        basePath="/series"
      />
    </div>
  );
}