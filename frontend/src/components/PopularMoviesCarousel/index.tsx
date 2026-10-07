import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import type { Movie } from '../../types/movie';

interface PopularMoviesCarouselProps {
  movies: Movie[];
}

export function PopularMoviesCarousel({ movies }: PopularMoviesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselMovies = movies.slice(0, 5);

  if (carouselMovies.length === 0) {
    return null;
  }

  const currentMovie = carouselMovies[currentIndex];

  function showPreviousMovie() {
    setCurrentIndex((current) =>
      current === 0 ? carouselMovies.length - 1 : current - 1,
    );
  }

  function showNextMovie() {
    setCurrentIndex((current) =>
      current === carouselMovies.length - 1 ? 0 : current + 1,
    );
  }

  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : null;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-[#F2EEF0]">
        Popular Movies
      </h1>

      <div
        className="relative min-h-105 overflow-hidden rounded-xl bg-[#211D1A] bg-cover bg-center"
        style={
          backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined
        }
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-black/10" />

        <div className="relative flex min-h-105 items-end px-16 py-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-white">
              {currentMovie.title}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#D6A640]">
              <Star className="h-4 w-4" strokeWidth={1.5} />

              <span>{currentMovie.vote_average.toFixed(1)}</span>
            </div>

            <p className="mt-4 leading-relaxed text-[#D0CCD1]">
              {currentMovie.overview}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous movie"
          onClick={showPreviousMovie}
          className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next movie"
          onClick={showNextMovie}
          className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
