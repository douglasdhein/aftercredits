import type { ReviewFeedItem } from '../types/reviewFeed';

const API_URL = import.meta.env.VITE_API_URL;

export async function getReviewDetails(
  id: number,
  token?: string,
): Promise<ReviewFeedItem | null> {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch review details.');
  }

  return response.json();
}