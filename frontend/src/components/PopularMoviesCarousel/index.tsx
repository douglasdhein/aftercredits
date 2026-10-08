import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  function showMovie(index: number) {
    setCurrentIndex(index);
  }

  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : null;

  return (
    <section
      className="relative h-130 w-full bg-cover sm:h-145 md:h-160 lg:h-175"
      style={
        backdropUrl
          ? {
              backgroundImage: `url(${backdropUrl})`,
              backgroundPosition: 'center 35%',
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#121012]/5 via-[#121012]/25 to-[#121012]" />

      <div className="absolute inset-0 bg-linear-to-r from-[#121012]/50 via-transparent to-[#121012]/20" />

      <div className="relative flex h-full items-end px-14 pb-20 sm:px-20 md:px-24 lg:px-28 lg:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-xl leading-snug font-light text-[#F2EEF0] sm:text-2xl md:text-3xl">
            Millions of movies, TV shows and people to discover. Explore now.
          </h1>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {carouselMovies.map((movie, index) => (
          <button
            key={movie.id}
            type="button"
            aria-label={`Slide ${index + 1}`}
            aria-current={index === currentIndex}
            onClick={() => showMovie(index)}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous movie"
        onClick={showPreviousMovie}
        className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white transition group-hover:bg-black/50">
          <ChevronLeft className="h-5 w-5" />
        </span>
      </button>

      <button
        type="button"
        aria-label="Next movie"
        onClick={showNextMovie}
        className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white transition group-hover:bg-black/50">
          <ChevronRight className="h-5 w-5" />
        </span>
      </button>
    </section>
  );
}
