import { UserRound } from 'lucide-react';
import type { CastMember } from '../../types/cast';

interface CastCardProps {
  castMember: CastMember;
}

export function CastCard({ castMember }: CastCardProps) {
  const profileUrl = castMember.profile_path
    ? `https://image.tmdb.org/t/p/w500${castMember.profile_path}`
    : null;

  const character = castMember.character || 'Character unavailable';

  return (
    <div className="w-full overflow-hidden rounded-lg border border-(--border) bg-(--surface-secondary)">
      {profileUrl ? (
        <img
          src={profileUrl}
          alt={castMember.name}
          className="aspect-2/3 w-full object-cover"
        />
      ) : (
        <div className="flex aspect-2/3 w-full items-center justify-center bg-(--surface)">
          <UserRound
            className="h-10 w-10 text-(--text-tertiary)"
            strokeWidth={1.5}
          />
        </div>
      )}

      <div className="p-2.5">
        <h3
          title={castMember.name}
          className="truncate text-sm font-medium text-(--text-primary)"
        >
          {castMember.name}
        </h3>

        <p
          title={character}
          className="mt-1 truncate text-xs leading-5 text-(--text-secondary)"
        >
          {character}
        </p>
      </div>
    </div>
  );
}
