import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { apiService } from '../services/api';
import { GenreStats } from '../types/api';

interface AnimeFiltersProps {
  selectedGenre?: string;
  selectedLang?: string;
  selectedSort?: string;
  onGenreChange: (genre: string) => void;
  onLangChange: (lang: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  showGenreFilter?: boolean;
  showLangFilter?: boolean;
  showSortFilter?: boolean;
}

const LANGUAGE_OPTIONS = [
  { value: '', label: 'Todos los idiomas' },
  { value: 'sub', label: 'Subtitulado' },
  { value: 'dub', label: 'Doblado' },
  { value: 'latino', label: 'Latino' },
  { value: 'castellano', label: 'Castellano' }
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Más recientes' },
  { value: 'popular', label: 'Más populares' },
  { value: 'rating', label: 'Mejor valoradas' }
];

export function AnimeFilters({
  selectedGenre = '',
  selectedLang = '',
  selectedSort = 'latest',
  onGenreChange,
  onLangChange,
  onSortChange,
  onClearFilters,
  showGenreFilter = true,
  showLangFilter = true,
  showSortFilter = true
}: AnimeFiltersProps) {
  const [genres, setGenres] = useState<GenreStats[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showGenreFilter) {
      loadGenres();
    }
  }, [showGenreFilter]);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const data = await apiService.getGenres();
      setGenres(data.sort((a, b) => b.count - a.count)); // 按数量排序
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = selectedGenre || selectedLang || selectedSort !== 'latest';

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Activos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 transition-colors md:hidden"
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sort Filter */}
          {showSortFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Filter */}
          {showLangFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma
              </label>
              <select
                value={selectedLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Genre Filter */}
          {showGenreFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Género
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre.genre} value={genre.genre}>
                    {genre.genre} ({genre.count})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
            <span className="text-sm text-gray-400">Filtros activos:</span>
            {selectedGenre && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {selectedGenre}
                <button
                  onClick={() => onGenreChange('')}
                  className="hover:bg-blue-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedLang && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {LANGUAGE_OPTIONS.find(opt => opt.value === selectedLang)?.label}
                <button
                  onClick={() => onLangChange('')}
                  className="hover:bg-green-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedSort !== 'latest' && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {SORT_OPTIONS.find(opt => opt.value === selectedSort)?.label}
                <button
                  onClick={() => onSortChange('latest')}
                  className="hover:bg-purple-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}