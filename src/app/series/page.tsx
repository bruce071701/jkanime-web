import { AnimeList } from '@/components/sections/AnimeList';
import { generateListMetadata } from '@/lib/seo';

interface SeriesPageProps {
  searchParams: {
    page?: string;
    genre?: string;
    sort?: string;
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: SeriesPageProps) {
  const page = parseInt(searchParams.page || '1');
  const genre = searchParams.genre;
  
  return generateListMetadata('series', genre, page);
}

export default function SeriesPage({ searchParams }: SeriesPageProps) {
  const page = parseInt(searchParams.page || '1');
  const genre = searchParams.genre;
  const sort = searchParams.sort as 'latest' | 'popular' | 'rating' | undefined;
  const lang = searchParams.lang;

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