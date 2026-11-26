import { Heart } from 'lucide-react';

interface ReviewLikeButtonProps {
  likesCount: number;
  isLikedByCurrentUser: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function ReviewLikeButton({
  likesCount,
  isLikedByCurrentUser,
  isLoading,
  onToggle,
}: ReviewLikeButtonProps) {
  const buttonClasses =
    'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const activeClasses =
    'border-(--rating-border) bg-(--rating-background) text-(--rating-text)';

  const inactiveClasses =
    'border-(--border-strong) text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-pressed={isLikedByCurrentUser}
      aria-label={isLikedByCurrentUser ? 'Unlike review' : 'Like review'}
      title={isLikedByCurrentUser ? 'Unlike review' : 'Like review'}
      className={`${buttonClasses} ${
        isLikedByCurrentUser ? activeClasses : inactiveClasses
      }`}
    >
      <Heart
        className="h-4 w-4"
        strokeWidth={1.5}
        fill={isLikedByCurrentUser ? 'currentColor' : 'none'}
      />

      <span>
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
}
