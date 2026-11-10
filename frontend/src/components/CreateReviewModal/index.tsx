import { X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { createReview } from '../../services/reviewService';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  onCreated?: () => void;
}

const ratingOptions = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

export function CreateReviewModal({
  isOpen,
  onClose,
  mediaId,
  mediaType,
  mediaTitle,
  onCreated,
}: CreateReviewModalProps) {
  const { session } = useAuth();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setRating(0);
    setContent('');
    setError('');
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.token) {
      setError('You must be logged in to create a review.');
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
      await createReview(
        {
          mediaId,
          mediaType,
          rating,
          content: content.trim(),
        },
        session.token,
      );

      resetForm();
      onClose();
      onCreated?.();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create review.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--overlay) px-4 py-8"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-(--border) bg-(--surface) p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light text-(--text-primary)">
              Create review
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">{mediaTitle}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close review form"
            className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label
              htmlFor="review-rating"
              className="text-sm font-medium text-(--text-primary)"
            >
              Rating
            </label>

            <select
              id="review-rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              disabled={isSubmitting}
              className="mt-2 w-full cursor-pointer rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-2.5 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--text-tertiary) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={0}>Select a rating</option>

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
                htmlFor="review-content"
                className="text-sm font-medium text-(--text-primary)"
              >
                Review
              </label>

              <span className="text-xs text-(--text-tertiary)">
                {content.length}/2000
              </span>
            </div>

            <textarea
              id="review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              rows={6}
              disabled={isSubmitting}
              placeholder="Write your review..."
              className="custom-scrollbar mt-2 w-full resize-none rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-3 py-3 text-sm leading-6 text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--text-tertiary) disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
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
              {isSubmitting ? 'Publishing...' : 'Publish review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
