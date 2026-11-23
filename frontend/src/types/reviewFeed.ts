export interface ReviewFeedItem {
  id: number;
  userId: number;
  userName: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  posterPath: string | null;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ReviewFeedResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  results: ReviewFeedItem[];
}

export type ReviewFeedMediaType = 'movie' | 'tv';

export type ReviewFeedSort = 'newest' | 'oldest';

export interface ReviewFeedFilters {
  page?: number;
  pageSize?: number;
  mediaType?: ReviewFeedMediaType;
  sort?: ReviewFeedSort;
  onlyMine?: boolean;
}