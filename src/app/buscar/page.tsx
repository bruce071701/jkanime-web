import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Pagination } from '@/components/ui/Pagination';
import { AnimeListSkeleton } from '@/components/ui/AnimeListSkeleton';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { Search } from 'lucide-react';

export const runtime = 'edge';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;
  const page = parseInt(resolvedSearchParams.page || '1');
  
  if (!query) {
    return generateSEOMetadata({
      title: 'Buscar Anime',
      description: 'Busca tus animes favoritos con subtítulos en español. Encuentra películas y series de anime gratis.',
      path: '/buscar',
      keywords: ['buscar', 'anime', 'español', 'subtítulos', 'películas', 'series'],
    });
  }

  const pageText = page > 1 ? ` - Página ${page}` : '';
  return generateSEOMetadata({
    title: `Resultados para "${query}"${pageText}`,
    description: `Resultados de búsqueda para "${query}". Encuentra animes con subtítulos en español.`,
    path: `/buscar?q=${encodeURIComponent(query)}`,
    keywords: ['buscar', query, 'anime', 'español', 'subtítulos'],
  });
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  try {
    const response = await apiClient.searchAnime(query, page, 24);
    const { animes, total } = response;
    const totalPages = Math.ceil(total / 24);

    if (animes.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
          <p className="text-gray-400">
            No encontramos animes que coincidan con "{query}". 
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6">
          <p className="text-gray-400">
            Se encontraron {total} resultados para "{query}"
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/buscar?q=${encodeURIComponent(query)}`}
          />
        )}
      </>
    );
  } catch (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Error en la búsqueda</h2>
        <p className="text-gray-400">
          Ocurrió un error al buscar. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim();
  const page = parseInt(resolvedSearchParams.page || '1');

  if (!query) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Buscar Anime</h1>
          <p className="text-gray-400">
            Usa el buscador en la parte superior para encontrar tus animes favoritos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resultados de Búsqueda</h1>
      </div>

      <Suspense fallback={<AnimeListSkeleton />}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  );
}