import { ChevronDown, FileX2, Film, Star, Tv, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { getReviewFeed } from '../../services/reviewFeedService';
import type {
  ReviewFeedItem,
  ReviewFeedMediaType,
  ReviewFeedSort,
} from '../../types/reviewFeed';

type MediaFilter = 'all' | ReviewFeedMediaType;

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function Reviews() {
  const { isAuthenticated, session } = useAuth();

  const [reviews, setReviews] = useState<ReviewFeedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [sort, setSort] = useState<ReviewFeedSort>('newest');
  const [onlyMine, setOnlyMine] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const effectiveOnlyMine = onlyMine && isAuthenticated;

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getReviewFeed(
          {
            page: currentPage,
            pageSize: 10,
            mediaType: mediaFilter === 'all' ? undefined : mediaFilter,
            sort,
            onlyMine: effectiveOnlyMine,
          },
          effectiveOnlyMine ? session?.token : undefined,
        );

        setReviews(data.results);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      } catch (error) {
        setReviews([]);
        setTotalPages(0);
        setTotalItems(0);

        setError(
          error instanceof Error ? error.message : 'Failed to load reviews.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [currentPage, mediaFilter, sort, effectiveOnlyMine, session?.token]);

  function handleMediaFilterChange(filter: MediaFilter) {
    setMediaFilter(filter);
    setCurrentPage(1);
  }

  function handleOnlyMineChange(value: boolean) {
    setOnlyMine(value);
    setCurrentPage(1);
  }

  function handleSortChange(value: ReviewFeedSort) {
    setSort(value);
    setCurrentPage(1);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div>
        <h1 className="text-3xl font-light text-(--text-primary) md:text-4xl">
          Reviews
        </h1>

        <p className="mt-3 text-(--text-secondary)">
          Discover what users are saying about movies and TV shows.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-(--border) bg-(--surface) p-4 md:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleOnlyMineChange(false)}
              className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                !effectiveOnlyMine
                  ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                  : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
              }`}
            >
              All reviews
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => handleOnlyMineChange(true)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  effectiveOnlyMine
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                <UserRound className="h-4 w-4" strokeWidth={1.5} />
                My reviews
              </button>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 border-t border-(--border) pt-5 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleMediaFilterChange('all')}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mediaFilter === 'all'
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => handleMediaFilterChange('movie')}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mediaFilter === 'movie'
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                <Film className="h-4 w-4" strokeWidth={1.5} />
                Movies
              </button>

              <button
                type="button"
                onClick={() => handleMediaFilterChange('tv')}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mediaFilter === 'tv'
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                <Tv className="h-4 w-4" strokeWidth={1.5} />
                TV Shows
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="review-sort"
                className="text-sm text-(--text-secondary)"
              >
                Sort by
              </label>

              <div className="relative w-28">
                <select
                  id="review-sort"
                  value={sort}
                  onChange={(event) =>
                    handleSortChange(event.target.value as ReviewFeedSort)
                  }
                  className="w-full cursor-pointer appearance-none rounded-lg border border-(--border-strong) bg-(--surface-secondary) py-2 pl-3 pr-9 text-center text-sm text-(--text-primary) outline-none"
                >
                  <option value="newest">Newest</option>

                  <option value="oldest">Oldest</option>
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-secondary)"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-(--text-secondary)">
          {totalItems} {totalItems === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {isLoading && (
        <div className="py-16 text-center">
          <p className="text-(--text-secondary)">Loading reviews...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-6 rounded-xl border border-(--border) bg-(--surface) px-6 py-12 text-center">
          <p className="text-(--text-secondary)">{error}</p>
        </div>
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <div className="mt-6 rounded-xl border border-(--border) bg-(--surface) px-6 py-12 text-center">
          <p className="text-(--text-secondary)">No reviews found.</p>
        </div>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {reviews.map((review) => {
            const posterUrl = review.posterPath
              ? `https://image.tmdb.org/t/p/w200${review.posterPath}`
              : null;

            const mediaUrl =
              review.mediaType === 'movie'
                ? `/movies/${review.mediaId}`
                : `/tv-shows/${review.mediaId}`;

            const date = review.updatedAt ?? review.createdAt;

            return (
              <article
                key={review.id}
                className="rounded-xl border border-(--border) bg-(--surface) p-5 md:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Link to={mediaUrl} className="w-full shrink-0 sm:w-28">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={review.mediaTitle}
                        className="aspect-2/3 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg border border-(--border) bg-(--surface-secondary)">
                        <FileX2
                          className="h-8 w-8 text-(--text-tertiary)"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <Link
                          to={mediaUrl}
                          className="text-lg font-medium text-(--text-primary) transition-colors hover:text-(--rating-text)"
                        >
                          {review.mediaTitle}
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-(--text-secondary)">
                          <span>{review.userName}</span>

                          <span>•</span>

                          <span>
                            {review.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                          </span>

                          <span>•</span>

                          <span>
                            {review.updatedAt
                              ? `Edited ${formatReviewDate(date)}`
                              : formatReviewDate(date)}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-(--rating-border) bg-(--rating-background) px-2.5 py-1.5 text-sm font-medium text-(--rating-text)">
                        <Star className="h-4 w-4" strokeWidth={1.5} />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap leading-7 text-(--text-secondary)">
                      {review.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="h-10 cursor-pointer rounded-lg border border-(--border-strong) px-4 text-sm text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 cursor-pointer rounded-lg border px-3 text-sm transition-colors ${
                  currentPage === page
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="h-10 cursor-pointer rounded-lg border border-(--border-strong) px-4 text-sm text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
