import { useEffect, useState } from 'react';
import { getPopularMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPopularMovies() {
      try {
        const data = await getPopularMovies();

        setMovies(data.results);
      } catch {
        setError('Failed to load popular movies.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPopularMovies();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Popular Movies</h1>

      {movies.map((movie) => (
        <p key={movie.id}>{movie.title}</p>
      ))}
    </section>
  );
}
