import { X } from 'lucide-react';
import { type SubmitEvent, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { updateReview } from '../../services/reviewService';
import type { Review } from '../../types/review';

interface EditReviewModalProps {
  review: Review;
  onClose: () => void;
  onUpdated: (review: Review) => void;
}

const ratingOptions = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

export function EditReviewModal({
  review,
  onClose,
  onUpdated,
}: EditReviewModalProps) {
  const { session } = useAuth();

  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.token) {
      setError('You must be logged in to edit a review.');
      return;
    }

    if (rating < 0.5 || rating > 5) {
      setError('Please select a rating.');
      return;
    }

    if (!content.trim()) {
      setError('Please write your review.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const updatedReview = await updateReview(
        review.id,
        {
          rating,
          content: content.trim(),
        },
        session.token,
      );

      onUpdated(updatedReview);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update review.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-(--overlay) px-4 py-8"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-(--border) bg-(--surface) p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light text-(--text-primary)">
              Edit review
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Update your rating and review.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit review form"
            className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label
              htmlFor="edit-review-rating"
              className="text-sm font-medium text-(--text-primary)"
            >
              Rating
            </label>

            <select
              id="edit-review-rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              disabled={isSubmitting}
              className="mt-2 w-full cursor-pointer rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--text-tertiary) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ratingOptions.map((ratingOption) => (
                <option key={ratingOption} value={ratingOption}>
                  {ratingOption.toFixed(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="edit-review-content"
                className="text-sm font-medium text-(--text-primary)"
              >
                Review
              </label>

              <span className="text-xs text-(--text-tertiary)">
                {content.length}/2000
              </span>
            </div>

            <textarea
              id="edit-review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              rows={6}
              disabled={isSubmitting}
              className="custom-scrollbar mt-2 w-full resize-none rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-3 text-sm leading-6 text-(--text-primary) outline-none transition-colors focus:border-(--text-tertiary) disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 cursor-pointer rounded-lg border border-(--border-strong) px-4 text-sm font-medium text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 cursor-pointer rounded-lg border border-(--rating-border) bg-(--rating-background) px-4 text-sm font-medium text-(--rating-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
