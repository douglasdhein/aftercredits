import {
  FileX2,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { searchMovies } from '../../services/movieService';
import { searchTvShows } from '../../services/tvShowService';
import type { Movie } from '../../types/movie';
import type { TvShow } from '../../types/tvShow';

type Theme = 'dark' | 'light';

export function Header() {
  const { session, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [tvShowResults, setTvShowResults] = useState<TvShow[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('aftercredits-theme');

    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const navLinkClasses =
    'rounded-lg px-3 py-2 font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem('aftercredits-theme', theme);
  }, [theme]);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      return;
    }

    let isCurrentSearch = true;

    const timeout = setTimeout(async () => {
      try {
        const [moviesData, tvShowsData] = await Promise.all([
          searchMovies(query),
          searchTvShows(query),
        ]);

        if (isCurrentSearch) {
          setMovieResults(moviesData.results.slice(0, 3));
          setTvShowResults(tvShowsData.results.slice(0, 3));

          setHasMoreResults(
            moviesData.total_results > 3 || tvShowsData.total_results > 3,
          );
        }
      } catch {
        if (isCurrentSearch) {
          setSearchError('Failed to search.');
          setMovieResults([]);
          setTvShowResults([]);
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

  function toggleNavigationMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
    setIsUserMenuOpen(false);
  }

  function openSearch() {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
    setMovieResults([]);
    setTvShowResults([]);
    setHasMoreResults(false);
    setSearchError('');
    setIsSearching(false);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setMovieResults([]);
    setTvShowResults([]);
    setHasMoreResults(false);
    setSearchError('');
    setIsSearching(value.trim().length >= 2);
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }

  function toggleUserMenu() {
    setIsUserMenuOpen((currentValue) => !currentValue);
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setIsUserMenuOpen(false);

    navigate('/', {
      replace: true,
    });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-(--border) bg-(--header-background) transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={toggleNavigationMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:text-(--text-primary) md:hidden"
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

          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={openSearch}
              className="hidden cursor-pointer items-center gap-2 px-2 py-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary) md:flex"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span>Search</span>
            </button>

            <button
              type="button"
              aria-label={
                theme === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
              }
              onClick={toggleTheme}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-(--text-secondary) hover:text-(--text-primary)"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                aria-label="Open user menu"
                aria-expanded={isUserMenuOpen}
                onClick={toggleUserMenu}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:text-(--text-primary)"
              >
                <UserRound className="h-5 w-5" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:text-(--text-primary)"
              >
                <UserRound className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}

            {isAuthenticated && session && isUserMenuOpen && (
              <div className="absolute top-12 right-0 w-64 rounded-xl border border-(--border) bg-(--surface) p-3 shadow-xl">
                <div className="border-b border-(--border) px-2 pb-3">
                  <p className="truncate text-sm font-medium text-(--text-primary)">
                    {session.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-(--text-secondary)">
                    {session.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-(--border) bg-(--header-background) px-6 py-4 md:hidden">
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
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
                <span>Search</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center bg-(--overlay) px-6 pt-24">
          <div className="custom-scrollbar max-h-[calc(100vh-8rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-(--border) bg-(--surface) p-5 transition-colors">
            <div className="flex items-center gap-3">
              <Search
                className="h-5 w-5 shrink-0 text-(--text-secondary)"
                strokeWidth={1.5}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search movies and TV shows..."
                autoFocus
                className="w-full bg-transparent text-(--text-primary) outline-none placeholder:text-(--text-tertiary)"
              />

              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {isSearching && (
              <p className="mt-5 text-sm text-(--text-secondary)">
                Searching...
              </p>
            )}

            {searchError && (
              <p className="mt-5 text-sm text-(--text-secondary)">
                {searchError}
              </p>
            )}

            {!isSearching &&
              !searchError &&
              searchQuery.trim().length >= 2 &&
              movieResults.length === 0 &&
              tvShowResults.length === 0 && (
                <p className="mt-5 text-sm text-(--text-secondary)">
                  No results found.
                </p>
              )}

            {movieResults.length > 0 && (
              <div className="mt-5">
                <h2 className="mb-3 text-sm font-medium text-(--text-secondary)">
                  Movies
                </h2>

                <div className="flex flex-col gap-3">
                  {movieResults.map((movie) => {
                    const posterUrl = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : null;

                    return (
                      <Link
                        key={movie.id}
                        to={`/movies/${movie.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 rounded-lg border border-(--border) bg-(--surface-secondary) p-3 transition-colors hover:border-(--border-strong) hover:bg-(--surface-hover)"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            className="h-18 w-12 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-18 w-12 shrink-0 items-center justify-center rounded-md border border-(--border-strong) bg-(--surface)">
                            <FileX2
                              className="h-5 w-5 text-(--text-tertiary)"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-(--text-primary)">
                            {movie.title}
                          </p>

                          <p className="mt-1 text-sm text-(--text-secondary)">
                            {movie.release_date
                              ? movie.release_date.slice(0, 4)
                              : 'Release date unavailable'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {tvShowResults.length > 0 && (
              <div className="mt-5">
                <h2 className="mb-3 text-sm font-medium text-(--text-secondary)">
                  TV Shows
                </h2>

                <div className="flex flex-col gap-3">
                  {tvShowResults.map((tvShow) => {
                    const posterUrl = tvShow.poster_path
                      ? `https://image.tmdb.org/t/p/w200${tvShow.poster_path}`
                      : null;

                    return (
                      <Link
                        key={tvShow.id}
                        to={`/tv-shows/${tvShow.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 rounded-lg border border-(--border) bg-(--surface-secondary) p-3 transition-colors hover:border-(--border-strong) hover:bg-(--surface-hover)"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={tvShow.name}
                            className="h-18 w-12 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-18 w-12 shrink-0 items-center justify-center rounded-md border border-(--border-strong) bg-(--surface)">
                            <FileX2
                              className="h-5 w-5 text-(--text-tertiary)"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-(--text-primary)">
                            {tvShow.name}
                          </p>

                          <p className="mt-1 text-sm text-(--text-secondary)">
                            {tvShow.first_air_date
                              ? tvShow.first_air_date.slice(0, 4)
                              : 'First air date unavailable'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {(movieResults.length > 0 || tvShowResults.length > 0) &&
              hasMoreResults && (
                <Link
                  to={`/search?query=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={closeSearch}
                  className="mt-4 flex w-full items-center justify-center rounded-lg border border-(--border-strong) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
                >
                  View all results
                </Link>
              )}
          </div>
        </div>
      )}
    </>
  );
}
