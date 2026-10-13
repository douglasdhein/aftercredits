import { Bookmark, Heart, MessageSquareText, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getTvShowDetails } from '../../services/tvShowService';
import type { TvShowDetails as TvShowDetailsType } from '../../types/tvShow';
import { formatDate } from '../../utils/formatDate';

export function TvShowDetails() {
  const { id } = useParams();

  const [tvShow, setTvShow] = useState<TvShowDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTvShowDetails() {
      if (!id) {
        setError('TV show ID was not provided.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getTvShowDetails(id);

        setTvShow(data);
      } catch {
        setError('Failed to load TV show details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTvShowDetails();
  }, [id]);

  function formatEpisodeRuntime(episodeRunTime: number[]) {
    if (episodeRunTime.length === 0) {
      return null;
    }

    return `${episodeRunTime[0]}m per episode`;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!tvShow) {
    return null;
  }

  const posterUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : null;

  const episodeRuntime = formatEpisodeRuntime(tvShow.episode_run_time);

  const actionButtonClasses =
    'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#343034] px-3 text-sm font-medium text-[#D0CCD1] transition-colors hover:bg-[#242124] hover:text-white';

  const genreClasses =
    'inline-flex items-center rounded-md border border-[#343034] px-2 py-1 text-xs text-[#D0CCD1]';

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="rounded-xl border border-[#242124] bg-[#181518] p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[360px_1fr] md:gap-12">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={tvShow.name}
              className="w-full rounded-lg object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-light text-[#F2EEF0] md:text-4xl">
              {tvShow.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#99949C]">
              <span>{formatDate(tvShow.first_air_date)}</span>

              <span>
                {tvShow.number_of_seasons}{' '}
                {tvShow.number_of_seasons === 1 ? 'season' : 'seasons'}
              </span>

              <span>
                {tvShow.number_of_episodes}{' '}
                {tvShow.number_of_episodes === 1 ? 'episode' : 'episodes'}
              </span>

              {episodeRuntime && <span>{episodeRuntime}</span>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <span key={genre.id} className={genreClasses}>
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#4A391B] bg-[#2B2115] px-3 text-sm font-medium text-[#D6A640]">
                <Star className="h-4 w-4" strokeWidth={1.5} />
                {tvShow.vote_average.toFixed(1)}
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
              <h2 className="text-xl font-light text-[#F2EEF0]">Overview</h2>

              <p className="mt-3 max-w-3xl leading-relaxed text-[#99949C]">
                {tvShow.overview || 'No overview available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
