import { Pencil, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { getCurrentUserReview, getReviews } from '../../services/reviewService';
import type { Review } from '../../types/review';
import { EditReviewModal } from '../EditReviewModal';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
}

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
      if (event.key === 'Escape' && !editingReview) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, editingReview, onClose]);

  if (!isOpen) {
    return null;
  }

  function formatReviewDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  function handleReviewUpdated(updatedReview: Review) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review,
      ),
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-(--overlay) px-4 py-8"
        onClick={onClose}
      >
        <div
          className="custom-scrollbar max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-(--border) bg-(--surface) p-6 shadow-xl"
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

            {!isLoading && !error && reviews.length > 0 && (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const isCurrentUserReview = review.id === currentUserReviewId;

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
    </>
  );
}
