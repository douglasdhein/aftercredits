import { Menu, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses =
    'rounded-lg px-3 py-2 font-medium text-[#99949C] transition-colors hover:text-white';

  return (
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
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-[#99949C] transition-colors hover:text-white"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span>Search</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
