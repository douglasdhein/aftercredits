import { useEffect, useState } from 'react';
import { MovieCard } from '../../components/MovieCard';
import { PopularMoviesCarousel } from '../../components/PopularMoviesCarousel';
import { TvShowCard } from '../../components/TvShowCard';
import {
  getPopularMovies,
  getTrendingMovies,
} from '../../services/movieService';
import { getTrendingTvShows } from '../../services/tvShowService';
import type { Movie } from '../../types/movie';
import type { TvShow } from '../../types/tvShow';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [moviesData, trendingMoviesData, tvShowsData] = await Promise.all(
          [getPopularMovies(), getTrendingMovies(), getTrendingTvShows()],
        );

        setMovies(moviesData.results);
        setTrendingMovies(trendingMoviesData.results);
        setTvShows(tvShowsData.results);
      } catch {
        setError('Failed to load home data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (isLoading) {
    return <p className="px-6 py-12 text-(--text-secondary)">Loading...</p>;
  }

  if (error) {
    return <p className="px-6 py-12 text-(--text-secondary)">{error}</p>;
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1700px] px-6 pt-8">
        <PopularMoviesCarousel movies={movies} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-light text-(--text-primary)">
          Trending Movies
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingMovies.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-light text-(--text-primary)">
          Trending TV Shows
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tvShows.slice(0, 4).map((tvShow) => (
            <TvShowCard key={tvShow.id} tvShow={tvShow} />
          ))}
        </div>
      </section>
    </>
  );
}
