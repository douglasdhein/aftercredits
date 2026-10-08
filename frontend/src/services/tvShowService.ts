import type { TrendingTvShowsResponse } from '../types/tvShow';

const API_URL = import.meta.env.VITE_API_URL;

export async function getTrendingTvShows(): Promise<TrendingTvShowsResponse> {
  const response = await fetch(`${API_URL}/tv-shows/trending`);

  if (!response.ok) {
    throw new Error('Failed to fetch trending TV shows.');
  }

  return response.json();
}