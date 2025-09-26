'use client';

import { SimpleAnimeList } from '@/components/sections/SimpleAnimeList';
import { useSearchParams } from 'next/navigation';

export default function SeriesPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const genre = searchParams.get('genre') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const lang = searchParams.get('lang') || undefined;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Series de Anime</h1>
        <p className="text-gray-400">
          Explora las mejores series de anime con subtítulos en español
        </p>
      </div>

      <SimpleAnimeList
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