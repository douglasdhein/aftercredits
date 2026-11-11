import { Pencil, Star, Trash2, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { getCurrentUserReview, getReviews } from '../../services/reviewService';
import type { Review } from '../../types/review';
import { DeleteReviewModal } from '../DeleteReviewModal';
import { EditReviewModal } from '../EditReviewModal';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
}

const REVIEWS_PER_PAGE = 5;

export function ReviewsModal({
  isOpen,
  onClose,
  mediaId,
  mediaType,
  mediaTitle,
}: ReviewsModalProps) {
  const { session } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserReviewId, setCurrentUserReviewId] = useState<number | null>(
    null,
  );
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [showOnlyCurrentUserReview, setShowOnlyCurrentUserReview] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function loadReviews() {
      setIsLoading(true);
      setError('');

      try {
        const reviewsData = await getReviews(mediaId, mediaType);

        setReviews(reviewsData);
        setCurrentPage(1);
        setShowOnlyCurrentUserReview(false);

        if (session?.token) {
          const currentUserReview = await getCurrentUserReview(
            mediaId,
            mediaType,
            session.token,
          );

          setCurrentUserReviewId(currentUserReview?.id ?? null);
        } else {
          setCurrentUserReviewId(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load reviews.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [isOpen, mediaId, mediaType, session?.token]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !editingReview && !deletingReview) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, editingReview, deletingReview, onClose]);

  if (!isOpen) {
    return null;
  }

  const filteredReviews = showOnlyCurrentUserReview
    ? reviews.filter((review) => review.id === currentUserReviewId)
    : reviews;

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);

  const firstReviewIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const lastReviewIndex = firstReviewIndex + REVIEWS_PER_PAGE;

  const currentReviews = filteredReviews.slice(
    firstReviewIndex,
    lastReviewIndex,
  );

  function formatReviewDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  function handleReviewFilter() {
    setShowOnlyCurrentUserReview((currentValue) => !currentValue);
    setCurrentPage(1);
  }

  function handleReviewUpdated(updatedReview: Review) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review,
      ),
    );
  }

  function handleReviewDeleted(reviewId: number) {
    setReviews((currentReviews) => {
      const updatedReviews = currentReviews.filter(
        (review) => review.id !== reviewId,
      );

      const updatedTotalPages = Math.ceil(
        updatedReviews.length / REVIEWS_PER_PAGE,
      );

      if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
        setCurrentPage(updatedTotalPages);
      }

      return updatedReviews;
    });

    if (reviewId === currentUserReviewId) {
      setCurrentUserReviewId(null);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-(--overlay) px-4 py-8"
        onClick={onClose}
      >
        <div
          className="custom-scrollbar max-h-[calc(100vh-4rem)] w-full max-w-200 overflow-y-auto rounded-xl border border-(--border) bg-(--surface) p-6 shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-light text-(--text-primary)">
                Reviews
              </h2>

              <p className="mt-1 text-sm text-(--text-secondary)">
                {mediaTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close reviews"
              className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {session?.token && !isLoading && !error && (
            <div className="mt-5">
              <button
                type="button"
                onClick={handleReviewFilter}
                className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                  showOnlyCurrentUserReview
                    ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                    : 'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                }`}
              >
                <UserRound className="h-4 w-4" strokeWidth={1.5} />

                {showOnlyCurrentUserReview ? 'All reviews' : 'My review'}
              </button>
            </div>
          )}

          <div className="mt-6">
            {isLoading && (
              <p className="text-sm text-(--text-secondary)">
                Loading reviews...
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!isLoading && !error && reviews.length === 0 && (
              <div className="rounded-lg border border-(--border) bg-(--surface-secondary) px-5 py-8 text-center">
                <p className="text-sm text-(--text-secondary)">
                  No reviews yet.
                </p>
              </div>
            )}

            {!isLoading &&
              !error &&
              reviews.length > 0 &&
              showOnlyCurrentUserReview &&
              filteredReviews.length === 0 && (
                <div className="rounded-lg border border-(--border) bg-(--surface-secondary) px-5 py-8 text-center">
                  <p className="text-sm text-(--text-secondary)">
                    You haven't reviewed this title yet.
                  </p>
                </div>
              )}

            {!isLoading && !error && currentReviews.length > 0 && (
              <>
                <div className="space-y-4">
                  {currentReviews.map((review) => {
                    const isCurrentUserReview =
                      review.id === currentUserReviewId;

                    return (
                      <article
                        key={review.id}
                        className="rounded-lg border border-(--border) bg-(--surface-secondary) p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-(--text-primary)">
                              {review.userName}
                            </p>

                            <p className="mt-1 text-xs text-(--text-tertiary)">
                              {review.updatedAt
                                ? `Edited ${formatReviewDate(review.updatedAt)}`
                                : formatReviewDate(review.createdAt)}
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1.5 rounded-md border border-(--rating-border) bg-(--rating-background) px-2 py-1 text-xs font-medium text-(--rating-text)">
                            <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                            {review.rating.toFixed(1)}
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-justify text-sm leading-6 text-(--text-secondary)">
                          {review.content}
                        </p>

                        {isCurrentUserReview && (
                          <div className="mt-5 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingReview(review)}
                              aria-label="Edit review"
                              title="Edit review"
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-(--border-strong) text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
                            >
                              <Pencil className="h-4 w-4" strokeWidth={1.5} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingReview(review)}
                              aria-label="Delete review"
                              title="Delete review"
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-(--border-strong) text-(--text-secondary) transition-colors hover:border-red-500 hover:bg-(--surface-hover) hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      const isActive = page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to reviews page ${page}`}
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                            isActive
                              ? 'border-(--rating-border) bg-(--rating-background) text-(--rating-text)'
                              : 'border-(--border) bg-(--surface-secondary) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onUpdated={handleReviewUpdated}
        />
      )}

      {deletingReview && (
        <DeleteReviewModal
          review={deletingReview}
          onClose={() => setDeletingReview(null)}
          onDeleted={handleReviewDeleted}
        />
      )}
    </>
  );
}
