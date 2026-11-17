import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CastMember } from '../../types/cast';
import { CastCard } from '../CastCard';

interface CastCarouselProps {
  cast: CastMember[];
}

function getVisibleCount() {
  if (window.innerWidth < 640) {
    return 2;
  }

  if (window.innerWidth < 768) {
    return 3;
  }

  if (window.innerWidth < 1024) {
    return 5;
  }

  return 7;
}

export function CastCarousel({ cast }: CastCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    function handleResize() {
      setVisibleCount(getVisibleCount());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (cast.length === 0) {
    return null;
  }

  const safeCurrentIndex = currentIndex % cast.length;

  const numberOfVisibleMembers = Math.min(visibleCount, cast.length);

  const visibleCast = Array.from(
    { length: numberOfVisibleMembers },
    (_, index) => cast[(safeCurrentIndex + index) % cast.length],
  );

  const showNavigation = cast.length > numberOfVisibleMembers;

  function handlePrevious() {
    setCurrentIndex(
      (previousIndex) => (previousIndex - 1 + cast.length) % cast.length,
    );
  }

  function handleNext() {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % cast.length);
  }

  return (
    <div className="relative">
      {showNavigation && (
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous cast member"
          className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-(--border-strong) bg-(--surface) text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}

      <div className="flex justify-center gap-4 px-12">
        {visibleCast.map((castMember) => (
          <div key={castMember.id} className="w-30 shrink-0 sm:w-31.25">
            <CastCard castMember={castMember} />
          </div>
        ))}
      </div>

      {showNavigation && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next cast member"
          className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-(--border-strong) bg-(--surface) text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
