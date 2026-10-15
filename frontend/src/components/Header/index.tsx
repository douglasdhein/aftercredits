import { FileX2, Menu, Search, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { searchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const navLinkClasses =
    'rounded-lg px-3 py-2 font-medium text-[#99949C] transition-colors hover:text-white';

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      return;
    }

    let isCurrentSearch = true;

    const timeout = setTimeout(async () => {
      try {
        const data = await searchMovies(query);

        if (isCurrentSearch) {
          setSearchResults(data.results.slice(0, 3));
          setHasMoreResults(data.total_results > 3);
        }
      } catch {
        if (isCurrentSearch) {
          setSearchError('Failed to search movies.');
          setSearchResults([]);
          setHasMoreResults(false);
        }
      } finally {
        if (isCurrentSearch) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isCurrentSearch = false;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  function openSearch() {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setHasMoreResults(false);
    setSearchError('');
    setIsSearching(false);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setSearchResults([]);
    setHasMoreResults(false);
    setSearchError('');
    setIsSearching(value.trim().length >= 2);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#242124] bg-[#121012]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition-colors hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className={navLinkClasses}>
              Home
            </Link>

            <Link to="/movies" className={navLinkClasses}>
              Movies
            </Link>

            <Link to="/tv-shows" className={navLinkClasses}>
              TV Shows
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openSearch}
              className="hidden cursor-pointer items-center gap-2 px-2 py-2 text-sm font-medium text-[#99949C] transition-colors hover:text-white md:flex"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span>Search</span>
            </button>

            <button
              type="button"
              aria-label="Login"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition-colors hover:text-white"
            >
              <UserRound className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-[#242124] bg-[#121012] px-6 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/movies"
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>

              <Link
                to="/tv-shows"
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </Link>

              <button
                type="button"
                onClick={openSearch}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-[#99949C] transition-colors hover:text-white"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
                <span>Search</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center bg-black/60 px-6 pt-24">
          <div className="w-full max-w-xl rounded-xl border border-[#242124] bg-[#181518] p-5">
            <div className="flex items-center gap-3">
              <Search
                className="h-5 w-5 shrink-0 text-[#99949C]"
                strokeWidth={1.5}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search movies..."
                autoFocus
                className="w-full bg-transparent text-[#F2EEF0] outline-none placeholder:text-[#777278]"
              />

              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition-colors hover:bg-[#242124] hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {isSearching && (
              <p className="mt-5 text-sm text-[#99949C]">Searching...</p>
            )}

            {searchError && (
              <p className="mt-5 text-sm text-[#99949C]">{searchError}</p>
            )}

            {!isSearching &&
              !searchError &&
              searchQuery.trim().length >= 2 &&
              searchResults.length === 0 && (
                <p className="mt-5 text-sm text-[#99949C]">No movies found.</p>
              )}

            {searchResults.length > 0 && (
              <>
                <div className="mt-5 flex flex-col gap-3">
                  {searchResults.map((movie) => {
                    const posterUrl = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : null;

                    return (
                      <Link
                        key={movie.id}
                        to={`/movies/${movie.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 rounded-lg border border-[#242124] bg-[#121012] p-3 transition-colors hover:border-[#343034] hover:bg-[#242124]"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            className="h-18 w-12 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-18 w-12 shrink-0 items-center justify-center rounded-md border border-[#343034] bg-[#181518]">
                            <FileX2
                              className="h-5 w-5 text-[#777278]"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#F2EEF0]">
                            {movie.title}
                          </p>

                          <p className="mt-1 text-sm text-[#99949C]">
                            {movie.release_date
                              ? movie.release_date.slice(0, 4)
                              : 'Release date unavailable'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {hasMoreResults && (
                  <Link
                    to={`/search?query=${encodeURIComponent(
                      searchQuery.trim(),
                    )}`}
                    onClick={closeSearch}
                    className="mt-4 flex w-full items-center justify-center rounded-lg border border-[#343034] px-4 py-2.5 text-sm font-medium text-[#D0CCD1] transition-colors hover:bg-[#242124] hover:text-white"
                  >
                    View all results
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
