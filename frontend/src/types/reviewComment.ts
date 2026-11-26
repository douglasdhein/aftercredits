export interface ReviewComment {
  id: number;
  reviewId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReviewCommentRequest {
  content: string;
}

export interface UpdateReviewCommentRequest {
  content: string;
}