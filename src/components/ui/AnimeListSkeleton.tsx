export function AnimeListSkeleton() {
  return (
    <div>
      {/* Filters skeleton */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 space-y-4">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-20 bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-16 bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-700 rounded" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
              <div className="h-8 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}