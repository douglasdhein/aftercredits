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

  const previousIndex =
    currentIndex === 0 ? carouselMovies.length - 1 : currentIndex - 1;

  const nextIndex =
    currentIndex === carouselMovies.length - 1 ? 0 : currentIndex + 1;

  const currentMovie = carouselMovies[currentIndex];
  const previousMovie = carouselMovies[previousIndex];
  const nextMovie = carouselMovies[nextIndex];

  function getBackdropUrl(movie: Movie) {
    return movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : null;
  }

  function showPreviousMovie() {
    setCurrentIndex(previousIndex);
  }

  function showNextMovie() {
    setCurrentIndex(nextIndex);
  }

  function showMovie(index: number) {
    setCurrentIndex(index);
  }

  return (
    <section className="relative h-65 w-full sm:h-90 md:h-120 lg:h-130">
      <div className="absolute top-1/2 left-6 z-10 hidden aspect-video w-[44%] max-w-175 -translate-y-1/2 overflow-hidden rounded-xl border border-[#242124] bg-[#121012] opacity-40 lg:block">
        {getBackdropUrl(previousMovie) && (
          <img
            src={getBackdropUrl(previousMovie)!}
            alt={previousMovie.title}
            className="h-full w-full object-contain"
          />
        )}

        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute top-1/2 right-6 z-10 hidden aspect-video w-[44%] max-w-175 -translate-y-1/2 overflow-hidden rounded-xl border border-[#242124] bg-[#121012] opacity-40 lg:block">
        {getBackdropUrl(nextMovie) && (
          <img
            src={getBackdropUrl(nextMovie)!}
            alt={nextMovie.title}
            className="h-full w-full object-contain"
          />
        )}

        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="absolute top-1/2 left-1/2 z-20 aspect-video w-[calc(100%-2rem)] max-w-231 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-[#242124] bg-[#121012] shadow-xl">
        {getBackdropUrl(currentMovie) && (
          <img
            src={getBackdropUrl(currentMovie)!}
            alt={currentMovie.title}
            className="h-full w-full object-contain"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#121012]/90" />

        <div className="absolute inset-0 bg-linear-to-r from-[#121012]/40 via-transparent to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 z-20 px-6 pb-12 sm:px-8 md:px-10">
          <h1 className="max-w-2xl text-base leading-relaxed font-light text-[#F2EEF0] sm:text-lg md:text-xl">
            Millions of movies, TV shows and people to discover. Explore now.
          </h1>
        </div>

        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3">
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
      </div>

      <button
        type="button"
        aria-label="Previous movie"
        onClick={showPreviousMovie}
        className="group absolute top-1/2 left-3 z-30 -translate-y-1/2 cursor-pointer focus:outline-none sm:left-5 lg:left-10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#242124] bg-[#121012]/80 text-white transition group-hover:bg-[#242124]">
          <ChevronLeft className="h-5 w-5" />
        </span>
      </button>

      <button
        type="button"
        aria-label="Next movie"
        onClick={showNextMovie}
        className="group absolute top-1/2 right-3 z-30 -translate-y-1/2 cursor-pointer focus:outline-none sm:right-5 lg:right-10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#242124] bg-[#121012]/80 text-white transition group-hover:bg-[#242124]">
          <ChevronRight className="h-5 w-5" />
        </span>
      </button>
    </section>
  );
}
