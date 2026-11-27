import { FileX2, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ReviewCommentButton } from '../ReviewCommentButton';
import { ReviewCommentsSection } from '../ReviewCommentsSection';
import { ReviewLikeButton } from '../ReviewLikeButton';
import {
  createReviewComment,
  deleteReviewComment,
  getReviewComments,
  updateReviewComment,
} from '../../services/reviewCommentService';
import type { ReviewComment } from '../../types/reviewComment';
import type { ReviewFeedItem } from '../../types/reviewFeed';

interface ReviewCardProps {
  review: ReviewFeedItem;
  currentUserId: number | null;
  token?: string;
  isLiking: boolean;
  onToggleLike: () => void;
  onLogin: () => void;
  onCommentsCountChange: (reviewId: number, commentsCount: number) => void;
}

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function ReviewCard({
  review,
  currentUserId,
  token,
  isLiking,
  onToggleLike,
  onLogin,
  onCommentsCountChange,
}: ReviewCardProps) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [commentsError, setCommentsError] = useState('');

  const posterUrl = review.posterPath
    ? `https://image.tmdb.org/t/p/w200${review.posterPath}`
    : null;

  const mediaUrl =
    review.mediaType === 'movie'
      ? `/movies/${review.mediaId}`
      : `/tv-shows/${review.mediaId}`;

  const date = review.updatedAt ?? review.createdAt;

  async function loadComments() {
    setIsLoadingComments(true);
    setCommentsError('');

    try {
      const data = await getReviewComments(review.id);

      setComments(data);
      setHasLoadedComments(true);

      onCommentsCountChange(review.id, data.length);
    } catch (error) {
      setCommentsError(
        error instanceof Error ? error.message : 'Failed to load comments.',
      );
    } finally {
      setIsLoadingComments(false);
    }
  }

  function handleToggleComments() {
    if (isCommentsExpanded) {
      setIsCommentsExpanded(false);
      return;
    }

    setIsCommentsExpanded(true);

    if (!hasLoadedComments && !isLoadingComments) {
      void loadComments();
    }
  }

  async function handleCreateComment(content: string) {
    if (!token) {
      throw new Error('You must be logged in to write a comment.');
    }

    const newComment = await createReviewComment(review.id, { content }, token);

    const updatedComments = [...comments, newComment];

    setComments(updatedComments);

    onCommentsCountChange(review.id, updatedComments.length);
  }

  async function handleUpdateComment(commentId: number, content: string) {
    if (!token) {
      throw new Error('You must be logged in to edit a comment.');
    }

    const updatedComment = await updateReviewComment(
      review.id,
      commentId,
      { content },
      token,
    );

    setComments((previousComments) =>
      previousComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  async function handleDeleteComment(commentId: number) {
    if (!token) {
      throw new Error('You must be logged in to delete a comment.');
    }

    await deleteReviewComment(review.id, commentId, token);

    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId,
    );

    setComments(updatedComments);

    onCommentsCountChange(review.id, updatedComments.length);
  }

  return (
    <article className="rounded-xl border border-(--border) bg-(--surface) p-5 md:p-6">
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ReviewLikeButton
              likesCount={review.likesCount}
              isLikedByCurrentUser={review.isLikedByCurrentUser}
              isLoading={isLiking}
              onToggle={onToggleLike}
            />

            <ReviewCommentButton
              reviewId={review.id}
              commentsCount={review.commentsCount}
              isExpanded={isCommentsExpanded}
              onToggle={handleToggleComments}
            />
          </div>
        </div>
      </div>

      {(isCommentsExpanded || hasLoadedComments) && (
        <div hidden={!isCommentsExpanded}>
          <ReviewCommentsSection
            reviewId={review.id}
            comments={comments}
            currentUserId={currentUserId}
            isLoading={isLoadingComments}
            error={commentsError}
            onLogin={onLogin}
            onRetry={() => void loadComments()}
            onCreate={handleCreateComment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        </div>
      )}
    </article>
  );
}
