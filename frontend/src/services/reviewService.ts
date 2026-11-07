import type {
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from '../types/review';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const errorData: ApiErrorResponse = await response.json();

    if (errorData.message) {
      return errorData.message;
    }

    if (errorData.errors) {
      const firstError = Object.values(errorData.errors)[0]?.[0];

      if (firstError) {
        return firstError;
      }
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

export async function getReviews(
  mediaId: number,
  mediaType: string,
): Promise<Review[]> {
  const response = await fetch(
    `${API_URL}/reviews?mediaId=${mediaId}&mediaType=${encodeURIComponent(mediaType)}`,
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to load reviews.',
    );

    throw new Error(message);
  }

  return response.json();
}

export async function getCurrentUserReview(
  mediaId: number,
  mediaType: string,
  token: string,
): Promise<Review | null> {
  const response = await fetch(
    `${API_URL}/reviews/me?mediaId=${mediaId}&mediaType=${encodeURIComponent(mediaType)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to load your review.',
    );

    throw new Error(message);
  }

  return response.json();
}

export async function createReview(
  data: CreateReviewRequest,
  token: string,
): Promise<Review> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to create review.',
    );

    throw new Error(message);
  }

  return response.json();
}

export async function updateReview(
  id: number,
  data: UpdateReviewRequest,
  token: string,
): Promise<Review> {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to update review.',
    );

    throw new Error(message);
  }

  return response.json();
}

export async function deleteReview(
  id: number,
  token: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Failed to delete review.',
    );

    throw new Error(message);
  }
}