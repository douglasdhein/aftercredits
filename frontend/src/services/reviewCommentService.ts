import type {
  ReviewComment,
  CreateReviewCommentRequest,
  UpdateReviewCommentRequest,
} from '../types/reviewComment';

const API_URL = import.meta.env.VITE_API_URL;

async function getErrorMessage(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const data = await response.json();

    if (data.message) {
      return data.message;
    }

    if (data.errors) {
      const errors = Object.values(
        data.errors,
      ).flat();

      if (
        errors.length > 0 &&
        typeof errors[0] === 'string'
      ) {
        return errors[0];
      }
    }
  } catch {
    return defaultMessage;
  }

  return defaultMessage;
}

export async function getReviewComments(
  reviewId: number,
): Promise<ReviewComment[]> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/comments`,
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Failed to fetch review comments.',
      ),
    );
  }

  return response.json();
}

export async function createReviewComment(
  reviewId: number,
  data: CreateReviewCommentRequest,
  token: string,
): Promise<ReviewComment> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Failed to create review comment.',
      ),
    );
  }

  return response.json();
}

export async function updateReviewComment(
  reviewId: number,
  commentId: number,
  data: UpdateReviewCommentRequest,
  token: string,
): Promise<ReviewComment> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/comments/${commentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Failed to update review comment.',
      ),
    );
  }

  return response.json();
}

export async function deleteReviewComment(
  reviewId: number,
  commentId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/reviews/${reviewId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Failed to delete review comment.',
      ),
    );
  }
}