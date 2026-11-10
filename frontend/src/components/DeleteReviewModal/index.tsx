import { Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { deleteReview } from '../../services/reviewService';
import type { Review } from '../../types/review';

interface DeleteReviewModalProps {
  review: Review;
  onClose: () => void;
  onDeleted: (reviewId: number) => void;
}

export function DeleteReviewModal({
  review,
  onClose,
  onDeleted,
}: DeleteReviewModalProps) {
  const { session } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleting, onClose]);

  async function handleDelete() {
    if (!session?.token) {
      setError('You must be logged in to delete a review.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteReview(review.id, session.token);

      onDeleted(review.id);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete review.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-(--overlay) px-4 py-8"
      onClick={() => {
        if (!isDeleting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-xl border border-(--border) bg-(--surface) p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-(--text-primary)">
              Delete review
            </h2>

            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete review confirmation"
            className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 cursor-pointer rounded-lg border border-(--border-strong) px-4 text-sm font-medium text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-red-500 px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />

            {isDeleting ? 'Deleting...' : 'Delete review'}
          </button>
        </div>
      </div>
    </div>
  );
}
