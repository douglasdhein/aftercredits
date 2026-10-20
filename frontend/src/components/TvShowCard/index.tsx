import { ArrowRight, FileX2, Star } from 'lucide-react';
import { Link } from 'react-router';
import type { TvShow } from '../../types/tvShow';
import { formatDate } from '../../utils/formatDate';

interface TvShowCardProps {
  tvShow: TvShow;
}

export function TvShowCard({ tvShow }: TvShowCardProps) {
  const posterUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={tvShow.name}
          className="aspect-2/3 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-(--border) bg-(--surface-secondary)">
          <FileX2
            className="h-10 w-10 text-(--text-tertiary)"
            strokeWidth={1.5}
          />
        </div>
      )}

      <div className="mt-5 flex flex-1 flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-(--rating-border) bg-(--rating-background) px-2 py-1 text-xs font-medium text-(--rating-text)">
          <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
          {tvShow.vote_average.toFixed(1)}
        </span>

        <h2
          title={tvShow.name}
          className="mt-4 truncate text-lg font-light text-(--text-primary)"
        >
          {tvShow.name}
        </h2>

        <p className="mt-2 h-18 line-clamp-3 text-sm leading-6 text-(--text-secondary)">
          {tvShow.overview || 'No overview available.'}
        </p>

        <p className="mt-3 text-xs text-(--text-tertiary)">
          {formatDate(tvShow.first_air_date)}
        </p>

        <div className="mt-auto pt-5">
          <Link
            to={`/tv-shows/${tvShow.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-(--border-strong) px-4 py-2 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
