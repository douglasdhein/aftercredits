import { useEffect, useState } from 'react';
import { PopularMoviesCarousel } from '../../components/PopularMoviesCarousel';
import { TvShowCard } from '../../components/TvShowCard';
import { getPopularMovies } from '../../services/movieService';
import { getTrendingTvShows } from '../../services/tvShowService';
import type { Movie } from '../../types/movie';
import type { TvShow } from '../../types/tvShow';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [moviesData, tvShowsData] = await Promise.all([
          getPopularMovies(),
          getTrendingTvShows(),
        ]);

        setMovies(moviesData.results);
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
