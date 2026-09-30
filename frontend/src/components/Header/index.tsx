import { Menu, Moon, Search, UserRound } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2 font-medium transition-colors ${
      isActive
        ? 'bg-[#2B2115] text-[#D6A640]'
        : 'text-[#99949C] hover:text-[#F2EEF0]'
    }`;

  return (
    <header className="border-b border-[#242124] bg-[#121012]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-[#F2EEF0]">
          AfterCredits
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>

          <NavLink to="/movies" className={navLinkClasses}>
            Movies
          </NavLink>

          <NavLink to="/tv-shows" className={navLinkClasses}>
            TV Shows
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden cursor-pointer items-center gap-2 px-2 py-2 text-sm font-medium text-[#99949C] transition hover:text-[#F2EEF0] md:flex"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
            <span>Search</span>
          </button>

          <button
            type="button"
            aria-label="Change theme"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition hover:bg-[#211D1A] hover:text-[#F2EEF0]"
          >
            <Moon className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Login"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition hover:bg-[#211D1A] hover:text-[#F2EEF0]"
          >
            <UserRound className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#99949C] transition hover:bg-[#211D1A] hover:text-[#F2EEF0] md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-[#242124] bg-[#121012] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/movies"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </NavLink>

            <NavLink
              to="/tv-shows"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              TV Shows
            </NavLink>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-[#99949C] transition-colors hover:bg-[#211D1A] hover:text-[#F2EEF0]"
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
