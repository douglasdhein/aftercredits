import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AlertModal } from '../../components/AlertModal';
import { ReviewCard } from '../../components/ReviewCard';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { getReviewDetails } from '../../services/reviewDetailsService';
import { likeReview, unlikeReview } from '../../services/reviewLikeService';
import type { ReviewFeedItem } from '../../types/reviewFeed';

interface ReviewDetailsContentProps {
  reviewId: number;
  currentUserId: number | null;
  token?: string;
}

function ReviewDetailsContent({
  reviewId,
  currentUserId,
  token,
}: ReviewDetailsContentProps) {
  const navigate = useNavigate();

  const [review, setReview] = useState<ReviewFeedItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    getReviewDetails(reviewId, token)
      .then((data) => {
        if (ignore) {
          return;
        }

        setReview(data);
        setError('');
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setReview(null);

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load review details.',
        );
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reviewId, token]);

  const handleCommentsCountChange = useCallback(
    (updatedReviewId: number, commentsCount: number) => {
      setReview((previousReview) => {
        if (!previousReview || previousReview.id !== updatedReviewId) {
          return previousReview;
        }

        return {
          ...previousReview,
          commentsCount,
        };
      });
    },
    [],
  );

  async function handleToggleLike() {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!review || isLiking) {
      return;
    }

    setIsLiking(true);

    try {
      const response = review.isLikedByCurrentUser
        ? await unlikeReview(review.id, token)
        : await likeReview(review.id, token);

      setReview((previousReview) => {
        if (!previousReview || previousReview.id !== response.reviewId) {
          return previousReview;
        }

        return {
          ...previousReview,
          likesCount: response.likesCount,
          isLikedByCurrentUser: response.isLikedByCurrentUser,
        };
      });
    } catch (error) {
      setAlertMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update review like.',
      );
    } finally {
      setIsLiking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-(--text-secondary)">Loading review details...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--surface) px-6 py-12 text-center">
        <p className="text-(--text-secondary)">
          {error || 'Review not found.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <ReviewCard
        review={review}
        currentUserId={currentUserId}
        token={token}
        isLiking={isLiking}
        onToggleLike={handleToggleLike}
        onLogin={() => navigate('/login')}
        onCommentsCountChange={handleCommentsCountChange}
        defaultCommentsExpanded
      />

      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
}

export function ReviewDetails() {
  const { id } = useParams();
  const { isAuthenticated, session } = useAuth();

  const reviewId = Number(id);

  const isValidReviewId =
    Boolean(id) &&
    /^\d+$/.test(id ?? '') &&
    Number.isInteger(reviewId) &&
    reviewId > 0 &&
    reviewId <= 2147483647;

  const token = isAuthenticated ? session?.token : undefined;

  const currentUserId = isAuthenticated ? (session?.id ?? null) : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <Link
        to="/reviews"
        className="inline-flex items-center gap-2 text-sm text-(--text-secondary) transition-colors hover:text-(--text-primary)"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to reviews
      </Link>

      <h1 className="mt-6 text-3xl font-light text-(--text-primary) md:text-4xl">
        Review Details
      </h1>

      <div className="mt-8">
        {isValidReviewId ? (
          <ReviewDetailsContent
            key={`${reviewId}-${currentUserId ?? 'guest'}`}
            reviewId={reviewId}
            currentUserId={currentUserId}
            token={token}
          />
        ) : (
          <div className="rounded-xl border border-(--border) bg-(--surface) px-6 py-12 text-center">
            <p className="text-(--text-secondary)">Invalid review ID.</p>
          </div>
        )}
      </div>
    </section>
  );
}
