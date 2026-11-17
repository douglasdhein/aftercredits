import type { CastMember } from '../types/cast';
import type {
  MovieDetails,
  PopularMoviesResponse,
  TrendingMoviesResponse,
} from '../types/movie';
import type { TrailerVideo } from '../types/trailer';

const API_URL = import.meta.env.VITE_API_URL;

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

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const response = await fetch(`${API_URL}/movies/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch movie details.');
  }

  return response.json();
}

export async function getMovieCast(id: string): Promise<CastMember[]> {
  const response = await fetch(`${API_URL}/movies/${id}/cast`);

  if (!response.ok) {
    throw new Error('Failed to fetch movie cast.');
  }

  return response.json();
}

export async function getMovieTrailer(
  id: string,
): Promise<TrailerVideo | null> {
  const response = await fetch(`${API_URL}/movies/${id}/trailer`);

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch movie trailer.');
  }

  return response.json();
}

export async function getMovies(
  page: number,
): Promise<PopularMoviesResponse> {
  const response = await fetch(`${API_URL}/movies?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch movies.');
  }

  return response.json();
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<PopularMoviesResponse> {
  const response = await fetch(
    `${API_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
  );

  if (!response.ok) {
    throw new Error('Failed to search movies.');
  }

  return response.json();
}