import { useEffect, useState } from 'react';
import { TvShowCard } from '../../components/TvShowCard';
import { getTvShows } from '../../services/tvShowService';
import type { TvShow } from '../../types/tvShow';

export function TvShows() {
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTvShows() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getTvShows(currentPage);

        setTvShows(data.results);
      } catch {
        setError('Failed to load TV shows.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTvShows();
  }, [currentPage]);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-light text-(--text-primary)">
        TV Shows
      </h1>

      {isLoading && (
        <p className="text-(--text-secondary)">Loading TV shows...</p>
      )}

      {error && <p className="text-(--text-secondary)">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {tvShows.map((tvShow) => (
              <TvShowCard key={tvShow.id} tvShow={tvShow} />
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border) bg-(--surface-secondary) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
