export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TrendingTvShowsResponse {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
}