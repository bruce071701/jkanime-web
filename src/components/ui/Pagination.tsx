import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  genre?: string;
  sort?: string;
  lang?: string;
}

export function Pagination({ currentPage, totalPages, basePath, genre, sort, lang }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (sort) params.set('sort', sort);
    if (lang) params.set('lang', lang);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous button */}
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <Link
                href={buildUrl(page as number)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg transition-colors',
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                )}
              >
                {page}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Next button */}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
}