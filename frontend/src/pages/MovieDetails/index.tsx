import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getMovieDetails } from '../../services/movieService';
import type { MovieDetails as MovieDetailsType } from '../../types/movie';
import { formatDate } from '../../utils/formatDate';

export function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMovieDetails() {
      if (!id) {
        setError('Movie ID was not provided.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getMovieDetails(id);

        setMovie(data);
      } catch {
        setError('Failed to load movie details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMovieDetails();
  }, [id]);

  function formatRuntime(runtime: number | null) {
    if (!runtime) {
      return 'Runtime unavailable';
    }

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    return `${hours}h ${minutes}m`;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="rounded-xl border border-[#242124] bg-[#181518] p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[360px_1fr] md:gap-12">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-lg object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-light text-[#F2EEF0] md:text-4xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#99949C]">
              <span>{formatDate(movie.release_date)}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#4A391B] bg-[#2B2115] px-2 py-1 text-xs font-medium text-[#D6A640]">
                <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-md border border-[#343034] px-3 py-1 text-xs text-[#D0CCD1]"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-light text-[#F2EEF0]">Overview</h2>

              <p className="mt-3 max-w-3xl leading-relaxed text-[#99949C]">
                {movie.overview || 'No overview available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
