import type { ReviewLikeResponse } from '../types/reviewLike';

const API_URL = import.meta.env.VITE_API_URL;

export async function likeReview(
  reviewId: number,
  token: string,
): Promise<ReviewLikeResponse> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/likes`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 401) {
    throw new Error('You must be logged in to like a review.');
  }

  if (response.status === 404) {
    throw new Error('Review not found.');
  }

  if (!response.ok) {
    throw new Error('Failed to like review.');
  }

  return response.json();
}

export async function unlikeReview(
  reviewId: number,
  token: string,
): Promise<ReviewLikeResponse> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/likes`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 401) {
    throw new Error('You must be logged in to unlike a review.');
  }

  if (response.status === 404) {
    throw new Error('Review not found.');
  }

  if (!response.ok) {
    throw new Error('Failed to unlike review.');
  }

  return response.json();
}