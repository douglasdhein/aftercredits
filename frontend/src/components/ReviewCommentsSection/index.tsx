import { Pencil, Send, Trash2 } from 'lucide-react';
import { type SubmitEvent, useState } from 'react';
import type { ReviewComment } from '../../types/reviewComment';

interface ReviewCommentsSectionProps {
  reviewId: number;
  comments: ReviewComment[];
  currentUserId: number | null;
  isLoading: boolean;
  error: string;
  onLogin: () => void;
  onRetry: () => void;
  onCreate: (content: string) => Promise<void>;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const MAX_COMMENT_LENGTH = 500;

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function ReviewCommentsSection({
  reviewId,
  comments,
  currentUserId,
  isLoading,
  error,
  onLogin,
  onRetry,
  onCreate,
  onUpdate,
  onDelete,
}: ReviewCommentsSectionProps) {
  const [content, setContent] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  const [pendingAction, setPendingAction] = useState<'save' | 'delete' | null>(
    null,
  );

  const [actionError, setActionError] = useState('');

  const isSubmitting = pendingAction !== null;

  const isEditing = editingCommentId !== null;

  const actionButtonClasses =
    'inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg border border-(--border-strong) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50';

  function handleEdit(comment: ReviewComment) {
    setEditingCommentId(comment.id);
    setDeletingCommentId(null);
    setContent(comment.content);
    setActionError('');
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setContent('');
    setActionError('');
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentUserId === null) {
      onLogin();
      return;
    }

    const normalizedContent = content.trim();

    if (
      !normalizedContent ||
      normalizedContent.length > MAX_COMMENT_LENGTH ||
      isSubmitting
    ) {
      return;
    }

    setPendingAction('save');
    setActionError('');

    try {
      if (editingCommentId !== null) {
        await onUpdate(editingCommentId, normalizedContent);
      } else {
        await onCreate(normalizedContent);
      }

      setContent('');
      setEditingCommentId(null);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Failed to save comment.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete(commentId: number) {
    if (currentUserId === null || isSubmitting) {
      return;
    }

    setPendingAction('delete');
    setActionError('');

    try {
      await onDelete(commentId);

      setDeletingCommentId(null);

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setContent('');
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Failed to delete comment.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section
      id={`review-comments-${reviewId}`}
      aria-label="Review comments"
      className="mt-5 border-t border-(--border) pt-5"
    >
      {isLoading && (
        <p className="py-4 text-sm text-(--text-secondary)">
          Loading comments...
        </p>
      )}

      {!isLoading && error && (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className={actionButtonClasses}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {comments.length === 0 && (
            <p className="py-2 text-sm text-(--text-secondary)">
              No comments yet.
            </p>
          )}

          {comments.length > 0 && (
            <div className="flex flex-col gap-3">
              {comments.map((comment) => {
                const isOwner = currentUserId === comment.userId;

                const isConfirmingDelete = deletingCommentId === comment.id;

                return (
                  <article
                    key={comment.id}
                    className="rounded-lg border border-(--border) bg-(--surface-secondary) p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-(--text-primary)">
                        {comment.userName}
                      </span>

                      <span className="text-xs text-(--text-tertiary)">
                        {formatCommentDate(comment.createdAt)}

                        {comment.updatedAt &&
                          ` • Edited ${formatCommentDate(comment.updatedAt)}`}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 wrap-anywhere text-(--text-secondary)">
                      {comment.content}
                    </p>

                    {isOwner && !isConfirmingDelete && (
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(comment)}
                          disabled={isSubmitting}
                          aria-label="Edit comment"
                          title="Edit comment"
                          className={actionButtonClasses}
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeletingCommentId(comment.id);
                            setActionError('');
                          }}
                          disabled={isSubmitting}
                          aria-label="Delete comment"
                          title="Delete comment"
                          className={`${actionButtonClasses} hover:border-red-500/40 hover:text-red-500`}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    )}

                    {isOwner && isConfirmingDelete && (
                      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-(--border) pt-3">
                        <p className="mr-auto text-xs text-(--text-secondary)">
                          Delete this comment?
                        </p>

                        <button
                          type="button"
                          onClick={() => setDeletingCommentId(null)}
                          disabled={isSubmitting}
                          className={actionButtonClasses}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(comment.id)}
                          disabled={isSubmitting}
                          className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {pendingAction === 'delete'
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {currentUserId !== null ? (
            <form onSubmit={handleSubmit} className="mt-5">
              {isEditing && (
                <p className="mb-3 text-sm font-medium text-(--text-primary)">
                  Edit your comment
                </p>
              )}

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={MAX_COMMENT_LENGTH}
                disabled={isSubmitting}
                aria-label={isEditing ? 'Edit your comment' : 'Write a comment'}
                placeholder={
                  isEditing ? 'Edit your comment...' : 'Write a comment...'
                }
                rows={3}
                className="w-full resize-y rounded-lg border border-(--border-strong) bg-(--surface-secondary) px-4 py-3 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--text-tertiary) focus:border-(--rating-border) disabled:opacity-50"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-(--text-tertiary)">
                  {content.length} / {MAX_COMMENT_LENGTH}
                </span>

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className={actionButtonClasses}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-(--rating-border) bg-(--rating-background) px-3 text-sm font-medium text-(--rating-text) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" strokeWidth={1.5} />

                    {pendingAction === 'save'
                      ? 'Saving...'
                      : isEditing
                        ? 'Save changes'
                        : 'Post comment'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-(--border) bg-(--surface-secondary) p-4">
              <p className="text-sm text-(--text-secondary)">
                Log in to write a comment.
              </p>

              <button
                type="button"
                onClick={onLogin}
                className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-(--rating-border) bg-(--rating-background) px-3 text-xs font-medium text-(--rating-text) transition-opacity hover:opacity-90"
              >
                Log in
              </button>
            </div>
          )}

          {actionError && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {actionError}
            </p>
          )}
        </>
      )}
    </section>
  );
}
