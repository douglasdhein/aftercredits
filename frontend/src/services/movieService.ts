import type { PopularMoviesResponse, TrendingMoviesResponse } from '../types/movie';

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export async function getPopularMovies(): Promise<PopularMoviesResponse> {
  const response = await fetch(`${API_URL}/movies/popular`);

  if (!response.ok) {
    throw new Error('Failed to fetch popular movies.');
  }

  return response.json();
}

export async function getTrendingMovies(): Promise<TrendingMoviesResponse> {
  const response = await fetch(`${API_URL}/movies/trending`);

  if (!response.ok) {
    throw new Error('Failed to fetch trending movies.');
  }

  return response.json();
}