import { useEffect, useState } from 'react';
import { PopularMoviesCarousel } from '../../components/PopularMoviesCarousel';
import { TvShowCard } from '../../components/TvShowCard';
import { MovieCard } from '../../components/MovieCard';
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <PopularMoviesCarousel movies={movies} />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#F2EEF0]">
          Trending Movies
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingMovies.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#F2EEF0]">
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
