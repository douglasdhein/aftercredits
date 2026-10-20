import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { MovieCard } from '../../components/MovieCard';
import { TvShowCard } from '../../components/TvShowCard';
import { searchMovies } from '../../services/movieService';
import { searchTvShows } from '../../services/tvShowService';
import type { Movie } from '../../types/movie';
import type { TvShow } from '../../types/tvShow';

type SearchType = 'movies' | 'tv-shows';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query')?.trim() ?? '';

  const selectedType: SearchType =
    searchParams.get('type') === 'tv-shows' ? 'tv-shows' : 'movies';

  const pageParam = Number(searchParams.get('page') ?? '1');

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
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
        if (selectedType === 'movies') {
          const data = await searchMovies(query, currentPage);

          setMovies(data.results);
          setTotalPages(data.total_pages);
        } else {
          const data = await searchTvShows(query, currentPage);

          setTvShows(data.results);
          setTotalPages(data.total_pages);
        }
      } catch {
        setError('Failed to load search results.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSearchResults();
  }, [query, selectedType, currentPage]);

  function changeType(type: SearchType) {
    setSearchParams({
      query,
      type,
      page: '1',
    });
  }

  function changePage(page: number) {
    setSearchParams({
      query,
      type: selectedType,
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

  const hasResults =
    selectedType === 'movies' ? movies.length > 0 : tvShows.length > 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-light text-[#F2EEF0]">Search results</h1>

      <p className="mt-2 text-[#99949C]">Results for &quot;{query}&quot;</p>

      <div className="mt-6 inline-flex gap-2 rounded-lg border border-[#242124] bg-[#121012] p-1">
        <button
          type="button"
          onClick={() => changeType('movies')}
          className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedType === 'movies'
              ? 'bg-[#242124] text-white'
              : 'text-[#99949C] hover:bg-[#242124] hover:text-white'
          }`}
        >
          Movies
        </button>

        <button
          type="button"
          onClick={() => changeType('tv-shows')}
          className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedType === 'tv-shows'
              ? 'bg-[#242124] text-white'
              : 'text-[#99949C] hover:bg-[#242124] hover:text-white'
          }`}
        >
          TV Shows
        </button>
      </div>

      <div className="mt-10">
        {isLoading && (
          <p className="text-[#99949C]">Loading search results...</p>
        )}

        {error && <p className="text-[#99949C]">{error}</p>}

        {!isLoading && !error && !hasResults && (
          <p className="text-[#99949C]">
            {selectedType === 'movies'
              ? 'No movies found.'
              : 'No TV shows found.'}
          </p>
        )}

        {!isLoading && !error && hasResults && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {selectedType === 'movies'
                ? movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                : tvShows.map((tvShow) => (
                    <TvShowCard key={tvShow.id} tvShow={tvShow} />
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
      </div>
    </section>
  );
}
