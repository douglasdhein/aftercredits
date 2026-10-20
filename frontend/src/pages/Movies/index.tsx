import { useEffect, useState } from 'react';
import { MovieCard } from '../../components/MovieCard';
import { getMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMovies() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getMovies(currentPage);

        setMovies(data.results);
      } catch {
        setError('Failed to load movies.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();
  }, [currentPage]);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-light text-(--text-primary)">Movies</h1>

      {isLoading && (
        <p className="text-(--text-secondary)">Loading movies...</p>
      )}

      {error && <p className="text-(--text-secondary)">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
