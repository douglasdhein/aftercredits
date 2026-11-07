export interface Review {
  id: number;
  userId: number;
  userName: string;
  mediaId: number;
  mediaType: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReviewRequest {
  mediaId: number;
  mediaType: string;
  rating: number;
  content: string;
}

export interface UpdateReviewRequest {
  rating: number;
  content: string;
}