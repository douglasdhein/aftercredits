import { Bookmark, FileX2, Heart, MessageSquareText, Star } from 'lucide-react';
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
    return <p className="px-6 py-12 text-(--text-secondary)">Loading...</p>;
  }

  if (error) {
    return <p className="px-6 py-12 text-(--text-secondary)">{error}</p>;
  }

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const actionButtonClasses =
    'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-3 text-sm font-medium text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)';

  const genreClasses =
    'inline-flex items-center rounded-md border border-(--border-strong) px-2 py-1 text-xs text-(--text-secondary)';

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="rounded-xl border border-(--border) bg-(--surface) p-6 transition-colors md:p-8">
        <div className="grid gap-8 md:grid-cols-[360px_1fr] md:gap-12">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="aspect-2/3 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-(--border) bg-(--surface-secondary)">
              <FileX2
                className="h-16 w-16 text-(--text-tertiary)"
                strokeWidth={1.5}
              />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-light text-(--text-primary) md:text-4xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--text-secondary)">
              <span>{formatDate(movie.release_date)}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre.id} className={genreClasses}>
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--rating-border) bg-(--rating-background) px-3 text-sm font-medium text-(--rating-text)">
                <Star className="h-4 w-4" strokeWidth={1.5} />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={actionButtonClasses}>
                <Heart className="h-4 w-4" strokeWidth={1.5} />
                Favorite
              </button>

              <button type="button" className={actionButtonClasses}>
                <Bookmark className="h-4 w-4" strokeWidth={1.5} />
                Watchlist
              </button>

              <button type="button" className={actionButtonClasses}>
                <MessageSquareText className="h-4 w-4" strokeWidth={1.5} />
                Reviews
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-light text-(--text-primary)">
                Overview
              </h2>

              <p className="mt-3 max-w-3xl leading-relaxed text-(--text-secondary)">
                {movie.overview || 'No overview available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
