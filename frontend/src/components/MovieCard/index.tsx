import { ArrowRight, Star } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { formatDate } from '../../utils/formatDate';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <article className="overflow-hidden rounded-xl border border-[#242124] bg-[#181518] p-4">
      {posterUrl && (
        <img
          src={posterUrl}
          alt={movie.title}
          className="aspect-2/3 w-full rounded-lg object-cover"
        />
      )}

      <div className="pt-5">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#4A391B] bg-[#2B2115] px-2 py-1 text-xs font-medium text-[#D6A640]">
          <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
          {movie.vote_average.toFixed(1)}
        </span>

        <h3 className="mt-3 text-xl font-light text-[#F2EEF0]">
          {movie.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#99949C]">
          {movie.overview || 'No overview available.'}
        </p>

        <p className="mt-3 text-xs text-[#777278]">
          {formatDate(movie.release_date)}
        </p>

        <button
          type="button"
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#343034] px-4 py-2 text-sm font-medium text-[#D0CCD1] transition-colors hover:bg-[#242124] hover:text-white"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
