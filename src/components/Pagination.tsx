import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trackEngagement } from '../utils/analytics';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    // 在移动端显示更少的页码
    const isMobile = window.innerWidth < 640;
    const delta = isMobile ? 1 : 2;
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
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-6 sm:mt-8 px-4">
      {/* Previous button */}
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
          trackEngagement('pagination_click', { 
            action: 'previous', 
            from_page: currentPage, 
            to_page: currentPage - 1,
            page: window.location.pathname
          });
        }}
        disabled={currentPage === 1}
        className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Anterior</span>
        <span className="sm:hidden">Ant</span>
      </button>

      {/* Page numbers */}
      <div className="flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof page === 'number') {
                onPageChange(page);
                trackEngagement('pagination_click', { 
                  action: 'page_number', 
                  from_page: currentPage, 
                  to_page: page,
                  page: window.location.pathname
                });
              }
            }}
            disabled={page === '...'}
            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg touch-manipulation flex-shrink-0 ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => {
          onPageChange(currentPage + 1);
          trackEngagement('pagination_click', { 
            action: 'next', 
            from_page: currentPage, 
            to_page: currentPage + 1,
            page: window.location.pathname
          });
        }}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
}