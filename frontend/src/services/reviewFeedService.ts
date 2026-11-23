import type {
  ReviewFeedFilters,
  ReviewFeedResponse,
} from '../types/reviewFeed';

const API_URL = import.meta.env.VITE_API_URL;

export async function getReviewFeed(
  filters: ReviewFeedFilters = {},
  token?: string,
): Promise<ReviewFeedResponse> {
  const {
    page = 1,
    pageSize = 10,
    mediaType,
    sort = 'newest',
    onlyMine = false,
  } = filters;

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
  });

  if (mediaType) {
    params.set('mediaType', mediaType);
  }

  if (onlyMine) {
    params.set('onlyMine', 'true');
  }

  const response = await fetch(
    `${API_URL}/reviews/feed?${params.toString()}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    },
  );

  if (response.status === 401) {
    throw new Error('You must be logged in to view your reviews.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch reviews.');
  }

  return response.json();
}