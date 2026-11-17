import type { CastMember } from '../types/cast';
import type { TrailerVideo } from '../types/trailer';
import type {
  TrendingTvShowsResponse,
  TvShowDetails,
} from '../types/tvShow';

const API_URL = import.meta.env.VITE_API_URL;

export async function getTrendingTvShows(): Promise<TrendingTvShowsResponse> {
  const response = await fetch(`${API_URL}/tv-shows/trending`);

  if (!response.ok) {
    throw new Error('Failed to fetch trending TV shows.');
  }

  return response.json();
}

export async function getTvShowDetails(
  id: string,
): Promise<TvShowDetails> {
  const response = await fetch(`${API_URL}/tv-shows/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch TV show details.');
  }

  return response.json();
}

export async function getTvShowCast(
  id: string,
): Promise<CastMember[]> {
  const response = await fetch(`${API_URL}/tv-shows/${id}/cast`);

  if (!response.ok) {
    throw new Error('Failed to fetch TV show cast.');
  }

  return response.json();
}

export async function getTvShowTrailer(
  id: string,
): Promise<TrailerVideo | null> {
  const response = await fetch(`${API_URL}/tv-shows/${id}/trailer`);

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch TV show trailer.');
  }

  return response.json();
}

export async function getTvShows(
  page: number,
): Promise<TrendingTvShowsResponse> {
  const response = await fetch(`${API_URL}/tv-shows?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch TV shows.');
  }

  return response.json();
}

export async function searchTvShows(
  query: string,
  page: number = 1,
): Promise<TrendingTvShowsResponse> {
  const response = await fetch(
    `${API_URL}/tv-shows/search?query=${encodeURIComponent(query)}&page=${page}`,
  );

  if (!response.ok) {
    throw new Error('Failed to search TV shows.');
  }

  return response.json();
}