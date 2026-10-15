import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { MovieCard } from '../../components/MovieCard';
import { searchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query')?.trim() ?? '';
  const currentPage = Number(searchParams.get('page') ?? '1');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSearchResults() {
      if (!query) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const data = await searchMovies(query, currentPage);

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setError('Failed to load search results.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSearchResults();
  }, [query, currentPage]);

  function changePage(page: number) {
    setSearchParams({
      query,
      page: String(page),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  if (!query) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <p className="text-[#99949C]">No search query provided.</p>
      </section>
    );
  }

  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => index + 1,
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-light text-[#F2EEF0]">Search results</h1>

      <p className="mt-2 mb-8 text-[#99949C]">
        Results for &quot;{query}&quot;
      </p>

      {isLoading && <p className="text-[#99949C]">Loading search results...</p>}

      {error && <p className="text-[#99949C]">{error}</p>}

      {!isLoading && !error && movies.length === 0 && (
        <p className="text-[#99949C]">No movies found.</p>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => changePage(page)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'border-[#4A391B] bg-[#2B2115] text-[#D6A640]'
                      : 'border-[#242124] bg-[#121012] text-[#99949C] hover:bg-[#242124] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
