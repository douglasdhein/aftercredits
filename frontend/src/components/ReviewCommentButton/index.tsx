import { ChevronDown, ChevronUp, MessageSquareText } from 'lucide-react';

interface ReviewCommentButtonProps {
  reviewId: number;
  commentsCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ReviewCommentButton({
  reviewId,
  commentsCount,
  isExpanded,
  onToggle,
}: ReviewCommentButtonProps) {
  const buttonClasses =
    'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors';

  const activeClasses =
    'border-(--border-strong) bg-(--surface-hover) text-(--text-primary)';

  const inactiveClasses =
    'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? `review-comments-${reviewId}` : undefined}
      title={isExpanded ? 'Hide comments' : 'View comments'}
      className={`${buttonClasses} ${
        isExpanded ? activeClasses : inactiveClasses
      }`}
    >
      <MessageSquareText className="h-4 w-4" strokeWidth={1.5} />

      <span>
        {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
      </span>

      {isExpanded ? (
        <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
      ) : (
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      )}
    </button>
  );
}
