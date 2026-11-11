import {
  Bookmark,
  FileX2,
  Heart,
  MessageSquareText,
  Pencil,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertModal } from '../../components/AlertModal';
import { CreateReviewModal } from '../../components/CreateReviewModal';
import { ReviewsModal } from '../../components/ReviewsModal';
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { getMovieDetails } from '../../services/movieService';
import { getCurrentUserReview } from '../../services/reviewService';
import type { MovieDetails as MovieDetailsType } from '../../types/movie';
import { formatDate } from '../../utils/formatDate';

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, session } = useAuth();

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    async function loadMovieDetails() {
      if (!id) {
        setError('Movie not found.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch {
        setError('Failed to load movie details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <p className="text-(--text-secondary)">Loading movie details...</p>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <p className="text-(--text-secondary)">{error || 'Movie not found.'}</p>
      </section>
    );
  }

  const movieId = movie.id;

  async function handleCreateReview() {
    if (!isAuthenticated || !session?.token) {
      navigate('/login');
      return;
    }

    setIsCheckingReview(true);

    try {
      const currentUserReview = await getCurrentUserReview(
        movieId,
        'movie',
        session.token,
      );

      if (currentUserReview) {
        setAlertMessage('You have already reviewed this title.');
        return;
      }

      setIsCreateReviewOpen(true);
    } catch {
      setAlertMessage('Failed to check your review. Please try again.');
    } finally {
      setIsCheckingReview(false);
    }
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[360px_1fr]">
            <div>
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="aspect-2/3 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-2/3 w-full items-center justify-center rounded-xl border border-(--border) bg-(--surface-secondary)">
                  <FileX2
                    className="h-14 w-14 text-(--text-tertiary)"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-light text-(--text-primary)">
                {movie.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-(--text-secondary)">
                <span>{formatDate(movie.release_date)}</span>

                {movie.runtime !== null && movie.runtime > 0 && (
                  <>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                  </>
                )}
              </div>

              {movie.genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-(--border) bg-(--surface-secondary) px-3 py-1 text-xs text-(--text-secondary)"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-(--rating-border) bg-(--rating-background) px-2.5 py-1.5 text-sm font-medium text-(--rating-text)">
                  <Star className="h-4 w-4" strokeWidth={1.5} />
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
                >
                  <Heart className="h-4 w-4" />
                  Favorite
                </button>

                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
                >
                  <Bookmark className="h-4 w-4" />
                  Watchlist
                </button>

                <button
                  type="button"
                  onClick={handleCreateReview}
                  disabled={isCheckingReview}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                  {isCheckingReview ? 'Checking...' : 'Create review'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsReviewsOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-strong) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--surface-hover)"
                >
                  <MessageSquareText className="h-4 w-4" />
                  View reviews
                </button>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-medium text-(--text-primary)">
                  Overview
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-(--text-secondary)">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CreateReviewModal
        isOpen={isCreateReviewOpen}
        onClose={() => setIsCreateReviewOpen(false)}
        mediaId={movie.id}
        mediaType="movie"
        mediaTitle={movie.title}
        onCreated={() => setIsReviewsOpen(true)}
      />

      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        mediaId={movie.id}
        mediaType="movie"
        mediaTitle={movie.title}
      />

      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
}
