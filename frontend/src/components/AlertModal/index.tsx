import { X } from 'lucide-react';
import { useEffect } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-(--overlay) px-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg items-center justify-between gap-8 rounded-xl border border-(--border) bg-(--surface) px-6 py-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm leading-6 text-(--text-primary)">{message}</p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
