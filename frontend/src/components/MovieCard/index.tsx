import { ArrowRight, FileX2, Star } from 'lucide-react';
import { Link } from 'react-router';
import type { Movie } from '../../types/movie';
import { formatDate } from '../../utils/formatDate';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0';

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#242124] bg-[#181518] p-4">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="aspect-2/3 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-[#242124] bg-[#121012]">
          <FileX2 className="h-12 w-12 text-[#777278]" strokeWidth={1.5} />
        </div>
      )}

      <div className="mt-5 flex flex-1 flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#4A391B] bg-[#2B2115] px-2 py-1 text-xs font-medium text-[#D6A640]">
          <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
          {rating}
        </span>

        <h2
          title={movie.title}
          className="mt-4 truncate text-lg font-light text-[#F2EEF0]"
        >
          {movie.title}
        </h2>

        <p className="mt-2 h-18 line-clamp-3 text-sm leading-6 text-[#99949C]">
          {movie.overview || 'No overview available.'}
        </p>

        <p className="mt-3 text-xs text-[#777278]">
          {formatDate(movie.release_date)}
        </p>

        <div className="mt-auto pt-5">
          <Link
            to={`/movies/${movie.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#343034] px-4 py-2 text-sm font-medium text-[#D0CCD1] transition-colors hover:bg-[#242124] hover:text-white"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
