import { Play } from 'lucide-react';
import { useState } from 'react';
import type { TrailerVideo } from '../../types/trailer';

interface TrailerSectionProps {
  loadTrailer: () => Promise<TrailerVideo | null>;
}

export function TrailerSection({ loadTrailer }: TrailerSectionProps) {
  const [trailer, setTrailer] = useState<TrailerVideo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  async function handleToggleTrailer() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    if (hasLoaded) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await loadTrailer();

      setTrailer(data);
      setHasLoaded(true);
    } catch {
      setError('Failed to load trailer.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 border-t border-(--border) pt-8">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleToggleTrailer}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-4 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
        >
          <Play className="h-4 w-4" strokeWidth={1.5} />
          {isOpen ? 'Hide trailer' : 'Trailer'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6">
          {isLoading && (
            <p className="text-center text-sm text-(--text-secondary)">
              Loading trailer...
            </p>
          )}

          {!isLoading && error && (
            <p className="text-center text-sm text-(--text-secondary)">
              {error}
            </p>
          )}

          {!isLoading && !error && hasLoaded && !trailer && (
            <p className="text-center text-sm text-(--text-secondary)">
              Trailer unavailable.
            </p>
          )}

          {!isLoading && !error && trailer && (
            <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-(--border)">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
